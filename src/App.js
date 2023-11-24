import "./App.css";
import { useGlobalContext } from "./context";
import QuizForm from "./components/QuizForm";
import { useEffect } from "react";
import Loading from "./components/Loading";
import Modal from "./components/Modal";

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
    handleExit,
  } = useGlobalContext();

  const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // useEffect(() => {
  //   console.log("numCorrectAnswers", numCorrectAnswers);
  // }, []);

  if (isLoading) {
    return <Loading />;
  }
  
  if (status === "start") {
    return <QuizForm />;
  }


  const { question, answerOptions, correctAnswer } = questions[index];

  return (
    <>
      <Modal />
      <main className="quiz-container">
        <h2 className="app-title">Quizzic</h2>
        <p className="app-subtitle">Quiz {quiz.description}</p>
        <section className="quiz">
          <div className="container">
            <div className="row-box">
              <p>Correct Answers: {numCorrectAnswers}</p>
              <p>Questions: {questions.length}</p>
            </div>
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
                      onClick={() => {
                        if (!answered) {
                          checkAnswer(correctAnswer === answer);
                        }
                      }}
                    >
                      {answer}
                    </button>
                  );
                })}
            </div>
            <div className="d-flex">
              <button
                className="btn btn-danger exit-btn"
                type="submit"
                onClick={handleExit}
              >
                Exit
              </button>
              <button
                className="btn btn-warning next-question-btn"
                onClick={nextQuestion}
                disabled={!answered}
              >
                Next Question
              </button>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default App;
