import React, { useEffect, useState } from "react";
import "./Reproductor.css";

export default function Reproductor() {
  const [audios, setAudios] = useState([]); // lista de audios pendientes
  const [mostrados, setMostrados] = useState(new Set()); // IDs ya mostrados

  const cargarAudio = async () => {
    try {
      const res = await fetch("https://backmu.vercel.app/solicitudes/audios", {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (!mostrados.has(data.id)) {
          // ID nuevo
          setAudios((prev) => [
            ...prev,
            { id: data.id, url: data.url, play: true, key: `${data.id}-${Date.now()}` },
          ]);
          setMostrados((prev) => new Set(prev).add(data.id));
        }
      } else if (res.status === 304) {
        const data = await res.json();
        if (!mostrados.has(data.id)) {
          setAudios((prev) => [
            ...prev,
            { id: data.id, url: data.url, play: false, key: `${data.id}-${Date.now()}` },
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
    const interval = setInterval(cargarAudio, 15000); // cada 15s
    return () => clearInterval(interval);
  }, [mostrados]);

  return (
    <div>
      {audios.map((audioItem) => (
        <AudioBubble
          key={audioItem.key}
          src={audioItem.url}
          play={audioItem.play}
          onEnded={() =>
            setAudios((prev) => prev.filter((a) => a.key !== audioItem.key))
          }
        />
      ))}
    </div>
  );
}

function AudioBubble({ src, play, onEnded }) {
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showBubble, setShowBubble] = React.useState(false);
  console.log('play', play)
  console.log('src', src)
  useEffect(() => {
    setShowBubble(true);
    if (play) {
      const timeout = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.muted = true; // autoplay permitido
          console.log('audioRef.current.muted', audioRef.current.muted)
          audioRef.current.play().catch(console.error);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [src, play]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => {
      setIsPlaying(true);
      audioRef.current.muted = false;
    }
    const onPause = () => setIsPlaying(false);
    const onAudioEnded = () => {
      setIsPlaying(false);
      setShowBubble(false);
      onEnded();
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onAudioEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onAudioEnded);
    };
  }, [onEnded]);

  if (!showBubble) return null;

  return (
    <div className="whatsapp-bubble">
      <div className="audio-icon">▶️</div>
      <audio ref={audioRef} autoPlay muted={isPlaying ? false : true} src={src} />
      <div className={`wave ${isPlaying ? "active" : ""}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
