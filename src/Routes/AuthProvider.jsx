import React from "react";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import moment from "moment";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(moment().diff(localStorage.getItem("token_expiry"),  'minutes') < 0 ? localStorage.getItem("token"):null);
  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token',token);
      localStorage.setItem('token_expiry', moment().add(1, 'days'))
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiry')
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;