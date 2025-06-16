import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent, Grid, Modal } from '@mui/material';
import Nlayout from './Nlayout';
import axios from 'axios';
import backgroundImg from './main_intro.jpg'
import { motion, AnimatePresence } from 'framer-motion';


export default function DetalleSorteo({ sorteos, setSorteos, isMobile }) {
    const { url } = useParams();
    const [sorteo, setSorteo] = useState()
    const [participantes, setParticipantes] = useState()
    const [ganadores, setGanadores] = useState()
    const [unirseSorteo, setUnirseSorteo] = useState()

    const obtenerSorteos = async () => {
        const peticion = await axios.get(`https://backmu.vercel.app/sorteo/${url}`)
        setSorteo(peticion?.data?.sorteo)
        setParticipantes(peticion?.data?.participantes)
    }

    const UnirseAlSorteo = async (nombre, mail) => {

        try {
            const peticion = await axios.post(`https://backmu.vercel.app/sorteo/${url}/unirse`, { nombre, mail })
            const peticionUser = await axios.post(`https://backmu.vercel.app/sorteo/crearUser`, { nombre, mail })

            if (peticion?.data?.success) {
                obtenerSorteos()
            } else {
                setUnirseSorteo(true)
                alert('ERROR YA TE UNISTE')

            }
        } catch (error) {
            setUnirseSorteo(true)

            alert('ERROR YA TE UNISTE')
        }

    }
    useEffect(() => { obtenerSorteos() }, [])


    const usuario = localStorage.getItem('fbUser')?.replaceAll('"', "");
    const usuarioKick = localStorage.getItem('kick_user')
    const mailKick = localStorage.getItem('kick_mail')
    const unirse = () => {
        const nombre = usuario || usuarioKick;
        const mail = mailKick
        if (!nombre) return;
        UnirseAlSorteo(nombre, mail)
    };


    const guardarGanadores = async (url, ganadores) => {
        try {
            const response = await axios.put(`https://backmu.vercel.app/sorteo/${url}/ganadores`, {
                ganadores, // puede ser string, array o JSON.stringify(...) según cómo guardes en la BD
            });
            console.log('Ganadores guardados:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al guardar ganadores:', error);
            throw error;
        }
    };
    const [open, setOpen] = useState()
    const [progress, setProgress] = useState(100);
    const duration = 5000; // 5 segundos

    useEffect(() => {
        if (open) {
            setProgress(100); // <-- Reset progress

            let interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        if (open) {
                            setOpen(false);
                        }
                        return 0;
                    }
                    return prev - 2;
                });
            }, duration / 50);

            return () => clearInterval(interval);
        }
    }, [open]);
    const sortear = () => {
        const shuffled = [...participantes].sort(() => 0.5 - Math.random());
        const ganadores = shuffled.slice(0, sorteo?.premios);
        setGanadores(ganadores)

        const nombreGan = ganadores?.map((p) => p?.nombre)

        guardarGanadores(url, nombreGan)
        // MOSTRAR ALERTA SI GANÓ EL USUARIO
        if (nombreGan.includes(usuarioKick)) {
            setOpen(true); // o `setGanasteTipeo(true)` si querés un estado exclusivo
        }
    };

    // Polling para actualizaciones en tiempo real
    useEffect(() => {
        obtenerSorteos(); // Carga inicial
        const interval = setInterval(obtenerSorteos, 5000); // Consulta cada 5 segundos

        // Limpieza del intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, [url]); // Dependencia en url para recargar si cambia

    return (
        <Nlayout>
            {
                sorteo?.estado === 'oculto' ?
                    <Grid style={{ background: '#11111d', marginTop: isMobile ? '-30%' : '-10%', width: '100%' }}>
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
                                    }} >El sorteo no existe</Typography>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                    :

                    <Box p={4} style={{ width: '85%', margin: '0 auto' }} >
                        <Typography variant="h4" style={{ color: 'white' }}>{sorteo?.titulo}</Typography>
                        <Typography variant="subtitle1" style={{ color: 'white' }}>Premios: {sorteo?.premios}</Typography>
                        {
                            !sorteo?.ganadores?.length &&
                            <Button onClick={unirse} variant="contained" sx={{ mt: 2, backgroundColor: unirseSorteo && 'red', color: unirseSorteo && 'white' }}> {unirseSorteo ? 'YA ESTAS PARTICIPANDO' : 'Unirse'}</Button>
                        }


                        {
                            (usuarioKick === 'eldenguee' || usuarioKick === 'lucaslunacl') &&
                            < Button onClick={sortear} variant="outlined" sx={{ mt: 2, ml: 2 }}>Sortear</Button>
                        }

                        <Grid style={{ display: 'flex', alignItems: 'start', gap: '10px', marginBottom: '5%' }}>

                            <Card sx={{ mt: 4, width: '30%' }}>
                                <CardContent sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    <Typography variant="h6">Participantes: {participantes?.length} </Typography>
                                    <List>
                                        {participantes?.map((u, i) => (
                                            <ListItem key={i}>
                                                <ListItemText primary={u?.nombre} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>


                            {sorteo?.ganadores?.length > 0 && (
                                <Card sx={{ mt: 4, bgcolor: '#e0f7fa', width: '30%' }}>
                                    <CardContent>
                                        <Typography variant="h6">🎉 Ganadores 🎉</Typography>
                                        <List>
                                            {JSON.parse(sorteo.ganadores).map((ganador, index) => (
                                                <ListItem key={index}>
                                                    <Grid style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography style={{ fontWeight: 'bold' }}>
                                                            Puesto {index + 1}:
                                                        </Typography>
                                                        <Typography >
                                                            {ganador}
                                                        </Typography>


                                                    </Grid>

                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>



                    </Box>
            }

            <Modal open={open} onClose={() => { setOpen(false) }}>
                <AnimatePresence>
                    {(open) && (
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="toast-container"
                        >
                            <div className="toast-content">
                                <div className="icon">🎉</div>
                                <div className="text">
                                    <strong>{open && '¡Felicidades!'}</strong>
                                    {open && (
                                        <p>¡Ganaste un <strong>tipeo</strong>! 🎁</p>
                                    )
                                    }
                                </div>
                                <button className="close-btn" onClick={() => { setOpen(false) }}>×</button>
                            </div>
                            <div className={open ? "progress-bar" : "progress-bar-error"} style={{ width: `${progress}%` }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>
        </Nlayout >
    );
}
