import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';
import video from './video-ruleta.mp4';

// Conexión con Socket.IO
const socket = io('https://socket.eldenguee.com', {
  transports: ['websocket', 'polling'],
});

// Premios con probabilidades
const items = [
  { name: 0, color: '#616161', probability: 51, rarity: 'common' },
  { name: 1, color: '#42a5f5', probability: 26, rarity: 'uncommon' },
  { name: 2, color: '#ffca28', probability: 13, rarity: 'rare' },
  { name: 5, color: '#ab47bc', probability: 10, rarity: 'legendary' },
];

const ITEM_WIDTH = 180;
const VISIBLE_ITEMS = 5;
const ROLL_DURATION = 8000;
const SPEED_MULTIPLIER = 5;

const Roller = () => {
  const cantidadRef = useRef(1);
  const [rolling, setRolling] = useState(false);
  const [offset, setOffset] = useState(0);
  const [winner, setWinner] = useState(null);
  const [lastSub, setLastSub] = useState(null);
  const [showVideo, setShowVideo] = useState(true); // State to toggle video/roulette
  const animationRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null); // Ref for video element
  const eventosRef = useRef([]);
  const queueRef = useRef([]);

  // Generar ítems repetidos para el desplazamiento
  const totalItemsWidth = items.length * ITEM_WIDTH;
  const maxOffset = totalItemsWidth * SPEED_MULTIPLIER * 2;
  const repeatCount = Math.ceil(maxOffset / totalItemsWidth) + 1;
  const repeatedItems = Array(repeatCount).fill(items).flat();

  // Inicializar audio
  useEffect(() => {
    audioRef.current = new Audio('https://freesound.org/data/previews/482/482663_10066982-lq.mp3');
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Elegir ítem según probabilidad
  const getRandomItemIndex = () => {
    const total = items.reduce((sum, item) => sum + item.probability, 0);
    const rand = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      acc += items[i].probability;
      if (rand <= acc) return i;
    }
    return items.length - 1;
  };

  const startRoll = () => {
    if (rolling) return;

    setRolling(true);
    setWinner(null);
    setOffset(0);
    audioRef.current.play().catch(() => {});

    const targetItemIndex = getRandomItemIndex();
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

        // Enviar tipeos al backend
        const prizeName = items[targetItemIndex].name;
        if (prizeName !== 0) {
          const baseAmount = prizeName;
          const total = baseAmount * (cantidadRef.current || 1);

          if (!isNaN(total) && lastSub) {
            axios
              .put(`https://backmu.vercel.app/sorteo/${lastSub}/incrementar-solicitudes`, {
                cantidad: total,
              })
              .then((res) => {
                console.log('Actualización exitosa:', res.data);
              })
              .catch((err) => {
                console.error('Error al actualizar tipeos:', err);
              });
          }
        }

        setTimeout(() => {
          setRolling(false);
          setShowVideo(false); // Reset to show video again
          processQueue();
        }, 8000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const processQueue = () => {
    if (queueRef.current.length === 0) return;
    const nextUser = queueRef.current.shift();
    setLastSub(nextUser);
    setShowVideo(true); // Show video before starting roll
    if (videoRef.current) {
      videoRef.current.play(); // Play video
    }
  };

  const handleNuevoFollow = ({ username, cantidad = 1 }) => {
    console.log('user', username);
    console.log('cantidad', cantidad);
    cantidadRef.current = cantidad;
    queueRef.current.push(username);
    eventosRef.current.push({
      tipo: 'follow',
      usuario: username,
      contenido: 'Nuevo seguidor',
      fecha: new Date().toLocaleString(),
    });

    if (!rolling && queueRef.current.length === 1) {
      processQueue();
    }
  };

  useEffect(() => {
    socket.on('nuevo-sub', handleNuevoFollow);
    return () => {
      socket.off('nuevo-sub', handleNuevoFollow);
    };
  }, [rolling]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Handle video end to start roulette
  const handleVideoEnd = () => {
    setShowVideo(false); // Hide video
    startRoll(); // Start roulette
  };

  const rarityGradients = {
    common: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))',
    uncommon: 'linear-gradient(to top, rgba(66,165,245,1), rgba(66,165,245,0))',
    rare: 'linear-gradient(to top, rgba(255,202,40,1), rgba(255,202,40,0))',
    legendary: 'linear-gradient(to top, rgba(171,71,188,1), rgba(171,71,188,0))',
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'green', // Match green screen for seamless transition
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {showVideo && lastSub && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <video
            ref={videoRef}
            src={video}
            autoPlay
            onEnded={handleVideoEnd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}

      {!showVideo && lastSub && rolling && (
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: '#fff',
            fontFamily: '"Roboto", sans-serif',
            textTransform: 'uppercase',
            animation: 'fadeIn 1s',
            zIndex: 2,
          }}
        >
          ¡{lastSub} se ha suscrito! Abriendo caja...
        </Typography>
      )}

      {!showVideo && rolling && (
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', sm: `${VISIBLE_ITEMS * ITEM_WIDTH}px` },
            height: 300,
            mx: 'auto',
            perspective: '1000px',
            overflow: 'hidden',
            border: '4px solid #2a4066',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.7), inset 0 0 20px rgba(0, 102, 204, 0.3)',
            background: 'linear-gradient(135deg, #1e2a44 0%, #2a4066 100%)',
          }}
        >
          {/* Palo vertical */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '55%',
              transform: 'translateX(-50%)',
              width: 3,
              background: 'linear-gradient(180deg, #6f00ff, #ff005e, #0000ff)',
              boxShadow: '0 0 15px 5px rgba(111, 0, 255, 0.7), 0 0 15px 5px rgba(255, 0, 94, 0.7)',
              animation: 'glitchAnimation 2s infinite alternate',
              zIndex: 99998,
              height: '70%',
            }}
          />

          {/* Círculo central */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '55%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: '4px solid #ffd700',
              background: 'rgba(255, 215, 0, 0.1)',
              zIndex: 99999,
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            }}
          />
          {/* Difuminado en los bordes */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              transform: `translateX(${offset}px)`,
              transition: rolling ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
              position: 'relative',
              zIndex: 2,
              height: '100%',
              alignItems: 'center',
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
                  borderRight: '2px solid #2a4066',
                  bgcolor: item.color,
                  color: '#fff',
                  fontWeight: winner?.name === item.name ? 'bold' : 'normal',
                  fontSize: 18,
                  fontFamily: '"Roboto", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  transform: 'rotateY(10deg)',
                  transition: 'all 0.3s',
                  background: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                  ...(winner?.name === item.name && {
                    boxShadow: '0 0 30px #ffd700, inset 0 0 15px #ffd700',
                    border: '2px solid #ffd700',
                    transform: 'rotateY(0deg) scale(1.2)',
                    zIndex: 3,
                  }),
                  ...(item.rarity === 'legendary' && {
                    animation: 'pulse 1.5s infinite',
                  }),
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  },
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '60%',
                    background: rarityGradients[item.rarity] || 'transparent',
                    pointerEvents: 'none',
                    zIndex: 1,
                  },
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: '50%',
                    width: '100%',
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 18,
                  }}
                >
                  {item.name * cantidadRef.current} Tipeos
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {winner && !showVideo && rolling && (
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
          ¡Ganaste: {winner.name * cantidadRef.current} Tipeos!
        </Typography>
      )}

      {/* <Button
        variant="contained"
        color="secondary"
        disabled={rolling}
        onClick={() => {
          cantidadRef.current = 1;
          setLastSub('Usuario de prueba');
          setShowVideo(true);
          if (videoRef.current) {
            videoRef.current.play();
          }
        }}
        sx={{ mt: 3 }}
      >
        Probar ruleta
      </Button> */}
    </Box>
  );
};

export default Roller;