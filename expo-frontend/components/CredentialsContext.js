import { createContext } from "react";

// Credentials context
export const CredentialsContext = 
    createContext({storedCredentials: {}, setStoredCredentials: () => {}});