import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accEmail, setAccEmailState] = useState("");

  // Load email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("accEmail");
    if (storedEmail) setAccEmailState(storedEmail);
  }, []);

  // Save email to localStorage whenever it changes
  const setAccEmail = (email) => {
    setAccEmailState(email);
    localStorage.setItem("accEmail", email);
  };

  return (
    <AuthContext.Provider value={{ accEmail, setAccEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

