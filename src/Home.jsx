import React, { useEffect, useRef, useState } from 'react';
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialYoutube } from "react-icons/ti";
import { BsTwitch } from "react-icons/bs";
import casino from './1win.png';
import instrucciones from './instrucciones.gif';
import mp from './mp.webp';
import cripto from './crypto.webp'
import astro from './astro.webp'
import axios from 'axios'
import './home.css'
import Nlayout from './Nlayout';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import './Nlayout.css'
import { FaCopy, FaDiscord, FaGift, FaInstagram, FaPlay, FaYoutube } from "react-icons/fa6";
import logo from './logodengueweb.png'
import backgroundImg from './main_intro.jpg'
import logoStake from './stake-logo.png'
import youtube from './youtube.png'
import { SiKick } from "react-icons/si";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import { FaFacebookSquare } from "react-icons/fa";
import scroll from './scroll.svg'
import nube1 from './nube1.png'
import nube2 from './nube2.png'
import nube3 from './nube3.png'
import { PiMouseScrollThin } from 'react-icons/pi';
import back from './leaderboard_card_bg.svg'

import globet from './goblet.png'
import dice from './dice.svg'
import bomb from './bomb.png'
import roulette from './roulette.svg'
import reward from './rewards.png'
const LinkItem = ({ parrafo, title, url, imagen, isImage, gif }) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(title)
      .then(() => {
        alert('Texto copiado al portapapeles: ' + title);
      })
      .catch(err => {
        console.error('Error al copiar el texto: ', err);
      });
  };
  const nuevoClick = async () => {
    const response = await axios.post('https://apidengue.vercel.app/')
  }

  return (
    <div className="link-item" style={{ textAlign: 'center', margin: '20px 0', backgroundColor: parrafo && 'transparent' }}>
      {isImage ?
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => nuevoClick()} style={{ display: 'block', margin: '0 auto' }}>
          <img src={gif ? instrucciones : casino} alt="" style={{ width: gif ? '100%' : '35%' }} />
        </a>

        :
        <>
          {parrafo ? <div style={{ display: 'flex', flexDirection: 'column' }}>  <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}> BONIFICACIÓN </p>
            <p className='bonificacion' style={{ fontSize: '2.5rem', position: 'absolute', color: '#df003f', textShadow: '-2px -3px 0 #fff,4px -3px 0 #fff,-3px 3px 0 #fff,3px 3px 0 #fff,3px 3px 0 #fff', fontWeight: 600 }}>+500%</p> </div> : title}
        </>

      }
    </div>
  );
};
const usuarioKick = localStorage.getItem('kick_user')
const isLoggedIn = usuarioKick;

// Componente principal para representar la estructura de Linktree
const LinkTree = ({ links }) => {
  return (
    <div className="link-tree">
      {links.map((link, index) => (
        <LinkItem key={index} title={link.title} url={link.url} imagen={link.imagen} isImage={link.isImage} gif={link.gif} parrafo={link.parrafo} />
      ))}
    </div>
  );
};

