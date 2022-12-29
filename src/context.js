import React, { useState, useContext } from "react";
import axios from "axios";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const AppContext = React.createContext();
// {
//   isLoading: false,
//   questions: [],
//   index: 0,
//   correct: 0,
//   error: false,
//   status: "start",
//   quiz: {},
// }

const AppProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [numCorrectAnswers, setCorrent] = useState(0);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("start");
  const [quiz, setQuiz] = useState({
    // numQuestions: 10,
    // level: 1,
    // subLevel: 1,
    // description: "",
    amount: 10,
    difficulty: "easy",
    category: "sports",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuestions = async (url) => {
    setLoading(true);
    console.log(url);
    const response = await axios(url).catch((err) => console.log(err));
    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setError(false);
        setStatus("progress");
      } else {
        setLoading(false);
        setError(true);
      }
    } else {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        setStatus("end");
        return 0;
      } else {
        return index;
      }
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const checkAnswer = (value) => {
    console.log(numCorrectAnswers);
    if (value) {
      setCorrent((oldState) => oldState + 1);
    }
    nextQuestion();
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
    const { amount, category, difficulty } = quiz;
    console.log(quiz);
    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    fetchQuestions(url);
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
        nextQuestion,
        checkAnswer,
        closeModal,
        openModal,
        handleChange,
        handleSubmit,
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
