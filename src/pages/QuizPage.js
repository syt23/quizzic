import FreeTextQuestion from "../components/FreeTextQuestion";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import QuizForm from "../components/QuizForm";
import { useGlobalContext } from "../context";
import styles from "./QuizPage.module.css";

const capitalise = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function QuizPage() {
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

  if (isLoading) {
    return <Loading />;
  }

  if (status === "start") {
    return <QuizForm />;
  }

  const { question, answerOptions, correctAnswer } = questions[index];

  const renderQuestionBlock = () => {
    switch (quiz.format) {
      case "mcq":
        return (
          <MultipleChoiceQuestion
            answered={answered}
            correctAnswer={correctAnswer}
            answerOptions={answerOptions}
            checkAnswer={checkAnswer}
          />
        );
      case "tx":
        return (
          <FreeTextQuestion
            answered={answered}
            correctAnswer={correctAnswer}
            checkAnswer={checkAnswer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal />
      <main className={styles["quiz-page-container"]}>
        <h2 className={styles["app-title"]}>Quizzic</h2>
        <p className={styles["app-subtitle"]}>Quiz {quiz.description}</p>
        <section className="g-card">
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
            {/* Call the helper function directly */}
            <div>{renderQuestionBlock()}</div>
            <div className="d-flex">
              <button
                className="btn btn-danger w-100 exit-btn"
                type="submit"
                onClick={handleExit}
              >
                Exit
              </button>
              <button
                className="btn btn-warning w-100 next-question-btn"
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

export default QuizPage;
