import React from "react";
import { useGlobalContext } from "../context";

const QuizForm = () => {
  const {
    quiz,
    subLevelOptions,
    handleChange,
    handleMultiSelectChange,
    handleSubmit,
    error,
    levelOptions,
    languagesOptions,
    directionOptions,
    formatOptions,
  } = useGlobalContext();

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
          <label htmlFor="language">Language</label>
          <select
            defaultValue="default"
            className="form-select"
            name="language"
            id="language"
            value={quiz.language}
            onChange={handleChange}
          >
            <option value="default">Select a language</option>
            {languagesOptions &&
              languagesOptions.map((i) => (
                <option value={i.value}>{i.label}</option>
              ))}
          </select>
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
            {levelOptions[quiz.language] &&
              levelOptions[quiz.language].map((i) => (
                <option value={i}>{i}</option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="subLevel">Sub Level</label>
          <select
            className="form-select"
            name="subLevel"
            id="subLevel"
            multiple
            value={quiz.subLevel}
            onChange={handleMultiSelectChange}
          >
            {subLevelOptions &&
              subLevelOptions.map((x, i) => (
                <option value={x} key={i}>
                  {x}
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
            {directionOptions[quiz.language] &&
              directionOptions[quiz.language].map((x) => (
                <option value={x.value}>{x.label}</option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="format">Format</label>
          <select
            defaultValue="default"
            className="form-select"
            name="format"
            id="format"
            value={quiz.format}
            onChange={handleChange}
          >
            <option value="default">Select a format</option>
            {formatOptions &&
              formatOptions.map((i) => (
                <option value={i.value}>{i.label}</option>
              ))}
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
