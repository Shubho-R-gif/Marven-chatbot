import { createContext, useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    const storeImage = localStorage.getItem("profilePic") || null;
    if (storeImage) {
      setProfilePic(storeImage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("profilePic", profilePic || "");
  }, [profilePic]);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userProfile = userDocSnap.data();
            setUserData({ uid: user.uid, email: user.email, ...userProfile });

            // Get profile picture (Firestore > Google Auth > null)
            const profileImage =
              userProfile.profilePic || user.photoURL || null;
            setProfilePic(profileImage);
            localStorage.setItem("profilePic", profileImage || "");
          } else {
            // If no user document exists, create one with default data
            const newUser = {
              email: user.email,
              name: user.displayName,
              username: user.displayName
                ? user.displayName.toLowerCase().replace(/\s+/g, "_")
                : "",
              bio: "",
              location: "",
              date: new Date().toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              }),
              profilePic: user.photoURL || "",
            };
            await setDoc(userDocRef, newUser);
            setUserData({ uid: user.uid, ...newUser });

            // Set profile picture
            setProfilePic(user.photoURL || "");
            localStorage.setItem("profilePic", user.photoURL || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setProfilePic(null);
        localStorage.removeItem("profilePic");
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to update Bio & Location
  const updateUserInfo = async (updates) => {
    if (!userData) return;

    try {
      const userDocRef = doc(db, "users", userData.uid);
      await updateDoc(userDocRef, updates);

      setUserData((prevUser) => ({
        ...prevUser,
        ...updates,
      }));
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  const handleImgchange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const imageBase64String = reader.result;

          // **Update state immediately to reflect UI change**
          setProfilePic(imageBase64String);
          localStorage.setItem("profilePic", imageBase64String);

          if (userData) {
            const userDocRef = doc(db, "users", userData.uid);
            await setDoc(
              userDocRef,
              { profilePic: imageBase64String },
              { merge: true }
            );

            setUserData((prevUser) => ({
              ...prevUser,
              profilePic: imageBase64String,
            }));
          }
        } catch (error) {
          console.error("Failed to set user profile pic:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
      setUserData(null);
      setProfilePic(null);
      localStorage.removeItem("profilePic");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        profilePic,
        setUserData,
        logout,
        handleImgchange,
        updateUserInfo, // Added function for updating bio & location
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext };
