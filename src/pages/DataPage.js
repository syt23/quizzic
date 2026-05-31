import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { COLUMN_OPTIONS, LANGUAGE_OPTIONS, LEVEL_OPTIONS } from "../constants";
import { useGlobalContext } from "../context";
import styles from "./DataPage.module.css";

function DataPage() {
  const { fetchSubLevelOptions, getQuestionsFromCsv } = useGlobalContext();

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSubLevels, setSelectedSubLevels] = useState([]);
  const [subLevelOptions, setSubLevelOptions] = useState([]);

  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const columns = COLUMN_OPTIONS[selectedLanguage] || [];

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setSelectedLevel(1);
    setSelectedSubLevels([]);
    setSubLevelOptions([]);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setSelectedSubLevels([]);
    setSubLevelOptions([]);
  };

  const handleSubLevelChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedSubLevels(selected);
  };

  useEffect(() => {
    if (!selectedLanguage || !selectedLevel) return;

    const loadSubLevelOptions = async () => {
      const options = await fetchSubLevelOptions(
        selectedLanguage,
        selectedLevel,
      );
      setSubLevelOptions(options || []);
    };

    loadSubLevelOptions();
  }, [selectedLanguage, selectedLevel, fetchSubLevelOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || selectedSubLevels.length === 0) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsLoading(true);
    setError(null);
    setTableData([]);

    try {
      const csvArray = await getQuestionsFromCsv(
        selectedLanguage,
        selectedLevel,
        selectedSubLevels,
      );
      console.debug("csvArray", csvArray);

      setTableData(csvArray);
      setIsSubmitted(true);
    } catch (err) {
      setError(
        "Failed to fetch one or more CSV data files. Please verify data paths.",
      );
      console.error("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
    setValidated(false);
  };

  return (
    <main className={styles["data-page-container"]}>
      <h2 className="mb-4 text-center">Data Configuration Dashboard</h2>

      {!isSubmitted && (
        <div className={styles["form-card"] + " g-card p-3"}>
          <form
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="languageSelect" className="form-label fw-bold">
                Language
              </label>
              <select
                id="languageSelect"
                className="form-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                required
              >
                <option value="">Select a Language</option>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">Please select a language.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="levelSelect" className="form-label fw-bold">
                Level
              </label>
              <select
                id="levelSelect"
                className="form-select"
                value={selectedLevel}
                onChange={handleLevelChange}
                disabled={!selectedLanguage}
                required
              >
                <option value=""></option>
                {selectedLanguage &&
                  LEVEL_OPTIONS[selectedLanguage]?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
              <div className="invalid-feedback">
                Please select a difficulty level.
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subLevelSelect" className="form-label fw-bold">
                Sub-Levels{" "}
                <small className="text-muted">
                  (Hold Ctrl/Cmd to select multiple)
                </small>
              </label>
              <select
                id="subLevelSelect"
                multiple
                className={`form-select ${validated && selectedSubLevels.length === 0 ? "is-invalid" : ""}`}
                value={selectedSubLevels}
                onChange={handleSubLevelChange}
                disabled={subLevelOptions.length === 0}
                required
              >
                {subLevelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                Please select at least one sub-level segment.
              </div>
            </div>

            <div className="d-grid">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing CSV Data...
                  </>
                ) : (
                  "Fetch & Render Data"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="alert alert-danger my-3" role="alert">
          {error}
        </div>
      )}

      {/* Data Visualization Table */}
      {isSubmitted && tableData.length > 0 && (
        <div className={styles["result-container"]}>
          <div className="g-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
              <div className="d-flex gap-2 align-items-center">
                <h4 className="card-title mb-0">Level {selectedLevel}</h4>
                <br />
                <span className="fs-6 text-muted">Sub-Levels</span>
                <div className="d-flex gap-2 align-items-center">
                  {selectedSubLevels.length > 0 &&
                    selectedSubLevels.map((subLevel) => (
                      <span className="badge bg-info text-dark">
                        {subLevel}
                      </span>
                    ))}
                </div>
              </div>
              {/* Back Button to restore configuration view */}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleBackToForm}
              >
                &larr; Back to Configuration
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle border">
                <thead className="table-dark">
                  {columns.length > 0 && (
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key} scope="col">
                          {col.title}
                        </th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {tableData.map((row, rowIdx) => (
                    <tr key={`row-${rowIdx}`}>
                      {columns.length > 0 &&
                        columns.map((col, colIdx) => (
                          <td key={`cell-${rowIdx}-${colIdx}`}>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="border px-2 py-1 rounded bg-light text-dark text-break">
                                {row[col.key] || "N/A"}
                              </span>
                            </div>
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <ScrollToTop />
    </main>
  );
}

export default DataPage;
