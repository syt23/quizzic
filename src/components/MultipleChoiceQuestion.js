import React from "react";

const MultipleChoiceQuestion = ({
  answerOptions,
  answered,
  correctAnswer,
  checkAnswer,
}) => {
  return (
    <div>
      {answerOptions &&
        answerOptions.map((answer, index) => {
          return (
            <button
              key={index}
              className={`btn w-100 answer-btn ${
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
  );
};

export default MultipleChoiceQuestion;
