import axios from "axios";
import React, { useContext, useState } from "react";
import {
  CN_LANGUAGE,
  DIRECTION_OPTIONS,
  END_STATUS,
  FORMAT_OPTIONS,
  KR_LANGUAGE,
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
  START_STATUS,
} from "./constants";

const AppContext = React.createContext(null);

const AppProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [subLevelOptions, setSubLevelOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [numCorrectAnswers, setCorrent] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("start");
  const [answered, setAnswered] = useState(false);
  const [quiz, setQuiz] = useState({
    numQuestions: 10,
    language: "",
    level: 1,
    direction: "e2k",
    subLevel: [],
    description: "",
    format: "mcq",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const NUM_OPTIONS = 4;

  const getSecondNumber = (fileName) => {
    const regex = /^\d+-(\d+)\.csv$/;
    const match = fileName.match(regex);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    } else {
      console.warn("Format is unexpected", fileName);
    }
    return null;
  };

  const getFileNameWithoutExtension = (fileName) => {
    const regex = /^([\w-]+)\.csv$/;
    const match = fileName.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      console.warn("Format is unexpected", fileName);
    }
    return null;
  };

  const fetchSubLevelOptions = async (language, level) => {
    try {
      const response = await axios.get(`/data/${language}/level${level}`, {
        responseType: "text",
      });

      let subLevels = [];
      let res = JSON.parse(response.data);
      if (res && res.length > 0) {
        if (language === KR_LANGUAGE) {
          subLevels = res
            .map((x) => getSecondNumber(x))
            .sort((a, b) => a - b)
            .map((x) => ({ key: x, value: x, label: `Sub Level ${x}` }));
        } else if (language === CN_LANGUAGE) {
          subLevels = res
            .map((x) => getFileNameWithoutExtension(x))
            .map((x) => ({ key: x, value: x, label: `Sub Level ${x}` }));
        } else {
          console.error("No such language: " + language);
        }
      }
      return subLevels;
    } catch (err) {
      console.error("error", err);
      setLoading(false);
      setError(err.message);
    }
  };

  const processCSV = (str, delim = ",") => {
    // const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const headers = ["korean", "english"];
    const rows = str.split("\n");

    try {
      const newArray = rows
        .filter((row) => row !== "")
        .map((row) => {
          let values;
          if (/.*".*".*/.test(row)) {
            const result = /".*"/.exec(row)?.[0]?.replaceAll('"', "") ?? "";
            values = [row.split(",")[0], result];
          } else {
            values = row.split(delim);
          }
          const eachObject = headers.reduce((obj, header, i) => {
            // console.debug(obj, header, i, values, row);
            obj[header] = values[i].trim();
            return obj;
          }, {});
          return eachObject;
        });
      return newArray;
    } catch (err) {
      console.error("error", err);
      throw Error("Error in parsing csv");
    }
  };

  const getAnswerOptions = (answers, correctAnswer, numOptions) => {
    const finalAnswers = [];
    if (answers.length === 0) {
      throw new Error("Answer bank is empty");
    }
    for (let i = 0; i < numOptions; i++) {
      let answer = "";
      while (
        answer === "" ||
        answer === correctAnswer ||
        finalAnswers.includes(answer)
      ) {
        const answerIndex = Math.floor(Math.random() * answers.length);
        answer = answers[answerIndex];
      }
      finalAnswers.push(answer);
    }
    // Slot in correct answer randomly
    const tempIndex = Math.floor(Math.random() * (finalAnswers.length + 1));
    if (tempIndex === finalAnswers.length) {
      finalAnswers.push(correctAnswer);
    } else {
      finalAnswers.push(finalAnswers[tempIndex]);
      finalAnswers[tempIndex] = correctAnswer;
    }
    return finalAnswers;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const getQuestionsFromCsvArray = (csvArray) => {
    const { numQuestions, direction } = quiz;
    const answers = csvArray.map((word) =>
      direction === "e2k" ? word.korean : word.english,
    );
    let questions = [];
    if (csvArray.length > 0) {
      csvArray.forEach((item) => {
        questions.push({
          correctAnswer: direction === "e2k" ? item.korean : item.english,
          answerOptions: getAnswerOptions(
            answers,
            direction === "e2k" ? item.korean : item.english,
            NUM_OPTIONS,
          ),
          question: direction === "e2k" ? item.english : item.korean,
        });
      });
      shuffleArray(questions);
      questions = questions.slice(0, numQuestions);
      console.debug("shuffled", questions);
      return questions;
    } else {
      throw Error("No questions to parse");
    }
  };

  const getQuestionsFromCsv = async (language, level, subLevel) => {
    let totalReponse = "";
    for (let i = 0; i < subLevel.length; i++) {
      let url = `/data/${language}/level${level}/${subLevel[i]}.csv`;
      if (language === KR_LANGUAGE) {
        url = `/data/${language}/level${level}/${level}-${subLevel[i]}.csv`;
      } else if (language === CN_LANGUAGE) {
        url = `/data/${language}/level${level}/${subLevel[i]}.csv`;
      } else {
        console.error("No such language: " + language);
      }

      const response = await axios.get(url, {
        responseType: "text",
      });

      console.debug("getQuestionsFromCsv", response);
      totalReponse += "\n" + response.data;
    }
    totalReponse = totalReponse.trim();

    const csvArray = processCSV(totalReponse);
    return csvArray;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const csvArray = await getQuestionsFromCsv(
        quiz.language,
        quiz.level,
        quiz.subLevel,
      );
      const questions = getQuestionsFromCsvArray(csvArray);
      if (questions.length > 0) {
        setQuestions(questions);
        setLoading(false);
        setError("");
        setAnswered(false);
        setCorrent(0);
        setStatus("progress");
        setQuiz({
          ...quiz,
          description: `${quiz.level}-${quiz.subLevel}`,
        });
      } else {
        setLoading(false);
        setError(
          "No questions generated, please check if the csv files are in the correct format and not empty",
        );
      }
    } catch (err) {
      console.error("error", err);
      setLoading(false);
      setError(err.message);
    }
  };

  const nextQuestion = () => {
    if (answered) {
      setAnswered(false);
      setIndex((oldIndex) => {
        const index = oldIndex + 1;
        if (index > questions.length - 1) {
          setStatus(END_STATUS);
          openModal();
          return 0;
        } else {
          return index;
        }
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const checkAnswer = (value) => {
    if (value) {
      setCorrent((oldState) => oldState + 1);
    }
    setAnswered(true);
    // nextQuestion();
  };

  const closeModal = () => {
    setStatus(START_STATUS);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newQuiz = quiz;
    newQuiz[name] = value;
    if (name === "language") {
      newQuiz = setLevel(newQuiz, value);
      setQuiz({
        ...quiz,
        level: 1,
        subLevel: [1],
      });
      fetchAndSetSubLevelOptions(newQuiz.language, newQuiz.level);
    } else if (name === "level") {
      setQuiz({
        ...quiz,
        subLevel: [1],
      });
      fetchAndSetSubLevelOptions(newQuiz.language, newQuiz.level);
    }
    setQuiz({
      ...newQuiz,
    });
  };

  const setLevel = (newQuiz, language) => {
    if (language in LEVEL_OPTIONS) {
      newQuiz.level = LEVEL_OPTIONS[language][0].value;
    } else {
      console.warn("No such language: " + language + ", set to default (cn)");
      newQuiz.level = LEVEL_OPTIONS[CN_LANGUAGE][0].value;
    }
    return newQuiz;
  };

  const fetchAndSetSubLevelOptions = async (language, level) => {
    const subLevels = await fetchSubLevelOptions(language, level);
    console.debug("fetchAndSetSubLevelOptions", subLevels);
    setSubLevelOptions(subLevels);
  };

  const handleMultiSelectChange = (e) => {
    const { name } = e.target;
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    console.debug("handleMultiSelectChange", value);
    setQuiz({
      ...quiz,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleExit = (e) => {
    e.preventDefault();
    setStatus(START_STATUS);
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        questions,
        index,
        numCorrectAnswers,
        error,
        quiz,
        subLevelOptions,
        status,
        isModalOpen,
        answered,
        nextQuestion,
        checkAnswer,
        closeModal,
        openModal,
        handleChange,
        handleMultiSelectChange,
        handleSubmit,
        handleExit,
        fetchSubLevelOptions,
        getQuestionsFromCsv,
        LEVEL_OPTIONS,
        LANGUAGE_OPTIONS,
        DIRECTION_OPTIONS,
        FORMAT_OPTIONS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
