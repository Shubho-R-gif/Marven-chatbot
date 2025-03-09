import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Import Firebase
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth"; // Firebase Auth
import useUser from "../Context/useUser"; //  Import useUser hook
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import PropTypes from "prop-types";
import "./Signuppage.css";
const SignUpPage = ({ setDropdownOpen, signedUp, setSignedUp }) => {
  const { setUserData } = useUser(); //  Access user context

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const circles = Array.from({ length: 8 });
  const colors = "#00a98f";
  const duration = 1;
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedUp(true);
        navigate("/profilepage"); // Ensure this matches a valid route
      }
    });

    return () => unsubscribe();
  }, [setSignedUp, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError(""); // Clear any previous error

    setSignedUp(true); // Permanently hide form after successful signup
    setShowSpinner(true);

    try {
      // 1 Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2 Store user data in Firestore (WITHOUT password)
      const userData = {
        uid: user.uid,
        username,
        name,
        email,
        location,
        date,
        bio,
      };

      await setDoc(doc(db, "users", user.uid), userData, { merge: true });

      //3  Update user context
      setUserData(userData);
      setSignedUp(true);

      setTimeout(() => {
        setShowSuccessMessage(true);
      }, 2000);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setTimeout(() => setShowSpinner(false), 1500);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          username: user.displayName || "", // Use Google display name
          name: user.displayName || "",
          email: user.email,
          location: location || "",
          date:
            date ||
            new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          bio: bio || "",
          profilePic: user.photoURL || "",
        },
        { merge: true }
      );

      setUserData({
        uid: user.uid,
        username: user.displayName || "",
        name: user.displayName || "",
        email: user.email,
        location: location || "",
        date:
          date ||
          new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        bio: bio || "",
        profilePic: user.photoURL || "",
      });

      setSignedUp(true);

    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="signup-form-conatiner">
      {!signedUp && (
        <motion.form
          className="signup-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="signup-heading">Marven</h1>
          <h2 className="signup-sub-heading">
            Join us, <span>create your account</span>
          </h2>

          <div className="signup-container">
            <label htmlFor="signup-username">Username</label>
            <input
              type="text"
              id="signup-username"
              name="signup-username"
              placeholder="Enter Username"
              className="signup-input-field"
              required
              maxLength={10}
              value={username}
              pattern="^[a-zA-Z0-9_]{3,10}$"
              title="Username must be 3-10 characters long and can contain letters, numbers, and underscores."
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="signup-name">Name</label>
            <input
              type="text"
              id="signup-name"
              name="signup-name"
              placeholder="Enter Name"
              className="signup-input-field"
              required
              maxLength={20}
              value={name}
              pattern="^[A-Za-z ]*$"
              title="Only letters and spaces are allowed."
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="signup-bio">Bio</label>
            <input
              type="text"
              id="signup-bio"
              name="signup-bio"
              placeholder="Enter bio"
              className="signup-input-field"
              required
              value={bio}
              maxLength={20}
              pattern="^[A-Za-z ]*$"
              title="Enter a Bio (e.g., AI enthusiast exploring the universe of technology.."
              onChange={(e) => setBio(e.target.value)}
            />
            <label htmlFor="signup-location">Location</label>
            <input
              type="text"
              id="signup-location"
              name="signup-location"
              placeholder="City, Country"
              className="signup-input-field"
              required
              maxLength={25}
              value={location}
              pattern="^[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*,\s?[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*$"
              title="Enter a location in 'City, Country' format. Both must start with an uppercase letter (e.g., 'New York, USA' or 'San Francisco, United Kingdom')."
              onChange={(e) => setLocation(e.target.value)}
            />
            <label htmlFor="signup-date">Date</label>
            <input
              type="text"
              id="signup-date"
              name="signup-date"
              placeholder="March 2022"
              className="signup-input-field"
              required
              pattern="^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$"
              title="Enter a date in 'Month Year' format (e.g., March 2022)."
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              name="signup-email"
              placeholder="Enter Email"
              className="signup-input-field"
              required
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              value={email}
              title="Enter a valid email address (e.g., example@domain.com)."
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              name="signup-password"
              placeholder="Enter Password"
              className="signup-input-field"
              required
              maxLength={20}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
            />
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="signup-confirm-password"
              name="signup-confirm-password"
              placeholder="Confirm Password"
              className="signup-input-field"
              required
              maxLength={20}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
            />
            <div className="backg-container"></div>
          </div>
          {error && <p className="signup-error">{error}</p>}
          <button type="submit" className="signup-submit-btn">
            Sign Up
          </button>
          {/* Social Login */}
          <div className="signup-social-container">
            <button
              type="button"
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
            >
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

            <span className="signup-or-text">or</span>

            <button type="button" className="facebook-signin-btn">
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
          {/* Already have an account? */}
          <div className="signin-login-link">
            <p className="signin-login-text">
              Already have an account?{" "}
              <Link to="/" className="signin-login-link">
                Sign In
              </Link>
            </p>
          </div>
        </motion.form>
      )}
      {showSpinner && (
        <motion.div
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="spinner-border" role="status">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              width="60"
              height="60"
              style={{ shapeRendering: "auto", display: "block" }}
            >
              <g>
                {circles.map((_, index) => {
                  const angle = (index * 45 * Math.PI) / 180;
                  const x = 50 + 30 * Math.cos(angle);
                  const y = 50 + 30 * Math.sin(angle);
                  const opacity = 1 - index * 0.125;
                  return (
                    <g key={index} transform={`translate(${x},${y})`}>
                      <circle
                        fillOpacity={opacity}
                        fill={colors}
                        r="6"
                        cx="0"
                        cy="0"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="scale"
                          values="1.5 1.5;1 1"
                          keyTimes="0;1"
                          dur={`${duration}s`}
                          repeatCount="indefinite"
                          begin={`-${(7 - index) * (duration / 8)}s`}
                          calcMode="ease-in-out"
                        />
                        <animate
                          attributeName="fill-opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur={`${duration}s`}
                          repeatCount="indefinite"
                          begin={`-${(7 - index) * (duration / 8)}s`}
                          calcMode="ease-in-out"
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </motion.div>
      )}
      {showSuccessMessage && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="signup-popup-successful">
            <p> Signup Successful! ✅ </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

SignUpPage.propTypes = {
  signedUp: PropTypes.bool.isRequired,
  setSignedUp: PropTypes.func.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
};

export default SignUpPage;
