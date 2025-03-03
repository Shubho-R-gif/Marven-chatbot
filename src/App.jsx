import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import Loginpage from "./Authentication/Loginpage";
import Signupage from "./Authentication/Signupage";
import Profilepage from "./Authentication/Profilepage";
import UserProvider from "./context/UserContext";
import ChatopeningUI from "./ChatopeningUI";
import Chatbot from "./Chatbot";
import Footer from "./Components/Footer";
import Privacypolicy from "./Components/Privacypolicy";
import "./App.css";

const App = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signedUp, setSignedUp] = useState(false); // state to track successful signup
  const [logIn, setLogIn] = useState(false);

  const [showChatbot, setShowChatbot] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hideChatUI, setHideChatUI] = useState(false); // Track when to hide ChatopeningUI

  const handleClick = () => {
    setZoomOut(true);
    setLoading(true);

    setTimeout(() => {
      setShowChatbot(true);
      setHideChatUI(true); // Hide ChatopeningUI after transition
    }, 1500);
  };

  return (
    <>
      <UserProvider>
        <Router>
          <Navbar
            setDropdownOpen={setDropdownOpen}
            dropdownOpen={dropdownOpen}
            signedUp={signedUp}
            setSignedUp={setSignedUp}
            logIn={logIn}
            setLogIn={setLogIn}
          />
          <Routes>
            {/* Authentication Routes */}
            <Route
              path="/"
              element={
                <Loginpage
                  setDropdownOpen={setDropdownOpen}
                  logIn={logIn}
                  setLogIn={setLogIn}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <Signupage
                  signedUp={signedUp}
                  setDropdownOpen={setDropdownOpen}
                  setSignedUp={setSignedUp}
                />
              }
            />
            {/* Home Route */}
            <Route
              path="/Chatopening"
              element={
                !hideChatUI ? (
                  <ChatopeningUI
                    handleClick={handleClick}
                    zoomOut={zoomOut}
                    loading={loading}
                    setDropdownOpen={setDropdownOpen} //  Pass setDropdownOpen here
                  />
                ) : null
              }
            />
            <Route path="/profile" element={<Profilepage  />} />
            <Route
              path="/privacypolicy"
              element={!showChatbot && <Privacypolicy />}
            />
          </Routes>
          {showChatbot && <Chatbot />}
            <Footer />
        </Router>
      </UserProvider>
    </>
  );
};

export default App;
