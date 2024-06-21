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
import './home.css'
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
    <div className="link-item" style={{ textAlign: 'center', margin: '20px 0', backgroundColor: parrafo && 'transparent' }}>
      {isImage ?
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => nuevoClick()} style={{ display: 'block', margin: '0 auto' }}>
          <img src={gif ? instrucciones : casino} alt="" style={{ width: gif ? '100%' : '35%' }} />
        </a>

        :
        <>
          {parrafo ? <div style={{display:'flex', flexDirection:'column'}}>  <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}> BONIFICACIÓN </p>
            <p className='bonificacion' style={{ fontSize:'2.5rem', position:'absolute',color: '#df003f', textShadow: '-2px -3px 0 #fff,4px -3px 0 #fff,-3px 3px 0 #fff,3px 3px 0 #fff,3px 3px 0 #fff', fontWeight:600 }}>+500%</p> </div> : title}
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
    { title: 'BONIFICACIÓN +500%', url: '', parrafo: true },
    { url: 'https://1wfsi.com/v3/aggressive-casino', isImage: true },
    { isImage: true, url: '', gif: true },
    // Agrega más enlaces según sea necesario
  ];

  return (
    <div className="app" style={{ backgroundColor: 'black', padding: '20px', borderRadius: '10px' }}>
      <img src={'https://yt3.ggpht.com/xfC9kFjSXQfQqJizTG-_HxE-BnuuQbfbWypn-zLDkFCdgd-NlHG-w2BuKTurVRNaorb5E9d8=s600-c-k-c0x00ffffff-no-rj-rp-mo'} style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto' }} alt="profile"></img>
      <h3 style={{ textAlign: 'center', color: 'white', fontStyle: 'italic' }}>eldenguee</h3>
      <LinkTree links={links} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginTop: '15px' }}>
        <img src={mp} style={{ width: '20%' }} alt="mercado pago" />
        <img src={cripto} style={{ width: '20%' }} alt="crypto" />
        <img src={astro} style={{ width: '20%' }} alt="astropay" />
      </div>
      <h4 style={{ color: 'white', textAlign: 'center' }}>Depósito Mínimo AR$2000</h4>
    </div>
  );
};

export default Home;
