import React, { createContext, useState } from "react";

// Create context
const AppContext = createContext();

// Export the context so you can use useContext(AppContext) elsewhere
export { AppContext };

export function AppContextProvider({ children }) {
  // Example global states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Context value
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
