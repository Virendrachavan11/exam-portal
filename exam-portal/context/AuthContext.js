
import { createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const handleLogin = async (EmailId, Password) => {
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailId, Password, Usertype }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(login({ user: data.EmailId, token: data.token, userType: data.Usertype }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignup = async (EmailId, Password) => {
    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailId, Password, Usertype }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(login({ user: data.EmailId, token: data.token, userType: data.Usertype}));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ handleLogin, handleSignup, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
