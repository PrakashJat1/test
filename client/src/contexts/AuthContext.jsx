import { AuthContext } from "@/hooks/useAuth";
import authService from "@/services/authService";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (token) => {
    const decodedUser = jwtDecode(token);

    setUser(decodedUser);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      if (token) {
        //set the token to header before login for fetch loggedIn user
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        try {
          const response = await authService.fetchLoggedInUser();

          console.log(response.data);
          const decodedUser = jwtDecode(token);
          setUser(decodedUser);
        } catch (error) {
          logout();
          console.error(error);
        }
      }
    };

    init();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
