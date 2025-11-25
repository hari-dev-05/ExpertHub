import { createContext, useContext, useState, useEffect } from "react";
import { connectSocket, disconnectSocket } from "../Community/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // store full user object
const [profileEmail, setProfileEmail] = useState(null);

  // Load user from localStorage on mount
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUserState(parsedUser);

    // ✅ ADD THIS LINE
    if (parsedUser.email) setProfileEmail(parsedUser.email);

     // ✅ Connect socket globally
    if (parsedUser._id) connectSocket(parsedUser._id);
  }
}, []);


useEffect(() => {
  console.log("Updated profileEmail:", profileEmail);
}, [profileEmail]); // ✅ runs whenever profileEmail changes


  // Save user to state and localStorage
  const setUser = (userObj) => {
    setUserState(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));

     // ✅ Connect socket for this user
  if (userObj._id) connectSocket(userObj._id);
  };

  // Optional: clear user on logout
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
     // ✅ Disconnect socket
  disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout ,profileEmail, setProfileEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
