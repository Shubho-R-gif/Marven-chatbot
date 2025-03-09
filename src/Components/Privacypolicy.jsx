import "./Privacypolicy.css"; // Import the CSS file

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-container">
        <div className="privacy-content">
          <h1>Privacy Policy</h1>
          <p>
            <strong>Effective Date:</strong> February 26, 2025
          </p>
          <p>
            Welcome to <strong>Marven Chatbot</strong>. Your privacy is
            important to us. This policy explains how we collect, use, and protect
            your data when interacting with our chatbot.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>User Inputs:</strong> Text, voice commands, or other
              interactions with the chatbot.
            </li>
            <li>
              <strong>Usage Data:</strong> Timestamps, chatbot interactions, and
              response logs.
            </li>
            <li>
              <strong>Device Data:</strong> IP address, browser type, and device
              details.
            </li>
            <li>
              <strong>Google Gemini API:</strong> Your queries may be processed
              via Google Gemini.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide chatbot responses and enhance user experience.</li>
            <li>To analyze usage data and improve our services.</li>
            <li>To maintain security and troubleshoot issues.</li>
          </ul>

          <h2>3. Data Sharing & Security</h2>
          <ul>
            <li>
              Your queries may be processed via <strong>Google Gemini API</strong>,
              subject to Googles privacy policy.
            </li>
            <li>
              We do <strong>not</strong> sell or share your data for advertising.
            </li>
            <li>Data may be disclosed if required by law.</li>
          </ul>

          <h2>4. Your Rights</h2>
          <ul>
            <li>You can request access, correction, or deletion of your data.</li>
            <li>Opt-out by discontinuing chatbot use.</li>
          </ul>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions, reach out at{" "}
            <strong>subhor.workwith@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
