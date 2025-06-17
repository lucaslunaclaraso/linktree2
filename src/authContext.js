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
  const kickTokenString = localStorage.getItem('kick_token');


  if (kickTokenString) {
    const kickToken = JSON.parse(kickTokenString);


    const accessToken = kickToken.access_token;
    const refreshToken = kickToken.refresh_token;
    const expiresIn = kickToken.expires_in;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessTokenExpiresAt', Date.now() + expiresIn * 1000);

    // // Ahora podés usar esas variables
    // console.log(accessToken, refreshToken, expiresIn);
  }
  // Al montar el contexto, chequea expiración y carga usuario si está OK
  useEffect(() => {
    const verifyToken = async () => {
      const tokenString = localStorage.getItem('accessToken');
      if (!tokenString) return;

      try {
        const res = await fetch('https://api.kick.com/public/v1/users', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${tokenString}`,
              'Accept': 'application/json',
          },
      });

      
        if (!res.ok) {
          // Token vencido o inválido
          console.log('Token inválido, limpiando localStorage');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessTokenExpiresAt');
          localStorage.removeItem('kick_user');
          localStorage.removeItem('kick_token');
          localStorage.removeItem('kick_mail');
          setUsername(null);
          window.location.reload();
        } else if (res.ok) {
          const userData = await res.json();
          setUsername(userData?.data[0]?.name); // o tokenObj.username si lo guardás
        }
      } catch (error) {
        console.error('Error verificando token:', error);
      }
    };

    verifyToken();
  }, []);

  const login = (user) => {
    setUsername(user);
    localStorage.setItem('kick_user', user);
  };

  const logout = () => {
    setUsername(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiresAt');
    localStorage.removeItem('kick_user');
    localStorage.removeItem('kick_token');
    localStorage.removeItem('kick_mail');
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
