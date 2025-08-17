import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/users/me", {
          withCredentials: true,
        });
        setUser(data.data);
      } catch (err) {
        setUser(null);
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    notification,
    setNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
