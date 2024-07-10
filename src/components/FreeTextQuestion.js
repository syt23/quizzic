import React, { useEffect, useState } from "react";

const FreeTextQuestion = ({ answered, correctAnswer, checkAnswer }) => {
  const [answer, setAnswer] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("answered", answered);
    checkAnswer(correctAnswer == answer);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setAnswer(value);
  };

  useEffect(() => {
    setAnswer("");
  }, [correctAnswer]);

  return (
    <div className="">
      <form className="d-flex align-items-center" onSubmit={handleSubmit}>
        <div className="w-100 mr-2">
          <input
            value={answer}
            className={`form-control ${
              answered
                ? correctAnswer === answer
                  ? "text-success"
                  : "text-danger"
                : "text-info"
            }`}
            type="text"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <p>{answered && <div>{correctAnswer}</div>}</p>
    </div>
  );
};

export default FreeTextQuestion;
