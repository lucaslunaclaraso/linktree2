// components/Loader.jsx
import React from 'react';
import { Box } from '@mui/material';
import logo from './logoDengue.webp'
const Loader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#11111d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        component="img"
        src={logo} // usa tu logo o imagen aquí
        alt="Loading"
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          animation: 'pulse 1.5s infinite',
        }}
      />
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Loader;
