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

  // Al montar el contexto, chequea expiración y carga usuario si está OK
  useEffect(() => {
    const expiresAt = Number(localStorage.getItem('accessTokenExpiresAt'));
    const now = Date.now();

    if (!expiresAt || now >= expiresAt) {
      // Token expirado o no existe: limpiar todo
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpiresAt');
      localStorage.removeItem('kickUser');
      setUsername(null);
    } else {
      // Token válido: cargar usuario guardado (si hay)
      const storedUser = localStorage.getItem('kickUser');
      if (storedUser) setUsername(storedUser);
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
