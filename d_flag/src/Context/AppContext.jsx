import { createContext, useState } from "react";

const AppContext = createContext("");

const AppContextProvider = ({ children }) => {
  // const [authenticated, setAuthenticated] = useState(false);
  const [is_logged_in, setIs_logged_in] = useState(0);

  return (
    <AppContext.Provider
      value={{is_logged_in,setIs_logged_in }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
