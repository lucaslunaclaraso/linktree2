import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';
const socket = io('https://002c-54-39-131-40.ngrok-free.app'); // mismo que el socket
const items = [
  { name: 'AK-47', color: '#ef5350' },
  { name: 'Desert Eagle', color: '#42a5f5' },
  { name: 'AWP', color: '#66bb6a' },
  { name: 'M4A4', color: '#ffca28' },
  { name: 'USP-S', color: '#ab47bc' },
];

const ITEM_WIDTH = 180; // Ancho de cada ítem
const VISIBLE_ITEMS = 3; // Ítems visibles
const ROLL_DURATION = 2000; // Duración del giro (2 segundos)
const SPEED_MULTIPLIER = 5; // Factor para mayor velocidad

const Roller = () => {
  const [rolling, setRolling] = useState(false);
  const [offset, setOffset] = useState(0);
  const [winner, setWinner] = useState(null);
  const [lastSub, setLastSub] = useState(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const iframeRef = useRef(null);

  // Calcular cuántas veces repetir los ítems para evitar espacios vacíos
  const totalItemsWidth = items.length * ITEM_WIDTH;
  const maxOffset = totalItemsWidth * SPEED_MULTIPLIER * 2;
  const repeatCount = Math.ceil(maxOffset / totalItemsWidth) + 1;
  const repeatedItems = Array(repeatCount).fill(items).flat();

  // Detectar cambios en el DOM del iframe para capturar alertas
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const checkForAlerts = () => {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // Busca un elemento que indique una alerta (ajusta el selector según el DOM del widget)
        const alertElement = iframeDocument.querySelector('div[class*="alert"], div[class*="notification"]');
        if (alertElement && alertElement.textContent) {
          const alertText = alertElement.textContent.trim();
          // Verifica si el texto indica una suscripción (ajusta según el formato de BotRix)
          if (alertText && alertText.includes('subscribed') && !rolling) {
            // Extrae el nombre del usuario (esto puede variar según el formato del texto)
            const usernameMatch = alertText.match(/@(\w+)/) || alertText.match(/(\w+) subscribed/);
            const username = usernameMatch ? usernameMatch[1] : 'Usuario de Prueba';
            handleSubscription({ username });
          }
        }
      } catch (error) {
        console.error('Error al acceder al DOM del iframe:', error);
      }
    };

    // Revisa el DOM del iframe cada 1 segundo
    const interval = setInterval(checkForAlerts, 1000);

   

    return () => {
      clearInterval(interval);
     
    };
  }, [rolling]);

  const handleSubscription = (user) => {
    if (!rolling) {
      setRolling(true);
      setLastSub(user.username);
      setWinner(null);
      startRoll();
    }
  };

  // Inicializar audio
  useEffect(() => {
    audioRef.current = new Audio('https://freesound.org/data/previews/482/482663_10066982-lq.mp3');
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  // Función de easing para animación rápida pero suave
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const startRoll = () => {
    if (rolling) return;
    setWinner(null);
    setRolling(true);
    setOffset(0); // Reiniciar el offset para que el giro comience desde el principio
    audioRef.current.play().catch(() => { });

    // Seleccionar ítem ganador aleatorio
    const targetItemIndex = Math.floor(Math.random() * items.length);
    // Calcular offset para centrar el ítem ganador, con más vueltas para mayor velocidad
    const baseOffset = (items.length + targetItemIndex) * ITEM_WIDTH + ITEM_WIDTH / 2 - (VISIBLE_ITEMS * ITEM_WIDTH) / 2;
    const extraLoops = items.length * ITEM_WIDTH * SPEED_MULTIPLIER;
    const targetOffset = -(baseOffset + extraLoops);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ROLL_DURATION, 1);
      const easedProgress = easeOutCubic(progress);
      const currentOffset = easedProgress * (targetOffset - 0) + 0; // Usar 0 como punto de partida

      setOffset(currentOffset);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRolling(false);
        setOffset(targetOffset);
        setWinner(items[targetItemIndex]);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);
  const eventosRef = useRef([]);
  const [excelUrl, setExcelUrl] = useState(null);
  useEffect(() => {
    const handleNuevoFollow = ({ username }) => {
      console.log('Nuevo follower:', username);

      // Iniciar la ruleta si no está girando
      if (!rolling) {
        handleSubscription({ username }); // <-- ESTA LÍNEA inicia el giro
      }
      console.log('user', username)
      // Agregar al array persistente
      eventosRef.current.push({
        tipo: 'follow',
        usuario: username,
        contenido: 'Nuevo seguidor',
        fecha: new Date().toLocaleString()
      });

      
    };

    socket.on('nuevo-follow', handleNuevoFollow);

    return () => {
      socket.off('nuevo-follow', handleNuevoFollow);
    };
  }, []);
  return (
    <Box sx={{ textAlign: 'center', bgcolor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      {lastSub && (
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          ¡{lastSub} se ha suscrito o regaló subs! Abriendo caja...
        </Typography>
      )}
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: `${VISIBLE_ITEMS * ITEM_WIDTH}px` }, maxWidth: '100%', mx: 'auto' }}>
        {/* Marca central */}
        <Box sx={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', fontSize: 40, color: '#ef5350', zIndex: 2 }}>
          ▼
        </Box>
        {/* Contenedor del roller */}
        <Box
          sx={{
            width: '100%',
            height: 150,
            overflow: 'hidden',
            border: '4px solid #424242',
            borderRadius: 3,
            bgcolor: 'linear-gradient(135deg, #212121, #424242)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              transform: `translateX(${offset}px)`,
              transition: rolling ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {/* Ítems repetidos dinámicamente para evitar espacios vacíos */}
            {repeatedItems.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  width: ITEM_WIDTH,
                  height: 150,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: '2px solid #616161',
                  bgcolor: item.color,
                  color: '#fff',
                  fontWeight: winner?.name === item.name ? 'bold' : 'normal',
                  fontSize: 20,
                  fontFamily: '"Roboto", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  transition: 'all 0.3s',
                  ...(winner?.name === item.name && {
                    boxShadow: '0 0 12px #ffeb3b',
                    border: '2px solid #ffeb3b',
                  }),
                }}
              >
                {item.name}
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
      {/* Iframe oculto para cargar el widget de BotRix */}
      <iframe
        ref={iframeRef}
        src="https://botrix.live/alerts?bid=3DaOGe3SpkYHh7JprKrZ9A"
        style={{ display: 'none' }}
        title="BotRix Alerts Widget"
      />
      {/* Botón de girar */}
      <Button
        variant="contained"
        onClick={startRoll}
        disabled={rolling}
        sx={{
          mt: 4,
          px: 6,
          py: 1.5,
          fontSize: 18,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          bgcolor: '#0288d1',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          '&:hover': { bgcolor: '#0277bd' },
          '&:disabled': { bgcolor: '#616161', cursor: 'not-allowed' },
        }}
      >
        Girar
      </Button>
     
      {/* Mensaje de ganador */}
      {winner && (
        <Typography
          sx={{
            mt: 4,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffeb3b',
            fontFamily: '"Roboto", sans-serif',
            textTransform: 'uppercase',
          }}
        >
          ¡Ganaste: {winner.name}!
        </Typography>
      )}
    </Box>
  );
};

export default Roller;