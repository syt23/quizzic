import React, { useState } from "react";
import "./App.css";
import QuizPage from "./pages/QuizPage";
import DataPage from "./pages/DataPage";
function App() {
  const [currentPage, setCurrentPage] = useState("quiz");

  // Simple page renderer
  const renderPage = () => {
    switch (currentPage) {
      case "quiz":
        return <QuizPage />;
      case "data":
        return <DataPage />;
      default:
        return <QuizPage />;
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand navbar-dark bg-dark px-4 sticky-top">
        <span className="navbar-brand mb-0 h1">Quizzic Admin</span>
        <div className="navbar-nav ms-auto">
          <button
            className={`nav-link btn btn-link ${currentPage === "quiz" ? "active fw-bold" : ""}`}
            onClick={() => setCurrentPage("quiz")}
          >
            Quiz
          </button>
          <button
            className={`nav-link btn btn-link ${currentPage === "data" ? "active fw-bold" : ""}`}
            onClick={() => setCurrentPage("data")}
          >
            Data
          </button>
        </div>
      </nav>

      {/* Main Content View */}
      {renderPage()}
    </>
  );
}

export default App;
