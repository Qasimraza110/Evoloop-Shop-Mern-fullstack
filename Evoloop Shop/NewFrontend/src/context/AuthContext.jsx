import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [cart, setCart] = useState([]); // ✅ add cart state

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCart([]); // ✅ clear cart on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cart, setCart }}>
      {children}
    </AuthContext.Provider>
  );
};
