import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImg from './main_intro.jpg'
import Loader from './Loader';

// Variable global para evitar doble ejecución
let hasProcessedGlobally = false;

export default function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleTokenExchange = async () => {
    if (hasProcessedGlobally) return; // Evita ejecutar si ya se procesó
    hasProcessedGlobally = true;

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // URL original (por ejemplo, "/sorteo/123")

    const code_verifier = localStorage.getItem('kick_code_verifier');
    console.log('state', state)

    const isSorteoPath = state.includes("sorteo");
    const isTipeoPath = state.includes("tipeos");


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

         
          // Obtener datos del usuario
          const response = await fetch('https://api.kick.com/public/v1/users', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
              'Accept': 'application/json',
            },
          });

          const userData = await response.json();
          console.log('User data:', userData);
          // Guardar el nombre de usuario (ajusta según la estructura de userData)
          const username = userData?.data[0]?.name; // Fallback
          const emailKick = userData?.data[0]?.email; // Fallback
          localStorage.setItem('kick_user', username);
          localStorage.setItem('kick_mail', emailKick); // Guarda los datos del usuario
          localStorage.removeItem('kick_code_verifier');

          // Forzar recarga completa a la URL original
          const redirectTo = isSorteoPath || isTipeoPath ? decodeURIComponent(state) : '/';
          window.location.href = redirectTo;
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

  return (
    <Loader />
  )
}