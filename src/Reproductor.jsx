import React, { useEffect, useState, useRef } from "react";

export default function Reproductor() {
  const [audioSrc, setAudioSrc] = useState(null);
  const [ultimoId, setUltimoId] = useState(null);
  const audioRef = useRef(null);

  const cargarAudio = async () => {
    try {
      const res = await fetch("https://backmu.vercel.app/solicitudes/audios");
      if (res.ok) {
        const data = await res.json();
        if (data.id !== ultimoId) {
          setAudioSrc(data.url);
          setUltimoId(data.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarAudio();
    const interval = setInterval(cargarAudio, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reproducir cuando cambie la URL
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("No se pudo reproducir automáticamente, esperando interacción del usuario");
        });
      }
    }
  }, [audioSrc]);

  return<iframe ref={audioRef}  src={audioSrc} allow="autoplay" style="display:none" id="iframeAudio">
</iframe>
  ;
}