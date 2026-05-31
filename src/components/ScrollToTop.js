import React, { useState, useEffect } from "react";

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down past 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top execution
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          type="button"
          className="btn btn-primary position-fixed rounded-circle d-flex align-items-center justify-content-center shadow"
          onClick={scrollToTop}
          style={{
            bottom: "40px",
            right: "40px",
            width: "45px",
            height: "45px",
            zIndex: 1050,
            transition: "all 0.3s ease",
          }}
          aria-label="Scroll to top"
        >
          {/* Bootstrap Icon 1.5.0 arrow-up */}
          <i
            className="bi bi-arrow-up"
            style={{ fontSize: "1.25rem", strokeWidth: "2px" }}
          ></i>
        </button>
      )}
    </>
  );
}

export default ScrollToTop;
