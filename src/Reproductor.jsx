import React, { useEffect, useState, useRef } from "react";
import "./Reproductor.css";
import dengue from './dengue.png'
import { Typography } from "@mui/material";
export default function Reproductor() {
  const [audios, setAudios] = useState([]);
  const [mostrados, setMostrados] = useState(new Set());

  // Cargar audios
  const cargarAudio = async () => {
    try {
      const res = await fetch("https://backmu.vercel.app/solicitudes/audios", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
  
        setAudios((prev) => {
          // si ya existe este audio en el estado, no lo agrego
          if (prev.some((a) => a.id === data.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: data.id,
              url: data.url,
              key: `${data.id}-${Date.now()}`,
              nombre: data.nombre,
            },
          ];
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarAudio();
    const interval = setInterval(cargarAudio, 20000);
    return () => clearInterval(interval);
  }, [mostrados]);

  return (
    <div>
      {audios.map((audioItem) => (
        <AudioBubble key={audioItem.key}
          idKey={audioItem.key}
          src={audioItem.url}
          nombre={audioItem.nombre}
          onEnded={(idKey) => setAudios((prev) => prev.filter((a) => a.key !== idKey))} />
      ))}
    </div>
  );
}

function AudioBubble({ src, onEnded, nombre, idKey }) {
  const audioRef = useRef(null);
  const [showBubble, setShowBubble] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  // Mostrar burbuja y reproducir
  useEffect(() => {
    setShowBubble(true);
    const timeout = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.muted = true; // permite autoplay
      audio.src = src;

      audio.addEventListener(
        "canplaythrough",
        () => {
          audio.muted = false;
          audio.play().catch(console.error);
        },
        { once: true }
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [src]);

  // Eventos de audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      if (audio) audio.muted = false; // habilita sonido
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      console.log('entra')
      setIsPlaying(false);
      setShowBubble(false);
      onEnded(idKey);
    };

    const timeout = setTimeout(() => {
      setShowBubble(false)
      setIsPlaying(false);
      setMostrar(true)
    }, 16000);



    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      // clearTimeout(timeout);


    };
  }, [onEnded]);


  if (!showBubble) return null;

  return (


    <div className="whatsapp-bubble" style={{ display: mostrar && 'none' }}>

      <div className="profile-pic">
        <img src={dengue} alt="perfil" />
      </div>

      <div className="audio-wrapper">
        <Typography>{nombre}</Typography>
        {/* <div className="play-btn" onClick={handlePlay}>▶</div> */}
        <div className={`wave ${isPlaying ? "active" : ""}`}>
          <div className={`wave active`}>
            {Array.from({ length: 18 }).map((_, i) => <span key={i}></span>)}
          </div>
        </div>
      </div>

      <audio ref={audioRef} autoPlay muted />

    </div>

  );
}
