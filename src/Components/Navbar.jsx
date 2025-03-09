import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import PropTypes from "prop-types";
import useUser from "../Context/useUser";
import "./Navbar.css";

const Navbar = ({ dropdownOpen, setDropdownOpen, setLogIn }) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("Profile");
    setDropdownOpen(false);
    navigate("/");
    setLogIn(false);
  };
  return (
    <nav className="navbar">
      <h1 className="nav-heading">
        <Link to="/">Marven</Link>
      </h1>
      <div className="profile-icon-container">
        <div className="profile-icon" onClick={handleDropdown}>
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
              <Link to="/profilepage" className="dropdown-item">
                Profile
              </Link>

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
  dropdownOpen: PropTypes.bool.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
  setLogIn: PropTypes.func.isRequired,
  login: PropTypes.bool.isRequired,
};

export default Navbar;
