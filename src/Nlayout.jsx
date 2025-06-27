import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { AppBar, Box, Button, Checkbox, Menu, MenuItem, Modal, Stack, Toolbar, Typography } from '@mui/material';
import './Nlayout.css'
import { Link, useLocation } from 'react-router-dom'
import { FaBagShopping, FaDiscord, FaFacebook, FaInstagram, FaKickstarterK, FaYoutube } from 'react-icons/fa6';
import logo from './logo_intro2.png'
import logoDengue from './logoDengue.webp'
import backg from './main_intro.jpg'
import { generatePKCE } from './api/pkce';
import { IoCloseCircleOutline } from "react-icons/io5";
import { PiRankingFill } from "react-icons/pi";
import { IoMdArrowDropdown, IoMdHome } from "react-icons/io";
import gamble from './gambleAware.svg'
import { FaFacebookSquare } from 'react-icons/fa';
import { FaCrown } from 'react-icons/fa';
import { TbRating18Plus } from "react-icons/tb";
import { IoIosSunny, IoMdClose, IoMdDownload, IoMdMenu } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

import coin from './Wild_coin.png'
import axios from 'axios';
import Loader from './Loader';
import { useAuth } from './authContext';

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
function Nlayout(props) {
    const { username, logout } = useAuth();
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    
    const [user, setUser] = useState(null); // State to store user data (name, logged-in status)
   


    const redirectUri = "/callback";
    const clientId = "01JW6K1RY4R70K7B6KSJ8GK5CV";
    const scope = "user"; // según lo que pediste



    const loginWithKick = async () => {

        const { code_verifier, code_challenge } = await generatePKCE();
        localStorage.setItem('kick_code_verifier', code_verifier);

        const criptoRandom = crypto.randomUUID()

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: '01JW6K1RY4R70K7B6KSJ8GK5CV',
            redirect_uri: 'https://eldenguee.com/callback',
            scope: 'chat:write channel:read user:read events:subscribe',
            code_challenge: code_challenge,
            code_challenge_method: 'S256',
            state: criptoRandom,
        });

        window.location.href = `https://id.kick.com/oauth/authorize?${params.toString()}`;
    };

    // const fetchUserData = (accessToken) => {
    //     window.FB.api('/me', { fields: 'name,email' }, (fbResponse) => {
    //         console.log('fbResponse', fbResponse)
    //         if (fbResponse && !fbResponse.error) {
    //             // Store user data and access token
    //             localStorage.setItem('fbUser', JSON.stringify(fbResponse.name));
    //             localStorage.setItem('fbAccessToken', accessToken);

    //             setUser({ name: fbResponse.name });
    //             handleClose(); // Close modal after successful login
    //         } else {
    //             console.error('Error fetching user data:', fbResponse.error);
    //         }
    //     });
    // };

    const tokenKick = localStorage.getItem('kick_token');

    const parsedToken = JSON.parse(tokenKick);


    const fetchUserDataKick = async (accessToken) => {

        try {
            const response = await fetch('https://api.kick.com/public/v1/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();

            localStorage.setItem('kick_user', userData?.data[0]?.name); // Guarda los datos del usuario
            localStorage.setItem('kick_mail', userData?.data[0]?.email); // Guarda los datos del usuario

            setUser({
                name: userData?.data[0]?.name, email: userData?.data[0]?.email, profile: userData?.data[0]?.profile_picture
            });

            return userData;
        } catch (err) {
            console.error('Error al obtener los datos del usuario:', err);
            throw err;
        }
    };

    useEffect(() => {
        if (!tokenKick) return; // No ejecutar si tokenKick es null o undefined
        fetchUserDataKick(parsedToken?.access_token)
    }, [tokenKick])

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [Dcoins, setDcoins] = useState(0)
    // Maneja el clic para abrir el menú
    const handleClick = (event) => {
        setAnchorEl(event);
    };

    // Maneja el cierre del menú
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Maneja el clic en "Cerrar sesión"
    const handleLogout = () => {

        setUser(null);
        localStorage.removeItem('fbUser');
        localStorage.removeItem('fbAccessToken');
        localStorage.removeItem('kick_code_verifier');
        localStorage.removeItem('kick_token');
        localStorage.removeItem('kick_user');
        console.log('User logged out');

        window.location.href = "/"
        handleClose(); // Cierra el menú
    };
    const [solicitudes, setSolicitudes] = useState()
    const nombre = localStorage.getItem('kick_user')

    const obtenerCoins = async () => {
        const response = await axios.post('https://backmu.vercel.app/solicitudes/usuario', { nombre });
        setDcoins(response?.data[0]?.Dcoins)
        setSolicitudes(response?.data[0]?.solicitudes)
    }

    useEffect(() => {
        obtenerCoins();
    }, []);

    const toPanel = () => {
        window.location.href = "/panel"
    }
    const toPanelSorteo = () => {
        window.location.href = "/listado"
    }

    const [width, setWidth] = useState(window.innerWidth);

    const isMobile = width <= 768;

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const isValidUser =
        (username === 'eldenguee') || (username === 'lucaslunacl');

    const isLoggedIn = username;
    const redirectTipeo = () => {
        window.location.href = "/tipeo"

    }
    const redirectShop = () => {
        window.location.href = "/shop"

    }
    const redirectSolicitudes = () => {
        window.location.href = "/solicitudes"
    }
    const redirectCrearSolicitudes = () => {
        window.location.href = "/crearlink"
    }
    const redirectListadoLinks = () => {
        window.location.href = "/listalinks"
    }
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mostrar loader en carga inicial
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1000); // duración del loader
        return () => clearTimeout(timer);
    }, [location.pathname]);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMenuOpen(!menuOpen);

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

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const [progress, setProgress] = useState(100);
    const duration = 5000; // 5 segundos
    const [openModal, setOpenModal] = useState(false)
    useEffect(() => {
        if (openModal) {
            setProgress(100); // <-- Reset progress

            let interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        if (openModal) {
                            setOpenModal(false);
                        }
                        return 0;
                    }
                    return prev - 2;
                });
            }, duration / 50);

            return () => clearInterval(interval);
        }
    }, [openModal]);
    return (
        <Grid style={{ display: 'flex', flexDirection: 'column' }}>

            <Grid classname='header' style={{ zIndex: 9998, padding: isMobile ? 5 : 10, background: '#00000045', boxShadow: '3px 2px 15px' }}>
                <Toolbar style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: isMobile ? '100%' : '85%', margin: '0 auto', padding: isMobile && 0 }}>

                    {
                        !isMobile &&

                        <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>


                            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} className='itemMenu'>
                                <IoMdHome style={{ color: 'white' }} className='itemMenu' />

                                <Typography sx={{
                                    background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    fontFamily: 'Outfit,sans-serif'
                                }} className='itemMenu' >Home</Typography>

                            </Link>


                            <div onClick={() => setOpenModal(true)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} className='itemMenu'>
                                <PiRankingFill style={{ color: 'white' }} className='itemMenu' />

                                <Typography sx={{
                                    background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    fontFamily: 'Outfit,sans-serif'
                                }} >Rankings</Typography>

                            </div>



                            <div onClick={() => setOpenModal(true)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} className='itemMenu'>
                                <FaBagShopping style={{ color: 'white' }} className='itemMenu' />

                                <Typography sx={{
                                    background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    fontFamily: 'Outfit,sans-serif'
                                }} >Shop</Typography>

                            </div>

                        </Grid>
                    }



                    <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end', gap: '15px', width: isMobile ? '100%' : '80%' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            {
                                username &&

                                <Box sx={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: '#ff1744',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '50%',
                                    zIndex: 1,
                                    boxShadow: '0 0 0 2px white',
                                }}
                                >
                                    {solicitudes ?? 0}
                                </Box>
                            }
                            {
                                username &&

                                <Button

                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        padding: isMobile ? '.45 rem 1rem' : '0.45rem 2.5rem',
                                        fontSize: isMobile ? 16 : '0.85rem',
                                        background: 'linear-gradient(90deg, #9f6a00 0%, #ffc651 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '12px',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease-in-out',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 0 12px rgba(255, 198, 81, 0.6)',
                                        },
                                    }}

                                    onClick={redirectTipeo}

                                >
                                    Solicitar Tipeo
                                </Button>
                            }

                        </Box>
                        {/* 
                        {

                            (isValidUser) &&
                            <Button

                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    padding: '0.75rem 2rem',
                                    fontSize: '.8rem',

                                    backgroundImage: `linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)`,
                                    border: '2px solid #e0c060',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                                onClick={isLoggedIn && isValidUser ? redirectCrearSolicitudes : handleOpen}

                            >
                                Crear link de tipeo
                            </Button>
                        }
                        {

                            (isValidUser) &&
                            <Button

                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    padding: '0.75rem 2rem',
                                    fontSize: '.8rem',

                                    backgroundImage: `linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)`,
                                    border: '2px solid #e0c060',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                                onClick={isLoggedIn ? redirectSolicitudes : handleOpen}

                            >
                                Solicitudes de tipeo
                            </Button>
                        }
                        {
                            (isValidUser) &&

                            <Button

                                sx={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '0.75rem 2rem',
                                    fontSize: '.8rem',

                                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
                      linear-gradient(94deg, rgb(118, 118, 245) 29.94%, rgb(90, 34, 161) 83.55%)`,
                                    border: '2px solid rgba(118, 118, 245, 0.5)',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                                href='/listado'
                            >
                                Sorteos
                            </Button>
                        }
                        {
                            (isValidUser) &&

                            <Button
                                sx={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '0.75rem 2rem',
                                    fontSize: '.8rem',

                                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
                      linear-gradient(94deg, rgb(118, 118, 245) 29.94%, rgb(90, 34, 161) 83.55%)`,
                                    border: '2px solid rgba(118, 118, 245, 0.5)',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                Crear Sorteo
                            </Button>
                        } */}

                        {username ?
                            <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 8, borderRadius: '8px', background: '#10111c', justifyContent: 'center' }}>
                                    <img src={coin} style={{ width: '20%' }} />
                                    <Typography style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', color: 'hsla(0,0%,100%,.75)' }}>{Dcoins ?? 0}</Typography>
                                </Grid>
                                {
                                    !isMobile &&
                                    <Typography sx={{
                                        background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 700,
                                        fontSize: 16,
                                        textAlign: 'end',
                                        textTransform: 'uppercase',
                                        fontFamily: 'Outfit,sans-serif'

                                    }} > {username}
                                    </Typography>
                                }

                                <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={handleClick}>
                                    <Grid style={{ width: '45px', height: '45px', padding: '4px', borderRadius: '75px', border: '1px solid #807ffb' }}>
                                        <img src={user?.profile} style={{ width: '100%', height: '100%', borderRadius: '36px' }} />
                                    </Grid>
                                    <IoMdArrowDropdown style={{ color: '#e9f4ff', width: '16px', cursor: 'pointer' }} />

                                </Grid>
                            </Grid>
                            :
                            <Grid style={{ display: isMobile && 'flex', alignItems: 'center', justifyContent: isMobile && 'end', width: isMobile && '100%' }}>
                                <Button
                                    onClick={handleOpen}
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        padding: '0.75rem 2rem',
                                        fontSize: '.8rem',

                                        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
                      linear-gradient(94deg, rgb(118, 118, 245) 29.94%, rgb(90, 34, 161) 83.55%)`,
                                        border: '2px solid rgba(118, 118, 245, 0.5)',
                                        borderRadius: '12px',
                                        boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    Iniciar Sesión
                                </Button>

                            </Grid>
                        }
                    </Grid>

                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        style={{ top: '10%', zIndex: 9999 }}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                backgroundColor: 'rgba(28,30,48,.8)', // Fondo oscuro
                                color: '#ffffff',           // Texto claro
                                borderRadius: 2,
                                minWidth: 180,
                                boxShadow: '0 1px 2px 0 rgba(0,0,0,.25)',
                                border: '1px solid #333'
                            }
                        }}
                    >
                        {
                            (isValidUser) &&
                            <>
                                <MenuItem onClick={isLoggedIn && isValidUser ? redirectSolicitudes : handleOpen}>Solicitudes de tipeo</MenuItem>
                                <MenuItem onClick={isLoggedIn && isValidUser ? redirectCrearSolicitudes : handleOpen}>Crear Link de tipeo</MenuItem>
                                <MenuItem onClick={isLoggedIn && isValidUser ? redirectListadoLinks : handleOpen}>Listado de Links</MenuItem>
                                <MenuItem onClick={isLoggedIn && isValidUser ? toPanelSorteo : ''}>Lista de Sorteos</MenuItem>
                                <MenuItem onClick={isLoggedIn && isValidUser ? toPanel : ''}>Crear Sorteo</MenuItem>
                            </>
                        }

                        <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
                    </Menu>

                </Toolbar>
            </Grid >


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
            {loading && <Loader />}


            {!loading && props.children}



            <footer class="footer">
                <div class="footer-wrapper" >


                    <div class="footer-column">
                        <img src={logoDengue} style={{ borderRadius: '50%', width: isMobile ? '20%' : '15%' }} />

                        <div class="footer-copyrights">© Copyrights 2025 eldenguee.com</div>
                        <img src={gamble} alt="GambleAware logo" width="172" height="24" />
                    </div>





                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: !isMobile && 'wrap', width: isMobile ? '100%' : '10%', flexFlow: !isMobile && 'row wrap', gap: '10px', flexDirection: isMobile && 'row' }}>
                        <a href="" class="footer-column-icon" aria-label="Discord">
                            <FaDiscord style={{ color: '#1877F2', fontSize: 25 }} />

                        </a>
                        <a href="https://www.youtube.com/@dengueetimba" class="footer-column-icon" aria-label="YouTube">
                            <FaYoutube style={{ color: '#ff4e4e', fontSize: 25 }} />

                        </a>
                        <a href="" class="footer-column-icon" aria-label="Twitter">
                            <FaFacebookSquare style={{ color: '#1877F2', fontSize: 25 }} />

                        </a>
                        <a href="" class="footer-column-icon" aria-label="Instagram">
                            <FaInstagram style={{ fontSize: 25, color: 'white' }} />

                        </a>
                    </div>

                </div>

                <hr style={{ width: '85%' }}></hr>



                <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: isMobile ? '100%' : '85%', margin: '0 auto', padding: '10px', gap: '5%' }} >

                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '82px', background: 'hsla(0,0%,100%,.03)', padding: '16px 16px' }}>
                        <TbRating18Plus style={{ fontSize: isMobile ? 100 : 45 }} />
                        <Typography style={{ color: 'hsla(0,0%,100%,.5)', fontFamily: 'Outfit,sans-serif', textDecoration: 'none' }}>We do not take responsibility for any losses from gambling in casinos and betting sites which are linked or promoted on our website(s). As a player, you are responsible for your bets.</Typography>
                    </Grid>

                </Grid>
            </footer>

            {isMobile &&
                <Grid className="mobile-menu">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} className='itemMenu'>
                        <IoMdHome style={{ color: 'white' }} className='itemMenu' />

                        <Typography sx={{
                            background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            fontSize: 16,
                            fontFamily: 'Outfit,sans-serif'
                        }} className='itemMenu' >Home</Typography>

                    </Link>


                    <a onClick={() => setOpenModal(true)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} className='itemMenu'>
                        <PiRankingFill style={{ color: 'white' }} className='itemMenu' />

                        <Typography sx={{
                            background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            fontSize: 16,
                            fontFamily: 'Outfit,sans-serif'
                        }} >Rankings</Typography>

                    </a>



                    <a onClick={() => setOpenModal(true)} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} className='itemMenu'>
                        <FaBagShopping style={{ color: 'white' }} className='itemMenu' />

                        <Typography sx={{
                            background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            fontSize: 16,
                            fontFamily: 'Outfit,sans-serif'
                        }} >Shop</Typography>

                    </a>
                </Grid>
            }

            <Modal open={openModal} onClose={() => setOpenModal(false)} disableAutoFocus>
                <AnimatePresence>
                    {(openModal) && (
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
                                    <strong>{openModal && 'PROXIMAMENTE!'}</strong>
                                    {
                                        openModal &&
                                        <p>Estamos trabajando!</p>
                                    }
                                </div>
                                <button className="close-btn" onClick={() => {
                                    setOpenModal(false);

                                }}>×</button>
                            </div>
                            <div className={openModal ? "progress-bar" : "progress-bar-error"} style={{ width: `${progress}%` }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>
        </Grid >
    )
}

export default Nlayout