import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';

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
const VISIBLE_ITEMS = 5; // Aumentado para mostrar más ítems
const ROLL_DURATION = 8000;
const SPEED_MULTIPLIER = 5;

const Roller = () => {
  const cantidadRef = useRef(1);
  const [rolling, setRolling] = useState(false);
  const [offset, setOffset] = useState(0);
  const [winner, setWinner] = useState(null);
  const [lastSub, setLastSub] = useState(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);
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

    setWinner(null);
    setOffset(0);
    audioRef.current.play().catch(() => { });

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
        console.log('prize', prizeName)
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
          processQueue();
        }, 8000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const processQueue = () => {
    console.log('queueRef.current.length', queueRef.current.length)
    if (queueRef.current.length === 0) return;
    const nextUser = queueRef.current.shift();
    setLastSub(nextUser);
    setRolling(true);
    setWinner(null);
    startRoll();
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

    if (!rolling) {
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
        background: 'green',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {lastSub && rolling && (
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

      {rolling && (
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', sm: `${VISIBLE_ITEMS * ITEM_WIDTH}px` },
            height: 300, // Aumentada para dar espacio al carrusel
            mx: 'auto',
            perspective: '1000px',
            overflow: 'hidden',
            border: '4px solid #2a4066', // Color azul metálico de la caja
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.7), inset 0 0 20px rgba(0, 102, 204, 0.3)', // Sombra y brillo interno
            background: 'linear-gradient(135deg, #1e2a44 0%, #2a4066 100%)', // Fondo azul oscuro
          }}
        >
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
              border: '4px solid #ffd700', // Borde dorado
              background: 'rgba(255, 215, 0, 0.1)', // Fondo difuminado amarillo
              zIndex: 99999,
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)', // Resplandor
            }}
          />
          {/* Difuminado en los bordes */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, rgba(0,0,0,0) 10%, rgba(0,0,0,0.8) 80%)',
              zIndex: 9999,
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
            }}
          >
            {repeatedItems.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  width: ITEM_WIDTH,
                  height: 250,
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
          ¡Ganaste: {winner.name * cantidadRef.current} Tipeos!
        </Typography>
      )}

      
    </Box>
  );
};

export default Roller;