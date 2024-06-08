import React, { useEffect, useState } from 'react';
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialYoutube } from "react-icons/ti";
import { BsTwitch } from "react-icons/bs";
import casino from './1win.png';
import instrucciones from './instrucciones.gif';
import mp from './mp.webp';
import cripto from './crypto.webp'
import astro from './astro.webp'
import axios from 'axios'


// Componente para representar un enlace individual

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
    <div className="link-item">
      {isImage ?
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => nuevoClick()} style={{ width: '10%' }}>
          <img src={gif ? instrucciones : casino} alt style={{ width: gif ? '100%' : '35%' }} />
        </a>

        :
        <>
          {parrafo ? <p > <span style={{cursor:'pointer'}} onClick={() => copyToClipboard()}> {title} </span> <br /> <span style={{ fontSize: '12px', color: 'grey' }}>+500% de bonus en los primeros 4 depósitos</span> <br /> <span style={{ fontSize: '12px', color: 'grey' }}>+30% de rakeback semanal</span></p> : title}
        </>

      }
    </div>
  );
};

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
const Home = () => {



  const links = [
    { url: 'https://1win.lat/?open=register#p2g0', isImage: true },
    { title: 'Código: dengue1win', url: '', parrafo: true },
    { isImage: true, url: '', gif: true },
    // Agrega más enlaces según sea necesario
  ];

  return (
    <div className="app">
      <img src={'https://yt3.ggpht.com/xfC9kFjSXQfQqJizTG-_HxE-BnuuQbfbWypn-zLDkFCdgd-NlHG-w2BuKTurVRNaorb5E9d8=s600-c-k-c0x00ffffff-no-rj-rp-mo'} style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto' }}></img>
      <h3 style={{ textAlign: 'center', color: 'white', fontStyle: 'italic' }}>eldenguee</h3>
      <LinkTree links={links} />
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginTop: '15PX' }}>
        <a href="https://www.instagram.com/eldengueee/" style={{ textDecoration: 'none' }}><SlSocialInstagram style={{ color: 'white' }} /></a>
        <a href="https://www.youtube.com/@dengueetimba" style={{ textDecoration: 'none' }}> <TiSocialYoutube style={{ color: 'white' }} /></a>
        <a href="https://www.twitch.tv/eldenguee" style={{ textDecoration: 'none' }}><BsTwitch style={{ color: 'white' }} /></a>
      </div> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginTop: '15PX' }}>
        <img src={mp} style={{ width: '20%' }} />
        <img src={cripto} style={{ width: '20%' }} />
        <img src={astro} style={{ width: '20%' }} />
      </div>
      <h4 style={{ color: 'white', textAlign: 'center' }}>Depósito Mínimo AR$2000</h4>
    </div>
  );
};

export default Home;