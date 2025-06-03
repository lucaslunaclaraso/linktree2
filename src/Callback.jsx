import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Variable global para evitar doble ejecución
let hasProcessedGlobally = false;

export default function Callback() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTokenExchange = async () => {
    if (hasProcessedGlobally) return; // Evita ejecutar si ya se procesó
    hasProcessedGlobally = true;

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const code_verifier = localStorage.getItem('kick_code_verifier');


    if (code && code_verifier) {
      try {
        const res = await fetch('https://apidengue.vercel.app/api/kick-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            code_verifier,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        

        if (data.access_token) {
          localStorage.setItem('kick_token', JSON.stringify(data));
          const redirectTo = location.state?.from || '/';
          navigate(redirectTo);
        } else {
          throw new Error('No se recibió un access_token válido');
        }
      } catch (err) {
        console.error('Error al obtener el token:', err);
        localStorage.setItem('kick_token', JSON.stringify({ error: 'Token inválido' }));
        navigate('/error');
      }
    } else {
      console.error('Faltan code o code_verifier');
      navigate('/error');
    }
  };

  useEffect(() => {
    handleTokenExchange();
  }, []); // Sin dependencias, solo se ejecuta al montar

  return <p>Validando token con Kick...</p>;
}