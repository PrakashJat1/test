
import userService from "@/services/userService";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const fetchUser = async () => {
      try {
        const decodedUser = jwtDecode(token);
        const response = await userService.fetchUser(decodedUser.userId);
        setUser(response.data.user);
      } catch (error) {
        toast.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  return user;
};

export default useUser;