// Ejemplo de uso del componente LinkTree
const Home = (props) => {
  const links = [
    { title: 'BONIFICACIÓN +500%', url: '', parrafo: true },
    { url: 'https://1wfsi.com/v3/aggressive-casino', isImage: true },
    { isImage: true, url: '', gif: true },
    // Agrega más enlaces según sea necesario
  ];

  const videos = [
    { id: 'https://www.youtube.com/watch?v=YmfVcnZv_9s&ab_channel=dengueetimba', title: 'BOMBAZO EN LA STARLIGHT 1000, WANTED Y JAWSOME🤑', img: 'YmfVcnZv_9s' },
    { id: 'https://www.youtube.com/watch?v=8CAWnDTVYqo&ab_channel=dengueetimba', title: 'GANE 23 MILLONES!! 🤑 SACO MAX WIN EN NO LIMIT 🤯 BONOS DE $1000000 💸', img: '8CAWnDTVYqo' },
    { id: 'https://www.youtube.com/watch?v=WzxSV4Ktmg4&ab_channel=dengueetimba', title: 'CONEXIONES INSANAS EN NUEVA MÁQUINA!', img: 'WzxSV4Ktmg4' },
    { id: 'https://www.youtube.com/watch?v=VNDGtOG2XbE&ab_channel=dengueetimba', title: 'PAGOS INSANOS EN DOG HOUSE, BIG BASS Y HOT FIESTA😎🍀', img: 'VNDGtOG2XbE' },

  ];
  const handleScroll = () => {
    const target = document.querySelector("#menu2");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    // Oculta el foco cuando el mouse sale del área
    setMousePos({ x: -100, y: -100 });
  };


  return (
    <Nlayout>
      <Grid style={{ background: '#11111d', marginTop: props.isMobile ? '-35%' : '-10%', width: '100%' }}>
        <Grid style={{

          backgroundRepeat: 'no-repeat',
          height: '750px',
          backgroundColor: '#3f3d45',
          margin: '0 auto',
          position: 'relative',

        }} className='fondo'>
          <Grid className='container' style={{
            padding: 50,
            gap: '10px',
            justifyContent: 'center',
            marginTop: '50px'
          }}>


            <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, marginTop: '5%' }}>
              <img src={logo} style={{width: props.isMobile ? '100%' : '45%'}} />
              <Grid style={{ zIndex: 1, width: '100%' }}>
                <img src={globet} className='vip-rewards-rewards-imgs-goblet' />
                <img src={dice} className='vip-rewards-rewards-imgs-dice' />
                <img src={bomb} className='vip-rewards-rewards-imgs-bomb' />
                <img src={roulette} className='vip-rewards-rewards-imgs-roulette' />
              </Grid>
            </Grid>


            <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px', }} >
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
                <SiKick style={{ color: 'white' }} />
                <Typography style={{ color: 'white', fontFamily: 'Outfit,sans-serif' }}>Seguir en Kick</Typography>
              </Button>

              {/* <Button

                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '0.75rem 2rem',
                  fontSize: '.8rem',
                  fontFamily: 'Outfit,sans-serif',
                  backgroundImage: `linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)`,
                  border: '2px solid #e0c060',
                  borderRadius: '100px',
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
                Solicitar Tipeo
              </Button> */}
            </Grid>

            <div class="intro-scroll-wrapper tablet-max-hide" >
              <PiMouseScrollThin style={{ zIndex: 1, cursor: 'pointer', position: 'relative', height: '65px', color: 'white', fontSize: 45 }} onClick={handleScroll} />


            </div>
          </Grid>
        </Grid>


        <Grid style={{ display: 'flex', flexDirection: 'column' }} className="backgroundAnimado" onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave} >
          <div
            className="glow-effect"
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
          />
          <Grid style={{ width: '100%', position: 'relative' }} >



            <Grid className={!props.isMobile && 'container'} style={{ padding: !props.isMobile && 50, gap: '10px', position: 'relative', marginTop: props.isMobile && 25 }} id='menu2'>

              <Box style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: props.isMobile ? 16 : 36,
                position: 'relative',  // paso 3 (opcional pero recomendable)

              }} className='join-plate-inner'>

                <Grid style={{ display: 'flex', alignItems: 'center', flexWrap: props.isMobile && 'wrap', justifyContent: props.isMobile && 'center', gap: props.isMobile && 15 }}>


                  <Typography style={{ display: 'flex', alignItems: 'center', gap: '5px' }} >Usa el código <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px', background: 'hsla(0,0%,85%,.05)', padding: 10, borderRadius: 5, fontWeight: 900 }}>
                    ELDENGUEE</span> en </Typography>
                  <img src={logoStake} style={{ width: '10%' }} />

                  <Typography> para unirte a la comunidad!</Typography>
                </Grid>

                <Button style={{ background: 'linear-gradient(0deg,rgba(0,0,0,.4),rgba(0,0,0,.4)),linear-gradient(94deg,#7676f5 29.94%,#5a22a1 83.55%)', color: 'white', padding: 15, borderRadius: '100px', width: props.isMobile ? '100%' : '30%' }} className='botonCod'>USAR CODIGO</Button>
              </Box>
            </Grid>
          </Grid>

          <Grid style={{ padding: 50, gap: '10px' }} >

            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, width: '100%', flexDirection: 'column', gap: 10 }} >

              <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <FaGift style={{ color: 'ffe77c' }} />
                <Typography sx={{
                  background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: props.isMobile ? 24 : 45,
                  fontFamily: 'PoetsenOne'
                }} >Total de premios</Typography>
              </Grid>

              <Box style={{ border: '1px solid #ffca41', borderRadius: '200px', padding: '8px', width: 'fit-content' }}>

                <Grid style={{ border: '1px solid #34375f', borderRadius: '200px', background: 'linear-gradient(96deg,transparent 34.16%,rgba(105,105,230,.2) 115.52%),linear-gradient(58deg,rgba(19,21,31,.75) -41.21%,rgba(39,43,65,.75) 161.22%)', padding: '40px  72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  <Typography sx={{
                    background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: props.isMobile ? 24 : 60
                  }}>$</Typography>
                  <Typography sx={{
                    fontWeight: 'bold',
                    fontSize: props.isMobile ? 24 : 72,
                    color: 'white',
                    fontFamily: 'PoetsenOne'
                  }}>0</Typography>

                </Grid>

              </Box>

            </Box>
          </Grid>
        </Grid>

        <Grid className={!props.isMobile && 'container'} style={{ padding: 50, gap: '10px', display: 'flex', flexDirection: 'column' }}>

          <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <img src={youtube} style={{ width: '15%' }} />
            <Typography sx={{
              background: 'linear-gradient(94deg, #ff1b1b -73.57%, #e01c1c 35.09%, #ff594f 46.56%, #c21010 62.81%, #ff4e4e 122.18%);',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: props.isMobile ? 32 : 60,
              fontFamily: 'PoetsenOne'
            }}>Últimos</Typography>

            <Typography sx={{
              background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: props.isMobile ? 28 : 60,
              fontFamily: 'PoetsenOne'
            }}>Vídeos</Typography>

          </Grid>


          <Grid style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexWrap: props.isMobile && 'wrap' }}>


            {videos.map((video, index) => (

              <Grid>
                <a href={video.id} target="_blank" rel="noopener noreferrer" >
                  <img
                    src={`https://img.youtube.com/vi/${video.img}/maxresdefault.jpg`}
                    alt={video.title}
                    style={{ width: '100%', borderRadius: '10px' }}
                    className="hover-scale shiny-hover"
                  />
                </a>
                <p style={{ color: 'white' }}>{video.title}</p>
              </Grid>

            ))}


          </Grid>





          <Box style={{ border: '1px solid #830000', borderRadius: '200px', padding: '8px', width: 'fit-content', marginTop: '3%', margin: props.isMobile && '0 auto' }} className="pulse">
            <Link to="https://youtube.com/@dengueetimba?si=GzrKmlCiEecUFH54" style={{ textDecoration: 'none' }}>
              <Grid style={{ border: '1px solid #34375f', borderRadius: '200px', background: 'linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),linear-gradient(122deg,#670000 -24.73%,red 53.1%,#830000 121.81%)', padding: '5px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '10px' }}  >


                <FaPlay style={{ color: 'white', }} />
                <Typography sx={{
                  fontSize: 16,
                  color: 'white',
                  fontFamily: 'Outfit,sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>Ver Ahora</Typography>
              </Grid>
            </Link>

          </Box>



        </Grid>



        <Grid className={!props.isMobile && 'container'} style={{ padding: props.isMobile ? 25 : 50, gap: '35px', display: 'flex', flexDirection: 'column' }}>

          <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>

            <Typography sx={{
              background: 'linear-gradient(96deg,#7676f5 61.81%,#5a22a1 99.52%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: props.isMobile ? 32 : 60,
              fontFamily: 'PoetsenOne'
            }}>Unite</Typography>
            <Typography sx={{
              background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: props.isMobile ? 28 : 60,
              fontFamily: 'PoetsenOne'
            }}> a la comunidad!</Typography>
          </Grid>

          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: '2%', rowGap: '30px', flexDirection: props.isMobile && 'column' }} >

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: 10, border: '1px solid #00ff73', width: props.isMobile ? '85%' : '30%', borderRadius: 10, boxShadow: '0 0 5px #00ff73', }}>
              <SiKick style={{ color: '#00ff73', fontSize: 35 }} />
              <Typography style={{ color: 'white', fontWeight: 800, fontFamily: 'PoetsenOne' }}>Kick</Typography>


              <Button
                sx={{
                  background: 'linear-gradient(180deg,#00ff73 -31.86%,#00ff13 132.28%)',
                  color: 'black',
                  transformStyle: 'preserve-3d',
                  padding: '0 15px'

                }} href="https://kick.com/eldenguee" target='_blank'>Seguir</Button>

            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: 10, border: '1px solid #ff4e4e', width: props.isMobile ? '85%' : '30%', borderRadius: 10, boxShadow: '0 0 5px #ff4e4e' }}>
              <FaYoutube style={{ color: '#ff4e4e', fontSize: 35 }} />
              <Typography style={{ color: 'white', fontWeight: 800, fontFamily: 'PoetsenOne' }}>Youtube</Typography>

              <Button sx={{
                background: 'linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),linear-gradient(122deg,#670000 -24.73%,red 53.1%,#830000 121.81%)',
                color: 'white',

                transformStyle: 'preserve-3d',
                padding: '0 15px'

              }} href="https://youtube.com/@dengueetimba?si=GzrKmlCiEecUFH54" target='_blank'>Seguir</Button>

            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: 10, border: '1px solid #1877F2', width: props.isMobile ? '85%' : '30%', borderRadius: 10, boxShadow: '0 0 5px #1877F2' }}>
              <FaDiscord style={{ color: '#1877F2', fontSize: 35 }} />
              <Typography style={{ color: 'white', fontWeight: 800, fontFamily: 'PoetsenOne' }}>Discord</Typography>

              <Button
                sx={{
                  background: 'linear-gradient(180deg,#1877F2 -31.86%,#1877F4 132.28%)',
                  color: 'white',
                  transformStyle: 'preserve-3d',
                  padding: '0 15px'

                }}
              >Unirse</Button>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: 10, border: '1px solid #1877F2', width: props.isMobile ? '85%' : '30%', borderRadius: 10, boxShadow: '0 0 5px #1877F2' }}>
              <FaFacebookSquare style={{ color: '#1877F2', fontSize: 35 }} />
              <Typography style={{ color: 'white', fontWeight: 800, fontFamily: 'PoetsenOne' }}>Facebook</Typography>



              <Button
                sx={{
                  background: 'linear-gradient(180deg,#1877F2 -31.86%,#1877F2 132.28%)',
                  color: 'white',
                  transformStyle: 'preserve-3d',
                  padding: '0 15px'

                }}
                href="https://www.facebook.com/share/g/16GuSgTj4T/?mibextid=wwXIfr" target='_blank'>
                Unirse
              </Button>

            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: 10, border: '1px solid #a8a6af', width: props.isMobile ? '85%' : '30%', borderRadius: 10, boxShadow: '0 0 5px #a8a6af' }}>
              <img src={logoStake} style={{ width: '18%' }} />
              <Typography style={{ color: 'white', fontWeight: 800, fontFamily: 'PoetsenOne' }}>Stake</Typography>
              <Button
                sx={{
                  background: 'linear-gradient(180deg,#a8a6af -31.86%,#a8a6af 132.28%)',
                  color: 'black',
                  transformStyle: 'preserve-3d',
                  padding: '0 15px'

                }}

              >Jugar</Button>
            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: 10, border: '1px solid #a8a6af', width: props.isMobile ? '85%' : '30%', borderRadius: 10, boxShadow: '0 0 5px #a8a6af' }}>
              <FaInstagram style={{ fontSize: 35, color: 'white' }} />


              <Typography style={{ color: 'white', fontWeight: 800, fontFamily: 'PoetsenOne' }}>Instagram</Typography>
              <Button sx={{
                background: 'linear-gradient(180deg,#a8a6af -31.86%,#a8a6af 132.28%)',
                color: 'black',
                transformStyle: 'preserve-3d',
                padding: '0 15px'

              }}>Seguir</Button>
            </Box>
          </Grid>

        </Grid>
      </Grid>
    </Nlayout >
  );
};

export default Home;
