import { createContext, useContext, useState, ReactNode } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously logged in
    return localStorage.getItem("datathon_auth") === "true";
  });

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      // Signed in
      const user = userCredential.user;
      setIsAuthenticated(true);
      localStorage.setItem("datathon_auth", "true");
      return true; // Successfully logged in
    } catch (error: any) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("datathon_auth");
      return false; // Failed to log in
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("datathon_auth");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
