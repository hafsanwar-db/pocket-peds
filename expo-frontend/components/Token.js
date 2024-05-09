import { createContext, useState } from "react";
export const Token = createContext();
export const TokenProvider = ({ children }) => {
  const [tokenValue, setTokenValue] = useState("");
  const [child, setChildName] = useState("");
  const updateToken = (newToken) => {
    setTokenValue(newToken);
  };
  const updateChild = (newChildName) => {
    setChildName(newChildName);
  };
  return (
    <Token.Provider value={{ tokenValue, updateToken, child, updateChild }}>
      {children}
    </Token.Provider>
  );
};
