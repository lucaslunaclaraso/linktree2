import React, { useEffect, useState, useRef } from 'react';
import Nlayout from './Nlayout';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import dengue from './dengue.png'; // tu imagen de perfil

function ListadoAudios() {
    const [audios, setAudios] = useState()
    const [currentAudio, setCurrentAudio] = useState(null);
    const audioRefs = useRef({});
    const obtenerAudios = async () => {
        const peticion = await axios.get('https://backmu.vercel.app/solicitudes/listaaudios')

        setAudios(peticion?.data)
    }
    useEffect(() => {
        obtenerAudios();
    }, []);


    const togglePlay = (id) => {
        const audio = audioRefs.current[id];

        if (!audio) return;

        // Si está sonando, pausar
        if (currentAudio === id && !audio.paused) {
            audio.pause();
            setCurrentAudio(null);
        } else {
            // Pausar todos antes
            Object.values(audioRefs.current).forEach((a) => {
                a.pause();
                a.currentTime = 0;
            });
            audio.play();
            setCurrentAudio(id);
        }
    };
    return (
        <Nlayout>
            <Box
                sx={{
                    maxHeight: '600px',
                    width: '50%',
                    padding: '15px',
                    margin: '0 auto',
                    overflowY: 'auto',
                    pr: 1
                }}
            >
                {audios?.map((audios) => (
                    <Card key={audios.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <div className="whatsapp-bubble" style={{ marginTop: '10px', width: '90%' }}>
                                <div className="profile-pic">
                                    <img src={dengue} alt="perfil" />
                                </div>

                                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                                    <Typography>{audios.nombre}</Typography>
                                    <div className="audio-wrapper" style={{flexDirection:'row',alignItems:'center'}}>

                                        <div
                                            className="play-btn"
                                            onClick={() => togglePlay(audios.id)}
                                        >
                                            {currentAudio === audios.id ? '⏸' : '▶'}
                                        </div>
                                        <div className={`wave ${currentAudio === audios.id ? 'active' : ''}`}>
                                            {Array.from({ length: 18 }).map((_, i) => (
                                                <span key={i}></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <audio
                                    ref={(el) => (audioRefs.current[audios.id] = el)}
                                    src={audios.url}
                                    onEnded={() => setCurrentAudio(null)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </Box>


        </Nlayout>

    )
}

export default ListadoAudios