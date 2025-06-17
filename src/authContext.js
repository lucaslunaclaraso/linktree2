// authContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Al iniciar la app, cargar el usuario del localStorage
    const storedUser = localStorage.getItem('kickUser');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const login = (user) => {
    setUsername(user);
    localStorage.setItem('kickUser', user);
  };

  const logout = () => {
    setUsername(null);
    localStorage.removeItem('kickUser');
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
