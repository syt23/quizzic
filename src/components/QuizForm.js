import React from "react";
import { useGlobalContext } from "../context";

const QuizForm = () => {
  const { quiz, handleChange, handleSubmit, error, NUM_SUBLEVELS } =
    useGlobalContext();

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
            value={quiz.numQuestions}
            onChange={handleChange}
            min={1}
            max={50}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="level">Level</label>
          <select
            className="form-select"
            name="level"
            id="level"
            value={quiz.level}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="subLevel">Sub Level</label>
          <select
            className="form-select"
            name="subLevel"
            id="subLevel"
            value={quiz.subLevel}
            onChange={handleChange}
          >
            {new Array(NUM_SUBLEVELS[quiz.level]).fill().map((d, i) => (
              <option value={i + 1} key={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="direction">Direction</label>
          <select
            className="form-select"
            name="direction"
            id="direction"
            value={quiz.direction}
            onChange={handleChange}
          >
            <option value="e2k">English to Korean</option>
            <option value="k2e">Korean to English</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            disabled
            name="description"
            className="form-control"
            id="description"
            value={quiz.description}
          />
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
