import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImg from './main_intro.jpg'

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
          localStorage.setItem('kick_user', username);
          localStorage.removeItem('kick_code_verifier');

          // Forzar recarga completa a la URL original
          const redirectTo = isSorteoPath ? decodeURIComponent(state) : '/';
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
    <Grid style={{
      backgroundImage: `
linear-gradient(to bottom, rgba(63, 61, 69, 0.8), rgba(63, 61, 69, 0)),
url(${backgroundImg})
`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '980px',
      backgroundColor: '#3f3d45',
      margin: '0 auto',
      position: 'relative',
      backgroundPosition: '50%'
    }}>
      <Grid className='container' style={{
        padding: 50,
        gap: '10px',
        justifyContent: 'center',

      }}>
        <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
          <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '32px', fontFamily: 'Outfit,sans-serif' }} >
            eldenguee.com
          </Typography>
          <Typography sx={{
            background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: isMobile ? 32 : 65,
            fontFamily: 'Belerofonte'
          }} >Verificando..</Typography>
        </Grid>

        <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
          
        </Grid>
      </Grid>
    </Grid>
  )
}