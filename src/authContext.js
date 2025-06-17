// authContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Al iniciar la app, cargar el usuario del localStorage
    const storedUser = localStorage.getItem('kick_user');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const login = (user) => {
    setUsername(user);
    localStorage.setItem('kick_user', user);
  };

  const logout = () => {
    setUsername(null);
    localStorage.removeItem('kick_user');
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
