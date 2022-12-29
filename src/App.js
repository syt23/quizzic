import "./App.css";
import { useGlobalContext } from "./context";
import QuizForm from "./components/QuizForm";
import { useEffect } from "react";
import Loading from "./components/Loading";

function App() {
  const {
    status,
    isLoading,
    questions,
    quiz,
    index,
    numCorrectAnswers,
    nextQuestion,
    checkAnswer,
    answered,
  } = useGlobalContext();

  const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // useEffect(() => {
  //   console.log("numCorrectAnswers", numCorrectAnswers);
  // }, []);

  if (status === "start") {
    return <QuizForm />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const { question, answerOptions, correctAnswer } = questions[index];

  return (
    <main className="quiz-container">
      <h2 className="app-title">Quizzic</h2>
      <p className="app-subtitle">Quiz {quiz.description}</p>
      <section className="quiz">
        <div className="row-box">
          <p>
            Correct Answer: {numCorrectAnswers}/{index}
          </p>
          <p>Questions: {quiz.numQuestions}</p>
        </div>
        <article className="container">
          <h2>
            {index + 1}. {capitalise(question)}
          </h2>
          <div>
            {answerOptions &&
              answerOptions.map((answer, index) => {
                return (
                  <button
                    key={index}
                    className={`btn answer-btn ${
                      answered
                        ? correctAnswer === answer
                          ? "btn-success"
                          : "btn-danger"
                        : "btn-info"
                    }`}
                    onClick={() => checkAnswer(correctAnswer === answer)}
                  >
                    {answer}
                  </button>
                );
              })}
          </div>
        </article>
        <button
          className="btn btn-warning next-question-btn"
          onClick={nextQuestion}
          disabled={!answered}
        >
          Next Question
        </button>
      </section>
    </main>
  );
}

export default App;
