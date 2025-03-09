import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import { Link } from "react-router-dom"; // Import Link
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Side - Brand Info */}
        <div className="footer-brand">
          <h2 className="logo">
            <span className="logo-name">Marven</span>
          </h2>
          <p className="tagline">Intelligent. Powerful. Limitless.</p>
        </div>

        {/* Center - Navigation */}
        <div className="social-icons">
          <h3>Social</h3>
          <a
            href="https://github.com/Shubho-R-gif"
            className="social-link"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            href="https://www.linkedin.com/in/subho-halder-5b9aa127b/"
            className="social-link"
            target="_blank"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>

        {/* Right Side - Contact & Socials */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>
            <a href="mailto:subhor.workwith@gmail.com">
              subhor.workwith@gmail.com
            </a>
          </p>
          <p>
            <a
              href="https://shubhorwebdev.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              shubhorwebdev.com
            </a>
          </p>
        </div>
      </div>

      <hr />

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()}Marven. All Rights Reserved.</p>
        <p>
          Designed by <span className="highlight">Shubho R</span>
        </p>
        <Link to="/privacypolicy" className="privacy-policy">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
