import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import PropTypes from "prop-types";
import useUser from "../context/useUser";
import "./Navbar.css";

const Navbar = ({
  dropdownOpen,
  setDropdownOpen,
  signedUp,
  setSignedUp,
  logIn,
  setLogIn,
}) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    if (signedUp || logIn) {
      setDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("Profile");
    navigate("/");
    setDropdownOpen(false);
    setSignedUp(false);
    setLogIn(false);
  };

  return (
    <nav className="navbar">
      <h1 className="nav-heading">
        <Link to="/Chatopening">Marven</Link>
      </h1>
      <div className="profile-icon-container">
        <div className="profile-icon" onClick={toggleDropdown}>
          <FaUserCircle size={30} />
        </div>
        {/* AnimatePresence ensures smooth entry/exit animations */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              className="dropdown-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dropdown-item">
                <Link to="/profile" className="profile-link">
                  Profile
                </Link>
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logIn: PropTypes.bool.isRequired,
  signedUp: PropTypes.bool.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
  setSignedUp: PropTypes.func.isRequired,
  setLogIn: PropTypes.func.isRequired,
};

export default Navbar;
