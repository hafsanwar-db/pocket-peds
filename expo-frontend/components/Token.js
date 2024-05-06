import { createContext, useState } from "react";
export const Token = createContext();
export const TokenProvider = ({ children }) => {
  const [tokenValue, setTokenValue] = useState("");

  const updateToken = (newToken) => {
    setTokenValue(newToken);
  };
  return (
    <Token.Provider value={{ tokenValue, updateToken }}>
      {children}
    </Token.Provider>
  );
};
