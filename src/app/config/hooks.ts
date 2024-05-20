"use client";
import { useEffect, useState } from "react";
import { User } from "@/types";

export const useConfig = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    // const userData = localStorage.getItem("user");
    const id = localStorage.getItem("user_id");

    if (token) setUserToken(token);
    // if (userData) setUser(JSON?.parse(userData));
    if (id) setUserId(Number(id));
  }, []);

  const updateUser = (userData: User, token: string) => {
    setUser(userData);
    setUserToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_token", token);
  };

  return {
    userToken,
    user,
    userId,
    updateUser,
  };
};
