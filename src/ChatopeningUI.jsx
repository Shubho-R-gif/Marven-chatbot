import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; //  Ensure Firebase auth is imported
import { useEffect } from "react";
import PropTypes from "prop-types";
import "./ChatopeningUI.css";

const ChatopeningUI = ({ handleClick, zoomOut, loading, setDropdownOpen }) => {
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDropdownOpen(true); // Automatically open dropdown on authentication
      }
    });

    return () => unsubscribe();
  }, [setDropdownOpen]);

  return (
    <>
      <div
        className="chatOpeningContainer"
        style={{
          transition: "transform 1.5s ease, opacity 1.5s ease-in-out",
          transform: zoomOut ? "scale(1.5)" : "scale(1)",
          opacity: zoomOut ? 0 : 1,
        }}
        aria-live="polite"
      >
        <h1 className="heading">What can I help you with today?</h1>
        <h3 className="sub-heading">Your AI-Powered Assistant</h3>
        <button
          type="button"
          className="cta"
          onClick={handleClick}
          disabled={loading}
        >
          <span>
            {loading ? "Loading..." : "Chat with "}
            <span className="highlightname">Marven</span>
          </span>
        </button>
      </div>
    </>
  );
};
ChatopeningUI.propTypes = {
  setDropdownOpen: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  zoomOut: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default ChatopeningUI;
