import React from "react";
import { useGlobalContext } from "../context";

const QuizForm = () => {
  const { quiz, handleChange, handleSubmit, error } = useGlobalContext();
  return (
    <section className="quiz-container">
      <form className="quiz">
        <h2 className="mb-3 text-center">Let's Start Quiz</h2>
        <div className="mb-3">
          <label htmlFor="numQuestions">Number of Questions</label>
          <input
            type="number"
            name="numQuestions"
            className="form-control"
            id="numQuestions"
            value={quiz.amount}
            onChange={handleChange}
            min={1}
            max={50}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category">Category</label>
          <select
            className="form-select"
            name="category"
            id="category"
            value={quiz.category}
            onChange={handleChange}
          >
            <option value="sports">sports</option>
            <option value="history">history</option>
            <option value="politics">politics</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            className="form-select"
            name="difficulty"
            id="difficulty"
            value={quiz.difficulty}
            onChange={handleChange}
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
        {error && <p className="error">Can't generate questions</p>}
        <button
          className="btn btn-primary start-btn"
          type="submit"
          onClick={handleSubmit}
        >
          Start
        </button>
      </form>
    </section>
  );
};

export default QuizForm;
