import React, { useEffect, useState } from 'react'
import Nlayout from './Nlayout'
import { Box, Button, Card, CardActions, CardContent, Grid, Modal, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import './Tienda.css'
const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    backgroundColor: '#ffffff', // Fondo blanco para un look limpio
    borderRadius: 12, // Bordes más redondeados para un diseño moderno
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Sombra suave para profundidad
    transition: 'transform 0.2s, box-shadow 0.2s', // Animación al hover
    '&:hover': {
        transform: 'translateY(-4px)', // Eleva la card al pasar el mouse
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', // Sombra más pronunciada al hover
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#6b48ff', // Color púrpura profesional
    color: '#ffffff',
    '&:hover': {
        backgroundColor: '#5a3ecc', // Variación al hover
    },
    textTransform: 'none', // Texto sin mayúsculas forzadas
    padding: '6px 16px',
    borderRadius: 8, // Bordes redondeados en el botón
}));


function Tienda(props) {
    const nombre = localStorage.getItem('kick_user')

    const[monto, setMonto] =useState()
    const [open, setOpen] = useState()
    const canjearPremio = async (nombre, canje) => {
        const response = await axios.post('https://backmu.vercel.app/solicitudes/canjear', { nombre, canje })
        console.log('re', response.data?.length)
        if (response.data?.length >= 1) {
            setOpen(true)
            if(canje == 1){
                setMonto(500)
            }else if(canje == 2){
                setMonto(1000)
            }else if( canje == 3){
                setMonto(1500)
            }

        }
    }
    const [progress, setProgress] = useState(100);
    const duration = 5000; // 5 segundos

    useEffect(() => {
        if (open) {
            let interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        setOpen(false);
                        return 0;
                    }
                    return prev - 2;
                });
            }, duration / 50);

            return () => clearInterval(interval);
        }
    }, [open]);
    return (
        <Nlayout>
            <Grid style={{ background: '#11111d' }}>
                <Box p={4} style={{ width: '85%', margin: '0 auto', marginBottom: '15%' }}>
                    <Typography sx={{
                        background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: 40,
                        fontFamily: 'PoetsenOne'
                    }} >Shop</Typography>



                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 4 }}>


                        <StyledCard>
                            <CardContent sx={{ padding: 3 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        fontWeight: 600, // Negrita para destacar
                                        color: '#1e1e2f', // Color oscuro para el título
                                        marginBottom: 1,
                                    }}
                                >
                                    1 Solicitud de tipeo
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666666', // Gris medio para el texto secundario
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Adquiere una solicitud de tipeo para agilizar tus tareas. Perfecto para gestionar tu tiempo de forma eficiente.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ padding: '0 16px 16px 16px', justifyContent: 'flex-end' }}>
                                <StyledButton size="small" onClick={() => canjearPremio(nombre, 1)}> $DCoins 500 - Canjear</StyledButton>
                            </CardActions>
                        </StyledCard>
                        <StyledCard>
                            <CardContent sx={{ padding: 3 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        fontWeight: 600, // Negrita para destacar
                                        color: '#1e1e2f', // Color oscuro para el título
                                        marginBottom: 1,
                                    }}
                                >
                                    3 Solicitudes de tipeo
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666666', // Gris medio para el texto secundario
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Adquiere una solicitud de tipeo para agilizar tus tareas. Perfecto para gestionar tu tiempo de forma eficiente.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ padding: '0 16px 16px 16px', justifyContent: 'flex-end' }}>
                                <StyledButton size="small" onClick={() => canjearPremio(nombre, 2)}>$DCoins 1000 - Canjear</StyledButton>
                            </CardActions>
                        </StyledCard>
                        <StyledCard>
                            <CardContent sx={{ padding: 3 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        fontWeight: 600, // Negrita para destacar
                                        color: '#1e1e2f', // Color oscuro para el título
                                        marginBottom: 1,
                                    }}
                                >
                                    5 Solicitudes de tipeo
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666666', // Gris medio para el texto secundario
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Adquiere una solicitud de tipeo para agilizar tus tareas. Perfecto para gestionar tu tiempo de forma eficiente.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ padding: '0 16px 16px 16px', justifyContent: 'flex-end' }}>
                                <StyledButton size="small" onClick={() => canjearPremio(nombre, 3)}>$DCoins 1500 - Canjear</StyledButton>
                            </CardActions>
                        </StyledCard>




                    </Grid>
                </Box>
            </Grid>


            <Modal open={open} onClose={() => setOpen(false)} disableAutoFocus>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="toast-container"
                        >
                            <div className="toast-content">
                                <div className="icon">💰</div>
                                <div className="text">
                                    <strong>Canje exitoso</strong>
                                    <p>Tu canje de <strong>- ${monto} DCoins</strong> ha sido procesado.</p>
                                </div>
                                <button className="close-btn" onClick={() => setOpen(false)}>×</button>
                            </div>
                            <div className="progress-bar" style={{ width: `${progress}%` }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>
        </Nlayout>
    )
}

export default Tienda