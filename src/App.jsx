import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import Profilepage from "./Components/Profilepage";
import ChatopeningUI from "./ChatopeningUI";
import Chatbot from "./Chatbot";
import Footer from "./Components/Footer";
import Loginpage from "./Authentication/Loginpage";
import SignUpPage from "./Authentication/Signuppage";
import Privacypolicy from "./Components/Privacypolicy";
import UserProvider from "./Context/UserContext";
import "./App.css";

const App = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signedUp, setSignedUp] = useState(false); // state to track successful signup
  const [logIn, setLogIn] = useState(false);

  return (
    <UserProvider>
      <Router>
        <Navbar
          setDropdownOpen={setDropdownOpen}
          dropdownOpen={dropdownOpen}
          setLogIn={setLogIn}
        />
        <Routes>
          <Route path="/ChatWrapper" element={<ChatWrapper />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profilepage" element={<Profilepage />} />
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
              <SignUpPage
                signedUp={signedUp}
                setSignedUp={setSignedUp}
              />
            }
          />
          <Route path="/privacypolicy" element={<Privacypolicy />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
};

const ChatWrapper = () => {
  const [zoomOut, setZoomOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use the navigate hook

  const handleClick = () => {
    setZoomOut(true);
    setLoading(true);

    setTimeout(() => {
      navigate("/chatbot"); // Navigate after animation
    }, 1500);
  };

  return (
    <ChatopeningUI
      handleClick={handleClick}
      zoomOut={zoomOut}
      loading={loading}
    />
  );
};

export default App;
