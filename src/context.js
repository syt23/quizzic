import React, { useState, useContext } from "react";
import axios from "axios";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [numCorrectAnswers, setCorrent] = useState(0);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("start");
  const [answered, setAnswered] = useState(false);
  const [quiz, setQuiz] = useState({
    numQuestions: 10,
    level: 1,
    direction: "e2k",
    subLevel: 1,
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const NUM_SUBLEVELS = {
    1: 30,
    2: 25,
    3: 25,
    4: 25,
    5: 25,
    6: 25,
  };
  const NUM_OPTIONS = 4;

  const processCSV = (str, delim = ",") => {
    // const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const headers = ["korean", "english"];
    const rows = str.split("\n");

    try {
      const newArray = rows.map((row) => {
        const values = row.split(delim);
        const eachObject = headers.reduce((obj, header, i) => {
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

  const getQuestionsFromCsvArray = (csvArray) => {
    const { numQuestions, direction } = quiz;
    const answers = csvArray.map((word) =>
      direction === "e2k" ? word.korean : word.english
    );
    const sliceArray = csvArray.slice(0, numQuestions);
    const questions = [];
    if (sliceArray.length > 0) {
      sliceArray.forEach((item) => {
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
      return questions;
    } else {
      throw Error("No questions to parse");
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(require("./data/level1/1-1.csv"), {
        responseType: "text",
      });
      const csvArray = processCSV(response.data);
      const questions = getQuestionsFromCsvArray(csvArray);
      if (questions.length > 0) {
        setQuestions(questions);
        setLoading(false);
        setError(false);
        setAnswered(false);
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
          setStatus("end");
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
    console.log(answered);
    // nextQuestion();
  };

  const closeModal = () => {
    setCorrent(0);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz({
      ...quiz,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
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
        status,
        isModalOpen,
        answered,
        nextQuestion,
        checkAnswer,
        closeModal,
        openModal,
        handleChange,
        handleSubmit,
        NUM_SUBLEVELS,
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
