"use client";
import { useEffect, useState } from "react";
import { User } from "@/types";

export const useConfig = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const userData = localStorage.getItem("user");
    const id = localStorage.getItem("user_id");

    if (token) setUserToken(token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user"); // Clear the invalid data
      }
    }
    if (id) setUserId(Number(id));
  }, []);

  const updateUser = (userData: User, token: string) => {
    setUser(userData);
    setUserToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_token", token);
  };

  const logoutUser = () => {
    setUser(null);
    setUserToken(null);
    setUserId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_id");
  };

  return {
    userToken,
    user,
    userId,
    updateUser,
    logoutUser,
  };
};
