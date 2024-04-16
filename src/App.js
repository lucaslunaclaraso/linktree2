import React from 'react';
import './App.css'
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialYoutube } from "react-icons/ti";
import { BsTwitch } from "react-icons/bs";
import casino from './1win.png'
// Componente para representar un enlace individual
const LinkItem = ({ title, url, imagen, isImage }) => {
  console.log(isImage)
  return (
    <div className="link-item">
      {isImage ? 
        <a href={url} target="_blank" rel="noopener noreferrer" style={{width:'10%'}}>
          <img src={casino} alt style={{width:'50%'}} />
        </a>
    
    :
        <a href={url} target="_blank" rel="noopener noreferrer"> {title}</a>

      }
    </div>
  );
};

// Componente principal para representar la estructura de Linktree
const LinkTree = ({ links }) => {
  return (
    <div className="link-tree">
      {links.map((link, index) => (
        <LinkItem key={index} title={link.title} url={link.url}  isImage={link.isImage}/>
      ))}
    </div>
  );
};

// Ejemplo de uso del componente LinkTree
const App = () => {
  const links = [
    { url: 'https://1win.lat/?open=register#p2g0', isImage: true },
    { title: 'Código: dengue1win', url: '' },
    { title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", url: '' },
    // Agrega más enlaces según sea necesario
  ];

  return (
    <div className="app">
      <img src={'https://yt3.ggpht.com/xfC9kFjSXQfQqJizTG-_HxE-BnuuQbfbWypn-zLDkFCdgd-NlHG-w2BuKTurVRNaorb5E9d8=s600-c-k-c0x00ffffff-no-rj-rp-mo'} style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto' }}></img>
      <h3 style={{ textAlign: 'center', color: 'white', fontStyle: 'italic' }}>eldenguee</h3>
      <LinkTree links={links} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginTop: '15PX' }}>
        <a href="https://www.instagram.com/eldengueee/" style={{ textDecoration: 'none' }}><SlSocialInstagram style={{ color: 'white' }} /></a>
        <a href="https://www.youtube.com/@dengueetimba" style={{ textDecoration: 'none' }}> <TiSocialYoutube style={{ color: 'white' }} /></a>
        <a href="https://www.twitch.tv/eldenguee" style={{ textDecoration: 'none' }}><BsTwitch style={{ color: 'white' }} /></a>
      </div>
    </div>
  );
};

export default App;