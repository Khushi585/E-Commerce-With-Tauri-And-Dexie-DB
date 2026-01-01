import { createContext, useContext, useState } from "react";
import { loginUser, updateUser } from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const loggedUser = await loginUser({
      email,
      password,
    });

    setUser(loggedUser); 
    return loggedUser;
  };

  const logout = () => setUser(null);

  const updateProfile = async (updates) => {
    if (!user?.id) throw new Error("Not logged in");
    const updated = await updateUser(user.id, updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
