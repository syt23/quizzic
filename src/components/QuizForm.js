import {
  DIRECTION_OPTIONS,
  FORMAT_OPTIONS,
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
} from "../constants";
import { useGlobalContext } from "../context";
import styles from "./QuizForm.module.css";

const QuizForm = () => {
  const {
    quiz,
    handleChange,
    handleMultiSelectChange,
    handleSubmit,
    subLevelOptions,
    error,
  } = useGlobalContext();

  return (
    <section className={styles["quiz-container"]}>
      <form className={styles["g-card"]}>
        <h2 className="mb-3 text-center">Let's Start Quiz</h2>
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="numQuestions">
            Number of Questions
          </label>
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
          <label className="form-label fw-bold" htmlFor="language">
            Language
          </label>
          <select
            // defaultValue="default"
            className="form-select"
            name="language"
            id="language"
            value={quiz.language}
            onChange={handleChange}
          >
            <option value="default">Select a language</option>
            {LANGUAGE_OPTIONS &&
              LANGUAGE_OPTIONS.map((i) => (
                <option value={i.value} key={i.value}>
                  {i.label}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="level">
            Level
          </label>
          <select
            className="form-select"
            name="level"
            id="level"
            value={quiz.level}
            onChange={handleChange}
          >
            {LEVEL_OPTIONS[quiz.language] &&
              LEVEL_OPTIONS[quiz.language].map((i) => (
                <option value={i.value} key={i.value}>
                  {i.label}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="subLevel">
            Sub Level
          </label>
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
                <option value={x.value} key={x.value}>
                  {x.label}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="direction">
            Direction
          </label>
          <select
            className="form-select"
            name="direction"
            id="direction"
            value={quiz.direction}
            onChange={handleChange}
          >
            {DIRECTION_OPTIONS[quiz.language] &&
              DIRECTION_OPTIONS[quiz.language].map((x) => (
                <option value={x.value} key={x.value}>
                  {x.label}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="format">
            Format
          </label>
          <select
            // defaultValue="default"
            className="form-select"
            name="format"
            id="format"
            value={quiz.format}
            onChange={handleChange}
          >
            <option value="default">Select a format</option>
            {FORMAT_OPTIONS &&
              FORMAT_OPTIONS.map((i) => (
                <option value={i.value} key={i.value}>
                  {i.label}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            disabled
            name="description"
            className="form-control"
            id="description"
            value={quiz.description}
          />
        </div>
        {error && <p className="error">Error: {error}</p>}
        <button
          className="btn btn-primary start-btn w-100"
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
