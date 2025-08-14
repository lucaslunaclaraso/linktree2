import React, { useEffect, useState, useRef } from "react";
import "./Reproductor.css"; // ⬅ Importa los estilos

export default function Reproductor() {
  const [audioSrc, setAudioSrc] = useState(null);
  const [ultimoId, setUltimoId] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef(null);
  const [showBubble, setShowBubble] = useState(false); // animación

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

  const enableAudio = () => {
    if (audioRef.current) {
      audioRef.current.muted = true;
      audioRef.current.play().catch(() => {});
      setEnabled(true);
    }
    setEnabled(true);

  };

  useEffect(() => {
    if (!enabled) return;
    cargarAudio();
    const interval = setInterval(cargarAudio, 5000);
    return () => clearInterval(interval);
  }, [enabled]);

  useEffect(() => {
    if (enabled && audioSrc && audioRef.current) {
      setShowBubble(true); // mostrar burbuja animada

      setTimeout(() => {
        audioRef.current.src = audioSrc;
        audioRef.current.muted = false;
        audioRef.current.play().catch((err) => {
          console.log("Error al reproducir:", err);
        });
      }, 1000); // ⏳ delay de 1s antes de reproducir
    }
  }, [audioSrc, enabled]);

  return (
    <div>
      {!enabled && (
        <button onClick={enableAudio}>🔊 Activar audio</button>
      )}

      {showBubble && (
        <div className="whatsapp-bubble">
          <div className="audio-icon">▶️</div>
          <audio ref={audioRef} autoPlay />
          <div className="wave">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}
    </div>
  );
}
