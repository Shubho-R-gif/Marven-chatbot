import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import "./Loginpage.css";

const Loginpage = ({ logIn, setLogIn, setDropdownOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const provider = new GoogleAuthProvider(); // Google Auth Provider
  const navigate = useNavigate();
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLogIn(true);
        navigate("/ChatWrapper");
      }
    });

    return () => unsubscribe();
  }, [setLogIn, navigate]);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);

      setLogIn(true);
      setTimeout(() => setDropdownOpen(true), 1500);
    } catch (error) {
      setError("Google sign-in failed. Try again.");
      console.error(error);
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => setDropdownOpen(true), 1500);
    } catch (error) {
      setError("Invalid email or password");
      console.error(error);
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password");
      setTimeout(() => setError(null), 2000);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent!");
      setTimeout(() => setError(null), 2000);
    } catch (error) {
      setError("Error sending reset email");
      console.error(error);
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="login-form-container">
      {!logIn && (
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="login-heading">Marven</h1>
          <h2 className="login-sub-heading">
            Welcome back, <span>sign in to continue</span>
          </h2>
          <div className="login-container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              maxLength={25}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label htmlFor="psw">Password</label>
            <input
              type="password"
              name="psw"
              placeholder="Enter password"
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              className="forgot-pass-btn"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="submit-btn">
              Login
            </button>
          </div>
          <div className="login-social_container">
            <button type="button" onClick={handleGoogleSignIn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 961.2 980.79"
              >
                <path
                  d="M979,511c0-40.34-3.25-69.73-10.37-100.27H508.2v182H778.46C773,638,743.6,706.07,678.19,751.8l-.9,6.09L822.87,870.68l10.09,1C925.61,786.17,979,660.3,979,511"
                  transform="translate(-17.8 -9.7)"
                  fill="#4285f4"
                />
                <path
                  d="M508.2,990.5c132.41,0,243.55-43.59,324.76-118.8L678.19,751.84c-41.41,28.9-97,49-170,49-129.7,0-239.77-85.54-279-203.79l-5.76.49L72.05,714.72l-2,5.51C150.75,880.43,316.43,990.5,508.2,990.5"
                  transform="translate(-17.8 -9.7)"
                  fill="#34a853"
                />
                <path
                  d="M229.25,597.12a301.18,301.18,0,0,1-16.35-97c0-33.79,6-66.47,15.81-97l-.29-6.51L75.14,277.58l-5,2.39a489.25,489.25,0,0,0,0,440.26L229.25,597.12"
                  transform="translate(-17.8 -9.7)"
                  fill="#fbbc05"
                />
                <path
                  d="M508.2,199.33c92.07,0,154.19,39.77,189.63,73L836.21,137.22c-85-79-195.6-127.52-328-127.52C316.38,9.7,150.75,119.77,70.12,280L228.67,403.12c39.8-118.25,149.87-203.79,279.53-203.79"
                  transform="translate(-17.8 -9.7)"
                  fill="#eb4335"
                />
              </svg>
            </button>
            <span className="or-text">or</span>
            <button type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 999.64 999.64"
              >
                <circle cx="499.82" cy="499.82" r="499.82" fill="#1977f3" />
                <path
                  d="M694.74,644.67l22.14-144.51H578.27V406.39c0-39.5,19.33-78.09,81.46-78.09h63v-123s-57.21-9.77-111.9-9.77c-114.15,0-188.79,69.16-188.79,194.48V500.16H295.15V644.67H422.09V993.93a501.28,501.28,0,0,0,78.09,6.05,510.07,510.07,0,0,0,78.09-6.05V644.67Z"
                  transform="translate(-0.36 -0.33)"
                  fill="#fff"
                />
              </svg>
            </button>
          </div>
          <div className="signup-link">
            <p className="signup-text">
              Don't have an account?{" "}
              <Link className="signup-link" to="/signup">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.form>
      )}
    </div>
  );
};

Loginpage.propTypes = {
  logIn: PropTypes.bool.isRequired,
  setLogIn: PropTypes.func.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
};

export default Loginpage;
