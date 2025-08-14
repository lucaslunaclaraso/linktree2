import React, { useState, useRef, useEffect } from "react";
import Nlayout from "./Nlayout";
import { Button, Grid } from "@mui/material";
import { Alert, Box,  CircularProgress,  Link, Paper, Step, StepLabel, Stepper, TextField, Typography, styled } from '@mui/material'
import axios from 'axios'
import backgroundImg from './main_intro.jpg'

export default function Grabar(props) {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null); // ⬅ Guardamos el audio sin subirlo aún
    const [seconds, setSeconds] = useState(0);
    const [cargar, setCargar] = useState()
    const [solicitudes, setSolicitudes] = useState()
    const nombre = localStorage.getItem('kick_user')

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const intervalRef = useRef(null);
    const checkWinner = async () => {
        setCargar(true)
      
        const peticionTipeo = await axios.post(`https://backmu.vercel.app/solicitudes/tipeo`, { nombre })
        const soli = peticionTipeo?.data?.map((p) => p.audio)
        setSolicitudes(soli)
        
        setTimeout(() => {
            setCargar(false)
        }, 3000);

        setCargar(false)

    }
    useEffect(() => { checkWinner() }, [])

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            setAudioURL(url);
            setAudioBlob(blob); // ⬅ Guardamos el blob para subir después
        };

        mediaRecorderRef.current.start();
        setRecording(true);
        setSeconds(0);

        // Inicia contador
        intervalRef.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        // Límite de 15s
        setTimeout(() => {
            if (mediaRecorderRef.current.state === "recording") {
                stopRecording();
            }
        }, 15000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
        clearInterval(intervalRef.current);
    };
    const enviarAudio = async () => {
        if (!audioBlob) {
            alert("Primero graba un audio");
            return;
        }

        try {
            // 1️⃣ Subir a Cloudinary
            const formData = new FormData();
            formData.append("file", audioBlob);
            formData.append("upload_preset", "ml_default"); // tu upload_preset

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dks7seyl8/video/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error("Error al subir a Cloudinary");
            }

            const data = await res.json();
            const audioUrl = data.secure_url;

            // 2️⃣ Guardar la URL en tu backend
            const backendRes = await fetch("https://backmu.vercel.app/solicitudes/audios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: audioUrl, nombre:nombre }),
            });

            if (!backendRes.ok) {
                throw new Error("Error al guardar la URL en el backend");
            }

            alert("Audio enviado y guardado correctamente 🎉");
            setAudioBlob(null);
            setAudioURL(null);
            // 3️⃣ Recargar la página
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(error.message || "Error al enviar el audio");
        }
    };


    return (
        <Nlayout>


            <Grid style={{ background: '#11111d', marginTop: props.isMobile ? '-30%' : cargar && '-10%', width: '100%' }}>

                {
                    cargar ?
                        <Grid style={{
                            backgroundImage: `
                      linear-gradient(to bottom, rgba(63, 61, 69, 0.8), rgba(63, 61, 69, 0)),
                      url(${backgroundImg})
                      `,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            height: '980px',
                            backgroundColor: '#3f3d45',
                            margin: '0 auto',
                            position: 'relative',
                            backgroundPosition: '50%'
                        }}>
                            <Grid className='container' style={{
                                padding: 50,
                                gap: '10px',
                                justifyContent: 'center',

                            }}>
                                <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                    <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '32px', fontFamily: 'Outfit,sans-serif' }} >
                                        eldenguee.com
                                    </Typography>
                                    <Typography sx={{
                                        background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 'bold',
                                        fontSize: props.isMobile ? 32 : 65,
                                        fontFamily: 'Belerofonte'
                                    }} >Verificando..</Typography>
                                </Grid>

                                <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >

                                </Grid>
                            </Grid>
                        </Grid>

                        :

                        solicitudes < 1 ?

                            <Grid style={{
                                backgroundImage: `
        linear-gradient(to bottom, rgba(63, 61, 69, 0.8), rgba(63, 61, 69, 0)),
        url(${backgroundImg})
      `,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                height: '980px',
                                backgroundColor: '#3f3d45',
                                margin: '0 auto',
                                position: 'relative',
                                backgroundPosition: '50%'
                            }}>
                                <Grid className='container' style={{
                                    padding: 50,
                                    gap: '10px',
                                    justifyContent: 'center',

                                }}>
                                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                        <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '32px', fontFamily: 'Outfit,sans-serif', textAlign: 'center' }} >
                                            No estás habilitado para enviar audio, lo tienes que canjear en el shop!

                                        </Typography>
                                        <Typography sx={{
                                            background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold',
                                            fontSize: props.isMobile ? 32 : 50,
                                            fontFamily: 'Belerofonte'
                                        }} >Eldenguee.com</Typography>
                                    </Grid>

                                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >


                                        <Button

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
                                            href='/'
                                        >
                                            Volver al inicio
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            :
                            <Grid
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "15px",
                                    width: "50%",
                                    margin: "0 auto",
                                    padding: "8%",
                                }}
                            >
                                {!recording ? (
                                    <Button variant="outlined" onClick={startRecording}>
                                        🎙️ Grabar (máx 15s)
                                    </Button>
                                ) : (
                                    <Button variant="outlined" onClick={stopRecording}>
                                        ⏹️ Detener ({seconds}s)
                                    </Button>
                                )}

                                {audioURL && <audio controls src={audioURL}></audio>}

                                <Button variant="outlined" onClick={enviarAudio}>
                                    Enviar
                                </Button>
                            </Grid>
                }
            </Grid>
        </Nlayout>
    );
}
