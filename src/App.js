import './App.css';
import { Routes, Route } from 'react-router'
import Home from './Home';
import Stats from './Stats';
import { useEffect, useState } from 'react';
import PanelSorteo from './CrearSorteo';
import CrearSorteo from './CrearSorteo';
import ListadoSorteos from './ListadoSorteos';
import DetalleSorteo from './DetalleSorteo';
import Callback from './Callback';
import { Box, Button, Checkbox, Grid, Modal, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import backgroundImg from './main_intro.jpg'
import { Link } from 'react-router-dom';
import { FaKickstarterK } from 'react-icons/fa6';
import { generatePKCE } from './api/pkce';
import Tipeo from './Tipeo';
import AdminPanel from './AdminPanel';
import Paneltipeo from './Paneltipeo';
import TipeoCustom from './TipeoCustom';
import Roller from './Roller';
import Tienda from './Tienda';
import { IoCloseCircleOutline } from 'react-icons/io5';
import backg from './main_intro.jpg'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 4,
    boxShadow: 24,
    backdropFilter: 'blur(8px)',
    p: 4,
    textAlign: 'center',
};

const buttonBase = {
    px: 3,
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 'bold',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '12px',
    background: 'transparent',
    transition: '0.3s ease',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
};
function App() {
    const [width, setWidth] = useState(window.innerWidth);
    const isMobile = width <= 768;
    const location = useLocation(); // Captura la URL actual
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const nombre = localStorage.getItem('kick_user')

    const RutaPrivada = ({ children }) => {
        const usuario = localStorage.getItem('fbUser')?.replaceAll('"', "");
        const usuarioKick = localStorage.getItem('kick_user')
        const isSorteoRoute = location.pathname.startsWith('/sorteo/');
        const isTipeoRoute = location.pathname.startsWith('/tipeos/');
        console.log('usuarioKick', usuarioKick)
        const isLoggedIn = usuario || usuarioKick;
        // Verificar si el usuario es válido (incluye tanto fbUser como kick_user)
        const isValidUser =
            (isSorteoRoute && isLoggedIn) || (isTipeoRoute && isLoggedIn) || // Si es sorteo, todos pueden acceder
            (usuario === 'Lucas Luna' || usuario === 'Luis San Cristobal') ||
            (usuarioKick === 'eldenguee' || usuarioKick === 'lucaslunacl');
        const [open, setOpen] = useState(false);

        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

        const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
        const [isChecked, setIsChecked] = useState(false);

        const handleCheckboxChange = (event) => {
            setIsChecked(event.target.checked);
        };

        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(20, 20, 20, 0.95)',
            borderRadius: 4,
            boxShadow: 24,
            backdropFilter: 'blur(8px)',
            textAlign: 'center',
            backgroundImage: `
            linear-gradient(to bottom,  rgba(63, 61, 69, 0),rgb(73 22 227)),
            url(${backg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            padding: isMobile ? '35px' : '150px 56px 56px'
        };
    
        const loginWithKick = async () => {

            const { code_verifier, code_challenge } = await generatePKCE();
            localStorage.setItem('kick_code_verifier', code_verifier);

            const criptoRandom = crypto.randomUUID()

            const state = isSorteoRoute || isTipeoRoute ? encodeURIComponent(location.pathname) : encodeURIComponent('/');
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: '01JW6K1RY4R70K7B6KSJ8GK5CV',
                redirect_uri: 'https://eldenguee.com/callback',
                scope: 'user:read',
                code_challenge: code_challenge,
                code_challenge_method: 'S256',
                state: state,
            });

            window.location.href = `https://id.kick.com/oauth/authorize?${params.toString()}`;
        };
        if (!isValidUser) {
            // Mostrar un mensaje de advertencia y redirigir al login
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
                                Acceso restringido
                            </Typography>
                            <Typography sx={{
                                background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                fontSize: isMobile ? 32 : 65,
                                fontFamily: 'Belerofonte'
                            }} >Por favor, inicia sesión.</Typography>
                        </Grid>

                        <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
                            <Button
                                style={{
                                    background: 'linear-gradient(0deg,rgba(0,0,0,.4),rgba(0,0,0,.4)),linear-gradient(94deg,#7676f5 29.94%,#5a22a1 83.55%)',
                                    color: 'white',
                                    padding: 15,
                                    borderRadius: '100px',
                                    gap: '10px'
                                }}
                                className='botonCod'
                            >

                                <Typography style={{ color: 'white', fontFamily: 'Outfit,sans-serif' }} onClick={handleOpen}>  Iniciar Sesión</Typography>
                            </Button>
                        </Grid>
                    </Grid>

                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style}>
                            <IoCloseCircleOutline onClick={() => handleClose()} style={{ color: 'white', position: 'absolute', backdropFilter: 'blur(16.2px)', top: '15px', right: '10px', fontSize: '32px', cursor: 'pointer' }} />


                            <Stack spacing={2} style={{ display: isMobile && 'flex', gap: isMobile && 10, flexDirection: isMobile && 'column' }}>
                                <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', fontFamily: 'Outfit,sans-serif' }} >
                                    Bienvenidos a
                                </Typography>
                                <Typography sx={{
                                    background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? 28 : 45,
                                    fontFamily: 'Belerofonte'
                                }} >Eldenguee.com</Typography>

                                <Grid style={{ display: 'flex', alignItems: 'center', width: isMobile && '100%' }}>
                                    <Checkbox {...label} sx={{
                                        color: 'white',
                                        '&.Mui-checked': {
                                            color: 'white',
                                        },

                                    }} checked={isChecked}
                                        onChange={handleCheckboxChange} />
                                    <Typography style={{ color: 'white', fontFamily: 'Outfit,sans-serif' }}>Confirmo que soy mayor de 18 años y leí los términos y condiciones de la página</Typography>
                                </Grid>
                                {/* Kick Login */}
                                <Button
                                    sx={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        padding: '0.75rem 2rem',
                                        fontSize: '.8rem',
                                        width: isMobile ? '100%' : '50%',
                                        cursor: !isChecked && 'not-allowed',
                                        backgroundImage: `linear-gradient(0deg, #00ff73, #00ff73),
                  linear-gradient(94deg, #00ff73 29.94%, #00ff73 83.55%)`,
                                        border: '2px solid rgba(118, 118, 245, 0.5)',
                                        borderRadius: '12px',
                                        boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease-in-out',
                                        margin: '0 auto',
                                        '&:hover': {
                                            boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                    style={{ margin: '0 auto' }}
                                    startIcon={<FaKickstarterK size={20} />}
                                    onClick={loginWithKick}
                                    disabled={!isChecked}
                                >
                                    Iniciar Sesión con Kick
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>
                </Grid>
            );
        }

        return children;
    };
    const styles = {
        mensaje: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '20px',
        },
    };
    const [sorteos, setSorteos] = useState([]);
    return (
        <div className="App">
            <Routes>

                <Route exact path='/' element={<Home isMobile={isMobile} />} />
                <Route path='/stats' element={<Stats />} />

                <Route path='/panel' element={<RutaPrivada><CrearSorteo isMobile={isMobile} sorteos={sorteos} setSorteos={setSorteos} /></RutaPrivada>} />
                <Route path='/crearlink' element={<RutaPrivada><Paneltipeo isMobile={isMobile} /></RutaPrivada>} />
                <Route path="/tipeos/:url" element={<RutaPrivada><TipeoCustom isMobile={isMobile} /> </RutaPrivada>} />

                <Route path="/listado" element={<RutaPrivada><ListadoSorteos sorteos={sorteos} /> </RutaPrivada>} />

                <Route path="/sorteo/:url" element={<DetalleSorteo sorteos={sorteos} setSorteos={setSorteos} isMobile={isMobile} /> } />
                <Route path="/solicitudes" element={<RutaPrivada><AdminPanel isMobile={isMobile} /> </RutaPrivada>} />

                <Route path="/callback" element={<Callback />} />
                <Route path="/tipeo" element={<Tipeo nombre={nombre} isMobile={isMobile} />} />
                <Route path="/ruleta" element={<Roller nombre={nombre} />} />
                <Route path="/shop" element={<Tienda nombre={nombre} isMobile={isMobile} />} />
            </Routes>
        </div>
    );
}

export default App;
