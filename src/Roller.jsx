import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import io from 'socket.io-client';

const socket = io('https://25a4-54-39-131-40.ngrok-free.app', {
  transports: ['websocket', 'polling'],
});

const items = [
  { name: 'AK-47', color: '#ef5350' },
  { name: 'Desert Eagle', color: '#42a5f5' },
  { name: 'AWP', color: '#66bb6a' },
  { name: 'M4A4', color: '#ffca28' },
  { name: 'USP-S', color: '#ab47bc' },
];

const ITEM_WIDTH = 180;
const VISIBLE_ITEMS = 3;
const ROLL_DURATION = 2000;
const SPEED_MULTIPLIER = 5;

const Roller = () => {
  const [rolling, setRolling] = useState(false);
  const [offset, setOffset] = useState(0);
  const [winner, setWinner] = useState(null);
  const [lastSub, setLastSub] = useState(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const iframeRef = useRef(null);
  const eventosRef = useRef([]);
  const queueRef = useRef([]); // ⬅️ Cola de usuarios

  const totalItemsWidth = items.length * ITEM_WIDTH;
  const maxOffset = totalItemsWidth * SPEED_MULTIPLIER * 2;
  const repeatCount = Math.ceil(maxOffset / totalItemsWidth) + 1;
  const repeatedItems = Array(repeatCount).fill(items).flat();

  useEffect(() => {
    audioRef.current = new Audio('https://freesound.org/data/previews/482/482663_10066982-lq.mp3');
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const startRoll = () => {
    if (rolling) return;

    setWinner(null);
    setOffset(0);
    audioRef.current.play().catch(() => { });

    const targetItemIndex = Math.floor(Math.random() * items.length);
    const baseOffset = (items.length + targetItemIndex) * ITEM_WIDTH + ITEM_WIDTH / 2 - (VISIBLE_ITEMS * ITEM_WIDTH) / 2;
    const extraLoops = items.length * ITEM_WIDTH * SPEED_MULTIPLIER;
    const targetOffset = -(baseOffset + extraLoops);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ROLL_DURATION, 1);
      const easedProgress = easeOutCubic(progress);
      const currentOffset = easedProgress * targetOffset;

      setOffset(currentOffset);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setOffset(targetOffset);
        setWinner(items[targetItemIndex]);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        setTimeout(() => {
          setRolling(false);
          processQueue(); // ⬅️ Sigue con el siguiente de la cola
        }, 10000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const processQueue = () => {
    if (queueRef.current.length === 0) return;

    const nextUser = queueRef.current.shift();
    setLastSub(nextUser);
    setRolling(true);
    setWinner(null);
    startRoll();
  };

  const handleNuevoFollow = ({ username }) => {
    console.log('Nuevo follower:', username);
    queueRef.current.push(username);
    eventosRef.current.push({
      tipo: 'follow',
      usuario: username,
      contenido: 'Nuevo seguidor',
      fecha: new Date().toLocaleString(),
    });

    if (!rolling) {
      processQueue();
    }
  };

  useEffect(() => {
    socket.on('nuevo-follow', handleNuevoFollow);
    return () => {
      socket.off('nuevo-follow', handleNuevoFollow);
    };
  }, [rolling]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  return (
    <Box
      sx={{
        textAlign: 'center',
        bgcolor: 'green',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {lastSub && rolling && (
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          ¡{lastSub} se ha suscrito o regaló subs! Abriendo caja...
        </Typography>
      )}

      {rolling && (
        <>
          <Box sx={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', fontSize: 40, color: '#ef5350', zIndex: 2 }}>
            ▼
          </Box>
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', sm: `${VISIBLE_ITEMS * ITEM_WIDTH}px` },
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
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
        </>
      )}

      <iframe
        ref={iframeRef}
        src="https://botrix.live/alerts?bid=3DaOGe3SpkYHh7JprKrZ9A"
        style={{ display: 'none' }}
        title="BotRix Alerts Widget"
      />

      {winner && rolling && (
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
