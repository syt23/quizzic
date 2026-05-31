import { useGlobalContext } from "../context";
import styles from "./Modal.module.css";

const Modal = () => {
  const { isModalOpen, closeModal, numCorrectAnswers, questions } =
    useGlobalContext();

  return (
    <div
      className={`${
        isModalOpen
          ? styles["modal-container"] + " " + styles["isOpen"]
          : styles["modal-container"]
      }`}
    >
      <div className={styles["modal-content"]}>
        <h2>Congrats!</h2>
        <p>
          You answered{" "}
          {((numCorrectAnswers / questions.length) * 100).toFixed(0)}% (
          {numCorrectAnswers}/{questions.length}) of questions correctly
        </p>
        <button className="btn btn-success close-btn" onClick={closeModal}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Modal;
