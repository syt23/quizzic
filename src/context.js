import React, { useState, useContext } from "react";
import axios from "axios";
import { CN, END_STATUS, KR, START_STATUS } from "./constants";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [subLevelOptions, setSubLevelOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [numCorrectAnswers, setCorrent] = useState(0);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("start");
  const [answered, setAnswered] = useState(false);
  const [quiz, setQuiz] = useState({
    numQuestions: 10,
    language: "",
    level: "",
    direction: "e2k",
    subLevel: [],
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const levelOptions = {
    cn: [1],
    kr: [1, 2, 3, 4, 5, 6],
  };
  const directionOptions = {
    cn: [
      {
        label: "English to Chinese",
        value: "e2c",
      },
      {
        label: "Chinese to English",
        value: "c2e",
      },
    ],
    kr: [
      {
        label: "English to Korean",
        value: "e2k",
      },
      {
        label: "Korean to English",
        value: "k2e",
      },
    ],
  };
  const languagesOptions = [
    {
      label: "Chinese",
      value: "cn",
    },
    {
      label: "Korean",
      value: "kr",
    },
  ];
  const NUM_OPTIONS = 4;

  const getSecondNumber = (fileName) => {
    const regex = /^\d+-(\d+)\.csv$/;
    const match = fileName.match(regex);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    } else {
      console.log("Format is unexpected", fileName);
    }
    return null;
  };

  const getFileNameWithoutExtension = (fileName) => {
    const regex = /^([\w-]+)\.csv$/;
    const match = fileName.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      console.log("Format is unexpected", fileName);
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
        if (language == KR) {
          subLevels = res.map((x) => getSecondNumber(x)).sort((a, b) => a - b);
        } else {
          subLevels = res.map((x) => getFileNameWithoutExtension(x));
        }
      }
      return subLevels;
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
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
            values = [
              row.split(",")[0],
              /".*"/.exec(row)[0].replaceAll('"', ""),
            ];
          } else {
            values = row.split(delim);
          }
          const eachObject = headers.reduce((obj, header, i) => {
            console.log(obj, header, i, values, row);
            obj[header] = values[i].trim();
            return obj;
          }, {});
          return eachObject;
        });
      return newArray;
    } catch (err) {
      console.log(err);
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
      direction === "e2k" ? word.korean : word.english
    );
    let questions = [];
    if (csvArray.length > 0) {
      csvArray.forEach((item) => {
        questions.push({
          correctAnswer: direction === "e2k" ? item.korean : item.english,
          answerOptions: getAnswerOptions(
            answers,
            direction === "e2k" ? item.korean : item.english,
            NUM_OPTIONS
          ),
          question: direction === "e2k" ? item.english : item.korean,
        });
      });
      shuffleArray(questions);
      questions = questions.slice(0, numQuestions);
      console.log("shuffled", questions);
      return questions;
    } else {
      throw Error("No questions to parse");
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let totalReponse = "";
      for (let i = 0; i < quiz.subLevel.length; i++) {
        let url = `/data/${quiz.language}/level${quiz.level}/${quiz.subLevel[i]}.csv`;
        if (quiz.language === KR) {
          url = `/data/${quiz.language}/level${quiz.level}/${quiz.level}-${quiz.subLevel[i]}.csv`;
        }

        const response = await axios
          .get(url, {
            responseType: "text",
          })
          .catch((e) => {
            console.log("Exception fetching data", e);
            setError(true);
            return;
          });
        console.log("response", response);
        totalReponse += "\n" + response.data;
      }
      totalReponse = totalReponse.trim();

      const csvArray = processCSV(totalReponse);
      const questions = getQuestionsFromCsvArray(csvArray);
      if (questions.length > 0) {
        setQuestions(questions);
        setLoading(false);
        setError(false);
        setAnswered(false);
        setCorrent(0);
        setStatus("progress");
        setQuiz({
          ...quiz,
          description: `${quiz.level}-${quiz.subLevel}`,
        });
      } else {
        setLoading(false);
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
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
    if (name == "language") {
      newQuiz = setLevel(newQuiz, value);
      fetchAndSetSubLevelOptions(newQuiz.language, newQuiz.level);
    } else if (name == "level") {
      fetchAndSetSubLevelOptions(newQuiz.language, newQuiz.level);
    }
    setQuiz({
      ...newQuiz,
    });
  };

  const setLevel = (newQuiz, language) => {
    if (language in levelOptions) {
      newQuiz.level = levelOptions[language][0];
    } else {
      console.log("No such language: " + language + ", set to default (cn)");
      newQuiz.level = levelOptions[CN][0];
    }
    return newQuiz;
  };

  const fetchAndSetSubLevelOptions = async (language, level) => {
    const subLevels = await fetchSubLevelOptions(language, level);
    console.log("subLevels", subLevels);
    setSubLevelOptions(subLevels);
  };

  const handleMultiSelectChange = (e) => {
    const { name } = e.target;
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    console.log(value);
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
        levelOptions,
        languagesOptions,
        directionOptions,
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
