import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nlayout from './Nlayout';
import { Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent, Grid } from '@mui/material';
import SlotModal from './SlotModal';

function Torneo(props) {
    const [torneo, setTorneo] = useState();
    const [participantes, setParticipantes] = useState([]);
    const [rondas, setRondas] = useState([]); // llaves dinámicas
    const [modalAbierto, setModalAbierto] = useState(false);
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

    const { url } = useParams();
    const usuarioOBt = localStorage.getItem('kick_user');
    const esAdmin = usuarioOBt === 'lucaslunacl' || usuarioOBt === 'eldenguee';
    const abrirModal = (jugador) => {
        setJugadorSeleccionado(jugador);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setJugadorSeleccionado(null);
        setModalAbierto(false);
    };

   

    // Obtener torneo y jugadores
    const obtenerTorneo = async () => {
        try {
            const res = await axios.get(`https://backmu.vercel.app/torneo/${url}`);
            setTorneo(res.data.torneo);
            setParticipantes(res.data.jugadores || []);

            // Si el torneo ya tiene cruces, traer la primera ronda
            if (res.data.torneo?.id) {
                const rondasRes = await axios.get(`https://backmu.vercel.app/torneo/${res.data.torneo.id}/todas-rondas`);
                if (rondasRes.data?.length) {
                    setRondas(rondasRes.data);
                }
            }
        } catch (err) {
            console.error("Error al obtener torneo:", err);
        }
    };

    useEffect(() => {
        obtenerTorneo(); // Traer al cargar por primera vez

        const interval = setInterval(() => {
            obtenerTorneo(); // Traer cada 45 segundos
        }, 45000);

        return () => clearInterval(interval); // Limpiar al desmontar
    }, [url]);


    const guardarSlot = async (slot) => {
        try {
            // Usamos usuarioOBt directamente
            await axios.patch(
                `https://backmu.vercel.app/torneo/${torneo.id}/jugadores/${usuarioOBt}/slot`,
                { slot }
            );

            // Actualizamos localmente el slot del usuario actual
            setParticipantes(prev => prev.map(j =>
                j.user_name === usuarioOBt ? { ...j, slot } : j
            ));

            cerrarModal();
        } catch (err) {
            alert("Error al guardar slot");
        }
    };
    // Unirse al torneo
    const unirseAlTorneo = async () => {
        if (!usuarioOBt) {
            alert("Debes iniciar sesión para participar.");
            return;
        }
        try {
            const res = await axios.post(`https://backmu.vercel.app/torneo/${torneo.id}/unirse`, { userName: usuarioOBt });
            alert(res.data.message);
            obtenerTorneo();
        } catch (err) {
            alert(err.response?.data?.error ? 'Hubo un error o torneo lleno.' : "Error al intentar unirse.");
        }
    };

    // Empezar torneo (crear cruces)
    const empezarTorneo = async () => {
        try {
            const res = await axios.post(`https://backmu.vercel.app/torneo/${torneo.id}/empezar`);
            if (res.data?.cruces?.length) {
                setRondas([{ ronda: 1, partidos: res.data.cruces }]);
            }
        } catch (err) {
            alert("Error al generar llaves");
        }
    };

    // Seleccionar ganador
    const seleccionarGanador = async ( partidoIndex, partidoId,ganador) => {
        if (!esAdmin) return;
        try {
            // Avisar al backend del ganador
            await axios.post(`https://backmu.vercel.app/torneo/${torneo.id}/partidos/${partidoId}/ganador`, { ganador });

            // Traer todas las rondas actuales del torneo
            const res = await axios.get(`https://backmu.vercel.app/torneo/${torneo.id}/todas-rondas`);

            // Respuesta: [{ronda: 1, partidos: [...]}, {ronda: 2, partidos: [...]} ...]
            setRondas(res.data || []);

        } catch (err) {
            alert("Error al actualizar ganador");
        }
    };
    const slotsHacksaw = [
        "Cursed Seas", "Fear the Dark", "Stormforged", "Keep 'em Cool", "Magic Piggy",
        "Bloodthirst", "Frank's Farm", "Rotten", "Miami Mayhem", "The Bowery Boys",
        "Frutz", "Wanted Dead or a Wild", "Aztec Twist", "Buffalo Stack'N'Sync", "Harvest Wilds",
        "Warrior Ways", "Pug Life", "Gladiator Legends", "Rocket Reels"
    ];

    const slotsPragmatic = [
        "Gates of Olympus", "Sweet Bonanza", "Big Bass Splash", "Sugar Rush 1000", "Curse of the Werewolf Megaways",
        "The Dog House", "John Hunter and the Tomb of the Scarab Queen", "Fruit Party", "Wolf Gold", "Hot Safari",
        "3 Genie Wishes", "Peking Luck", "Queen of Atlantis", "5 Lions", "Buffalo King", "The Catfather",
        "Lucky Dragons", "Panther Queen", "8 Dragons", "Da Vinci's Treasure", "Sweet Bonanza Xmas",
        "Madame Destiny Megaways", "Starlight Princess", "Dwarven Gold", "7 Monkeys", "Spooky Fortune",
        "Gold Train", "Fairytale Fortune", "Dragon Hero", "Fury of Odin Megaways"
    ];

    const getSlotsPorTipo = () => {
        if (torneo?.tipo === "HackSaw") return slotsHacksaw;
        if (torneo?.tipo === "Pragmatic") return slotsPragmatic;
        return [...slotsHacksaw, ...slotsPragmatic]; // todo
    };
    const usuario = participantes.find(
        p => p.user_name.toLowerCase() === usuarioOBt.toLowerCase()
    );
    const botonDisabled = !usuario || (usuario.slot && usuario.slot !== '');


    return (
        <Nlayout>
            <Box p={4} sx={{ width: '90%', margin: '0 auto' }}>
                <Typography variant="h4" sx={{ color: 'white' }}>{torneo?.titulo}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>Cantidad de jugadores: {torneo?.cantidad}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>Tipo: {torneo?.tipo}</Typography>

                <Grid style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                    <Button onClick={unirseAlTorneo} variant="contained" sx={{ mt: 2, backgroundColor: 'red', color: 'white' }}>PARTICIPAR</Button>

                    {/* Botón ELEGIR SLOT */}
                    <Button
                        variant="outlined"
                        sx={{ mt: 2, backgroundColor: 'red', color: 'white' }}
                        disabled={!usuario || usuario.slot}
                        onClick={() => abrirModal(participantes.find(p => p.user_name === usuarioOBt))}
                    >
                        ELEGIR SLOT
                    </Button>

                    {esAdmin && (
                        <Button onClick={empezarTorneo} variant="outlined" sx={{ mt: 2, ml: 2 }}>Empezar</Button>
                    )}
                </Grid>

                <Grid container spacing={2} sx={{ mt: 4, flexDirection: props.isMobile ? "column" : "row", justifyContent: 'space-between' }}>
                    {/* Lista de participantes */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ border: '2px dashed #2a2e38' }}>
                            <CardContent sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                <List>
                                    {participantes.map((u, i) => (
                                        <ListItem key={i}>
                                            <ListItemText primary={u.user_name}  sx={{ color: u.slot ? 'green' : 'black', fontWeight: u.slot ? 'bold' : 'normal' }}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Cuadro del torneo */}
                    <Grid item xs={12} md={8} sx={{ width: '80%' }}>
                        <Card sx={{ border: '2px solid #2a2e38', p: 2 }}>
                            <Typography variant="h6" sx={{ color: 'black', mb: 2, textAlign: 'center' }}>Llaves del torneo</Typography>
                            <Box sx={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
                                {rondas?.map((r, i) => (
                                    <Box key={i}>
                                        <Typography variant="subtitle2" style={{ color: 'black' }}>
                                            Ronda {r.ronda}
                                        </Typography>

                                        {r.partidos.map((p, j) => (
                                            <Card
                                                key={j}
                                                sx={{ my: 1, p: 1, minWidth: 150, cursor: esAdmin ? "pointer" : "default" }}
                                            >
                                                {/* Jugador 1 */}
                                                <Typography
                                                    onClick={() => esAdmin && seleccionarGanador(i, p.id, p.jugador1)}
                                                    sx={{
                                                        fontWeight: p.ganador === p.jugador1 ? "bold" : "normal",
                                                        color: p.ganador === p.jugador1 ? "green" : "black",
                                                        "&:hover": esAdmin ? { opacity: 0.7 } : {}
                                                    }}
                                                >
                                                    {p.jugador1 || "—"}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'gray' }}>
                                                    {participantes.find(u => u.user_name === p.jugador1)?.slot || ""}
                                                </Typography>

                                                {/* Jugador 2 */}
                                                <Typography
                                                    onClick={() => esAdmin && seleccionarGanador(i, p.id, p.jugador2)}
                                                    sx={{
                                                        fontWeight: p.ganador === p.jugador2 ? "bold" : "normal",
                                                        color: p.ganador === p.jugador2 ? "green" : "black",
                                                        "&:hover": esAdmin ? { opacity: 0.7 } : {}
                                                    }}
                                                >
                                                    {p.jugador2 || "—"}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'gray' }}>
                                                    {participantes.find(u => u.user_name === p.jugador2)?.slot || ""}
                                                </Typography>
                                            </Card>
                                        ))}
                                    </Box>
                                ))}

                                {rondas.length > 0 && (() => {
                                    const totalParticipantes = torneo?.cantidad || 0;
                                    const rondasTotales = Math.log2(totalParticipantes);

                                    const ultimaRonda = rondas.find(r => r.ronda === rondasTotales);

                                    if (ultimaRonda && ultimaRonda.partidos.every(p => p.ganador)) {
                                        const ganadorFinal = ultimaRonda.partidos[0].ganador;
                                        return (
                                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                                <Card sx={{ width: 200, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f7fa', border: '2px dashed #2a2e38' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                        Ganador: {ultimaRonda.partidos[0].ganador}
                                                    </Typography>
                                                </Card>
                                            </Box>
                                        );
                                    }
                                })()}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                <SlotModal
                    abierto={modalAbierto}
                    onCerrar={cerrarModal}
                    jugador={jugadorSeleccionado}
                    slots={getSlotsPorTipo()} // array de slots según tipo de torneo
                    onGuardar={guardarSlot}
                />
            </Box>
        </Nlayout>
    );
}

export default Torneo;
