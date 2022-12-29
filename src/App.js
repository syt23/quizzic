import "./App.css";
import { AppContext, useGlobalContext } from "./context";
import QuizForm from "./components/QuizForm";
import { useEffect } from "react";
import Loading from "./components/Loading";

function App() {
  const {
    status,
    isLoading,
    questions,
    index,
    numCorrectAnswers,
    nextQuestion,
    checkAnswer,
  } = useGlobalContext();

  useEffect(() => {
    console.log("numCorrectAnswers", numCorrectAnswers);
  }, []);

  if (status === "start") {
    return <QuizForm />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const { question, incorrect_answers, correct_answer } = questions[index];
  let answers = [...incorrect_answers];
  const tempIndex = Math.floor(Math.random() * 4);
  if (tempIndex === 3) {
    answers.push(correct_answer);
  } else {
    answers.push(answers[tempIndex]);
    answers[tempIndex] = correct_answer;
  }

  return (
    <main className="quiz-container">
      <h2 className="app-title">Quizzic</h2>
      <section className="quiz">
        <p>
          Correct Answer: {numCorrectAnswers}/{index}
        </p>
        <article className="container">
          <h2>{question}</h2>
          <div>
            {answers &&
              answers.map((answer, index) => {
                return (
                  <button
                    key={index}
                    className="btn btn-info answer-btn"
                    onClick={() => checkAnswer(correct_answer === answer)}
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
        >
          Next Question
        </button>
      </section>
    </main>
  );
}

export default App;
