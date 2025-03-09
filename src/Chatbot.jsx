import "regenerator-runtime/runtime"; // Important: Ensure this is the first import
import { useState, useRef, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCopy,
  faCheck,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import music from "./assets/music1.wav";
import "./Chatbot.css";

const Chatbot = () => {
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [userInputText, setUserInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(false);
  const [opacity, setOpacity] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const autoScroll = useRef(null);
  const autoFocus = useRef(null);
  const playMusic = useRef(null);
  useEffect(() => {
    if (autoScroll.current) {
      autoScroll.current.scrollTop = autoScroll.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    setUserInputText(transcript);
  }, [transcript]);

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const handleSendBtn = async () => {
    if (userInputText.trim() === "") return;
    // Only keep the latest user message
    const newMessages = { text: userInputText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessages]);
    setUserInputText(""); // Clear input field immediately

    SpeechRecognition.stopListening(); // Stop listening to reset transcript
    SpeechRecognition.startListening({ continuous: false, lang: "en-IN" });

    autoFocus.current?.focus(); // Keep input focused

    // Show typing indicator
    const typingMessage = { text: "Typing...", sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);
    setOpacity(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userInputText }] }],
        }),
      });

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      const botReply =
        rawText
          .replace(/\*\*/g, "") // Remove bold (**)
          .replace(/\*/g, "") // Remove italics (*)
          .replace(/\n{2,}/g, "\n\n") // Ensure double line breaks for paragraphs
          .replace(/(?<!\d):\s*\n/g, ":\n• ") // Add bullets after colons NOT following a number
          .replace(/'''/g, "") // Remove triple single quotes
          .replace(/(?<!\b(?:Dr|Mr|Ms|Mrs|St|vs))\. (?=[A-Z])/g, ".\n") // Prevent breaking common abbreviations
          .replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
          ) // Convert Markdown links
          .replace(
            /(?<!href="|>\s*)(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
          ) // Convert plain URLs, ignoring already converted ones
          .trim() || "Sorry, I couldn't understand that.";

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove typing indicator
        { text: botReply, sender: "bot" },
      ]);

      setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true, lang: "en-IN" });
      }, 10);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove typing indicator
        { text: "Error getting response!", sender: "bot" },
      ]);
    }
  };
  const handleInputClick = (e) => {
    setUserInputText(e.target.value);
  };
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index); // Set the copied message index
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1000);
  };

  const handleMicBtn = async () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (!isActive) {
      try {
        await playMusic.current.play(); // Ensure immediate playback
        SpeechRecognition.startListening({ continuous: true, lang: "en-IN" });
        autoFocus.current?.focus();
        setIsActive(true);
      } catch (error) {
        console.error("Audio playback error:", error);
      }
    } else {
      SpeechRecognition.stopListening();
      setIsActive(false);
    }
  };

  return (
    <>
      <h1
        className="chatbot-heading"
        style={{
          opacity: opacity ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
      >
        Let the conversation begin!
      </h1>
      <div className="chat-container">
        <div className="chatBox" ref={autoScroll}>
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <span
                className={msg.sender === "user" ? "userText" : "botText"}
                dangerouslySetInnerHTML={{ __html: msg.text }} //  Renders HTML safely
              />
              {msg.sender === "bot" && (
                <FontAwesomeIcon
                  icon={copiedIndex === index ? faCheck : faCopy}
                  className="copy"
                  onClick={() => handleCopy(msg.text, index)}
                  onTouchStart={() => handleCopy(msg.text, index)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-container">
          <input
            type="text"
            placeholder="Type here to explore..."
            value={userInputText}
            onChange={handleInputClick}
            ref={autoFocus}
            className="inputfield-chatbot"
          />
          <FontAwesomeIcon
            icon={faMicrophone}
            className="mic-btn"
            style={{ color: isActive ? "cyan" : "white" }}
            onClick={handleMicBtn}
          />
          <audio src={music} ref={playMusic} preload="auto"></audio>
          <button type="button" id="send" onClick={handleSendBtn}>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
