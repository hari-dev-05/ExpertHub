import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // store full user object
const [profileEmail, setProfileEmail] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserState(JSON.parse(storedUser));
  }, []);

useEffect(() => {
  console.log("Updated profileEmail:", profileEmail);
}, [profileEmail]); // ✅ runs whenever profileEmail changes


  // Save user to state and localStorage
  const setUser = (userObj) => {
    setUserState(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  // Optional: clear user on logout
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout ,profileEmail, setProfileEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
