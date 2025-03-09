import { useState, useEffect } from "react";
import { Camera, Pencil } from "lucide-react";
import useUser from "../Context/useUser";
import defaultImg from "../assets/img3.jpg";
import "./Profilepage.css";
const Profilepage = () => {
  const { userData, profilePic, handleImgchange, updateUserInfo } = useUser(); // Get user data from context
  const [darkMode, setDarkMode] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [bio, setBio] = useState(userData?.bio || "");
  const [location, setLocation] = useState(userData?.location || "");

  useEffect(() => {
    document.title = `Marven|${userData?.name}`;
  }, [userData]);

  useEffect(() => {
    localStorage.getItem("profilePic") || null;
  }, [profilePic]);

  const handleSave = () => {
    updateUserInfo({ bio, location });
    setEditingBio(false);
    setEditingLocation(false);
  };

  return (
    <div
      className="profile-container"
      style={{
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <div className="profile-card">
        <label htmlFor="imageUpload" className="profile-picture-label">
          <Camera size={16} style={{ color: darkMode ? "white" : "" }} />
          <img
            src={profilePic || defaultImg}
            alt="Profile"
            className="profile-picture"
          />
        </label>
        <h1 className="profile-title">Welcome, {userData?.name}</h1>
        <h2 className="profile-sub-heading">
          Every great chat starts with a great profile.
        </h2>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImgchange}
          style={{ display: "none" }}
        />
        <div
          className="profile-details"
          style={{
            backgroundColor: darkMode ? "rgba(146, 146, 146, 0.162)" : "",
          }}
        >
          <h2
            className="profile details-heading"
            style={{ color: darkMode ? "white" : "" }}
          >
            Profile
          </h2>
          <div className="profile field">
            <strong style={{ color: darkMode ? "grey" : "" }}>Username:</strong>{" "}
            <span className="higlight-username">{userData?.username}</span>
          </div>
          <div className="profile field">
            <strong style={{ color: darkMode ? "grey" : "" }}>Name:</strong>{" "}
            <span>{userData?.name}</span>
          </div>
          <div className="profile field">
            <strong style={{ color: darkMode ? "grey" : "" }}>Email:</strong>{" "}
            <span>{userData?.email}</span>
          </div>
          <div className="profile field">
            <strong style={{ color: darkMode ? "grey" : "" }}>Location:</strong>
            {!editingLocation && (
              <Pencil
                size={16}
                className="edit-icon"
                onClick={() => setEditingLocation(true)}
              />
            )}

            {editingLocation ? (
              <input
                type="text"
                id="profile-location"
                name="profile-location"
                placeholder="City, Country"
                className="userprofile-input-field"
                required
                maxLength={25}
                value={location}
                pattern="^[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*,\s?[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*$"
                title="Enter a location in 'City, Country' format. Both must start with an uppercase letter (e.g., 'New York, USA')."
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              <span>{userData?.location || "Not set"}</span>
            )}
          </div>
          <div className="profile field">
            <strong style={{ color: darkMode ? "grey" : "" }}> Joined:</strong>{" "}
            <span>{userData?.date}</span>
          </div>
          <div className="profile field">
            <strong style={{ color: darkMode ? "grey" : "" }}>Bio:</strong>
            {!editingBio && (
              <Pencil
                size={16}
                className="edit-icon"
                onClick={() => setEditingBio(true)}
              />
            )}

            {editingBio ? (
              <input
                type="text"
                id="profile-bio"
                name="profile-bio"
                placeholder="Enter bio"
                className="userprofile-input-field"
                required
                maxLength={20}
                value={bio}
                pattern="^[A-Za-z ]*$"
                title="Enter a Bio (e.g., 'AI enthusiast exploring technology')."
                onChange={(e) => setBio(e.target.value)}
              />
            ) : (
              <span>{userData?.bio || "Not set"}</span>
            )}
          </div>
          {(editingBio || editingLocation) && (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
      {/* Preferences */}
      <section
        className="settings"
        style={{
          backgroundColor: darkMode ? "rgba(146, 146, 146, 0.162)" : "",
        }}
      >
        <h3 style={{ color: darkMode ? "teal" : "" }}>Preferences</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider round"></span>
        </label>
        <p>Enable Dark Mode</p>
      </section>
    </div>
  );
};

export default Profilepage;
