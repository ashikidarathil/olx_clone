import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);
export const userAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUsers] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUsers(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};