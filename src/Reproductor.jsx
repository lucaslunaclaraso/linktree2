import React, { useEffect, useState, useRef } from "react";
import "./Reproductor.css";

export default function Reproductor() {
  const [audioSrc, setAudioSrc] = useState(null);
  const [ultimoId, setUltimoId] = useState(null);
  const audioRef = useRef(null);
  const [showBubble, setShowBubble] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // 🔊 Estado de reproducción

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

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      setShowBubble(true);
      setTimeout(() => {
        audioRef.current.src = audioSrc;
        audioRef.current.muted = false;
        audioRef.current.play().catch((err) => {
          console.log("Error al reproducir:", err);
        });
      }, 1000);
    }
  }, [audioSrc]);

  // Escuchar eventos de audio para la animación
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div>
      {showBubble && (
        <div className="whatsapp-bubble">
          <div className="audio-icon">▶️</div>
          <audio ref={audioRef} autoPlay muted />
          <div className={`wave ${isPlaying ? "active" : ""}`}>
            <span></span><span></span><span></span>
          </div>
        </div>
      )}
    </div>
  );
}
