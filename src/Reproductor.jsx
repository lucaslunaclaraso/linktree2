import React, { useEffect, useState, useRef } from "react";
import "./Reproductor.css";

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
        if (!mostrados.has(data.id)) {
          setAudios((prev) => [
            ...prev,
            { id: data.id, url: data.url, key: `${data.id}-${Date.now()}` },
          ]);
          setMostrados((prev) => new Set(prev).add(data.id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarAudio();
    const interval = setInterval(cargarAudio, 15000);
    return () => clearInterval(interval);
  }, [mostrados]);

  return (
    <div>
      {audios.map((audioItem) => (
        <AudioBubble
          key={audioItem.key}
          src={audioItem.url}
          onEnded={() =>
            setAudios((prev) => prev.filter((a) => a.key !== audioItem.key))
          }
        />
      ))}
    </div>
  );
}

function AudioBubble({ src, onEnded }) {
  const audioRef = useRef(null);
  const [showBubble, setShowBubble] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
      setIsPlaying(false);
      setShowBubble(false);
      onEnded();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  if (!showBubble) return null;

  return (
    <div className="whatsapp-bubble">
      {/* <div className="audio-icon">▶️</div> */}
      <audio ref={audioRef} autoPlay muted />
      {/* <div className={`wave ${isPlaying ? "active" : ""}`}>
        <span></span>
        <span></span>
        <span></span>
      </div> */}
    </div>
  );
}
