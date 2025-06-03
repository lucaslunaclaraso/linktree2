import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { AppBar, Box, Button, Menu, MenuItem, Modal, Stack, Toolbar, Typography } from '@mui/material';
import './Nlayout.css'
import { Link } from 'react-router-dom'
import { FaFacebook, FaKickstarterK } from 'react-icons/fa6';
import logo from './logo_intro2.png'
import logoDengue from './logoDengue.webp'

import { generatePKCE } from './api/pkce';

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
function Nlayout(props) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '591315836747826', // Replace with your App ID
                cookie: true,
                xfbml: true,
                version: 'v20.0',
            });
            window.FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }, []);
    const [user, setUser] = useState(null); // State to store user data (name, logged-in status)
    // useEffect(() => {
    //     // Check Facebook login status on component mount
    //     if (window.FB) {
    //         window.FB.getLoginStatus((response) => {
    //             if (response.status === 'connected') {
    //                 // User is logged in, fetch their data
    //                 fetchUserData();
    //             } else {
    //                 // User is not logged in, check localStorage for cached user data
    //                 const storedUser = localStorage.getItem('fbUser');
    //                 console.log('storedUser', storedUser)
    //                 if (storedUser) {
    //                     setUser(JSON.parse(storedUser));
    //                 }
    //             }
    //         });
    //     }
    // }, []);
    // const handleFacebookLogin = () => {
    //     if (user) {
    //         // If user is logged in, log them out
    //         window.FB.logout(() => {
    //             setUser(null);
    //             localStorage.removeItem('fbUser');
    //             localStorage.removeItem('fbAccessToken');
    //             console.log('User logged out');
    //         });
    //     } else {
    //         // Trigger Facebook login
    //         window.FB.login(
    //             (response) => {
    //                 if (response.authResponse) {
    //                     const accessToken = response.authResponse.accessToken;
    //                     console.log('Facebook Access Token:', accessToken);
    //                     // Fetch user data directly from Facebook
    //                     fetchUserData(accessToken);
    //                 } else {
    //                     console.log('User cancelled login or did not fully authorize.');
    //                 }
    //             },
    //             { scope: 'public_profile,email' } // Request necessary permissions
    //         );
    //     }
    // };

   
    const redirectUri = "/callback";
    const clientId = "01JW6K1RY4R70K7B6KSJ8GK5CV";
    const scope = "user"; // según lo que pediste

    // const loginWithKick = () => {
    //   const url = `https://id.kick.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    //   window.location.href = url;
    // };

    const loginWithKick = async () => {

        const { code_verifier, code_challenge } = await generatePKCE();
        localStorage.setItem('kick_code_verifier', code_verifier);

        const criptoRandom = crypto.randomUUID()
        console.log('criptoRandom', criptoRandom)
        console.log('code_challenge', code_challenge)
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: '01JW6K1RY4R70K7B6KSJ8GK5CV',
            redirect_uri: 'https://eldenguee.com/callback',
            scope: 'user:read',
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
            
            localStorage.setItem('kick_user', JSON.stringify(userData?.name)); // Guarda los datos del usuario
            
            setUser({ name: userData?.data[0]?.name });

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

    const toPanel = () => {
        window.location.href = "/panel"
    }
    const usuario = localStorage.getItem('fbUser')?.replaceAll('"', "");
    const [width, setWidth] = useState(window.innerWidth);

    const isMobile = width <= 768;

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    
    return (
        <Grid style={{ display: 'flex', flexDirection: 'column' }}>

            <Grid classname='header' style={{ background: 'transparent', zIndex: 9999, padding: 10 }}>
                <Toolbar style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography style={{ width: '50%' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img src={logoDengue} style={{ borderRadius: '50%', width: isMobile ? '50%' : '10%' }} />
                            {/* <Typography sx={{
                                background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                fontSize: 25,
                                fontFamily: 'Belerofonte'
                            }} >Eldenguee.com</Typography> */}

                        </Link>
                    </Typography>

                    <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px' }}>

                        {
                             ( user?.name || usuario === ('Lucas Luna' || 'Luis San Cristobal' || "lucaslunacl" || "eldenguee") )&&

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
                                href='/sorteos'
                            >
                                Sorteos
                            </Button>
                        }
                        {
                           ( user?.name || usuario === ('Lucas Luna' || 'Luis San Cristobal' || "lucaslunacl" || "eldenguee") )  &&

                            <Button
                                onClick={toPanel}
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
                        }

                        {user ?

                            <Typography sx={{
                                background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                fontSize: 18,
                                textAlign: 'end'
                            }} onClick={handleClick}>Hola {user?.name || usuario}!
                            </Typography>
                            :
                            <Button
                                onClick={handleOpen}
                                sx={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    padding: '0.75rem 2rem',
                                    fontSize: '.8rem',
                                    width: '100%',
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
                        }
                    </Grid>

                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                    </Menu>

                </Toolbar>
            </Grid>


            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>


                    <Stack spacing={2}>
                        {/* Facebook Login */}
                        {/* <Button
                            sx={{
                                ...buttonBase,
                                color: '#1877F2',
                                borderColor: '#1877F2',
                                '&:hover': {
                                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                                    boxShadow: '0 0 10px #1877F2',
                                },
                            }}
                            startIcon={<FaFacebook size={20} />}
                            onClick={handleFacebookLogin}
                        >
                            Iniciar Sesión con Facebook
                        </Button> */}

                        {/* Kick Login */}
                        <Button
                            sx={{
                                ...buttonBase,
                                color: '#00ff73',
                                borderColor: '#00ff73',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 115, 0.1)',
                                    boxShadow: '0 0 10px #00ff73',
                                },
                            }}
                            startIcon={<FaKickstarterK size={20} />}
                            onClick={loginWithKick}
                        >
                            Iniciar Sesión con Kick
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            {props.children}
        </Grid>
    )
}

export default Nlayout