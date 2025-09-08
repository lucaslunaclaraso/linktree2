import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nlayout from './Nlayout';
import { Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent, Grid } from '@mui/material';
import SlotModal from './SlotModal';

function Torneo(props) {
    const [torneo, setTorneo] = useState();
    const [participantes, setParticipantes] = useState([]);   // jugadores seleccionados
    const [inscriptos, setInscriptos] = useState([]);         // inscriptos al sorteo
    const [rondas, setRondas] = useState([]);
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
            setInscriptos(res.data.inscriptos || []);

            // Si ya hay cruces, traer rondas
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
        obtenerTorneo();
        const interval = setInterval(() => obtenerTorneo(), 45000);
        return () => clearInterval(interval);
    }, [url]);

    // Unirse al sorteo
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
            alert("Error al intentar inscribirse al sorteo.");
        }
    };

    // Sortear participantes oficiales
    const sortearParticipantes = async () => {
        try {
            const res = await axios.post(`https://backmu.vercel.app/torneo/${torneo.id}/sortear`);
            if (res.data.jugadores) {
                setParticipantes(res.data.jugadores);
                setInscriptos([]); // limpia inscriptos después del sorteo
            }
        } catch (err) {
            alert("Error al sortear participantes");
        }
    };

    // Empezar torneo (crear cruces)
    const empezarTorneo = async () => {
        try {
            const res = await axios.post(`https://backmu.vercel.app/torneo/${torneo.id}/empezar`);
            if (res.data?.cruces?.length) {
                setRondas([{ ronda: 1, partidos: res.data.cruces }]);
                obtenerTorneo()
            }
        } catch (err) {
            alert("Error al generar llaves");
        }
    };

    // Guardar slot
    const guardarSlot = async (slot) => {
        try {
            await axios.patch(
                `https://backmu.vercel.app/torneo/${torneo.id}/jugadores/${usuarioOBt}/slot`,
                { slot }
            );
            setParticipantes(prev => prev.map(j =>
                j.user_name === usuarioOBt ? { ...j, slot } : j
            ));
            cerrarModal();
        } catch (err) {
            alert("Error al guardar slot");
        }
    };

    const usuario = participantes.find(
        p => p.user_name.toLowerCase() === usuarioOBt?.toLowerCase()
    );
    const botonDisabled = !usuario || (usuario.slot && usuario.slot !== '');
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
        return [...slotsHacksaw, ...slotsPragmatic];
    };
    const seleccionarGanador = async (partidoIndex, partidoId, ganador) => {
        if (!esAdmin) return;
        try {
            await axios.post(`https://backmu.vercel.app/torneo/${torneo.id}/partidos/${partidoId}/ganador`, { ganador });

            const res = await axios.get(`https://backmu.vercel.app/torneo/${torneo.id}/todas-rondas`);
            setRondas(res.data || []);
        } catch (err) {
            alert("Error al actualizar ganador");
        }
    };
    return (
        <Nlayout>
            <Box p={4} sx={{ width: '90%', margin: '0 auto' }}>
                <Typography variant="h4" sx={{ color: 'white' }}>{torneo?.titulo}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>Cantidad de jugadores: {torneo?.cantidad}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>Tipo: {torneo?.tipo}</Typography>

                <Grid style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Button onClick={unirseAlTorneo} variant="contained" sx={{ mt: 2, backgroundColor: 'red', color: 'white' }}>
                        PARTICIPAR
                    </Button>

                    {/* Botón ELEGIR SLOT */}
                    <Button
                        variant="outlined"
                        sx={{ mt: 2, backgroundColor: 'red', color: 'white' }}
                        disabled={botonDisabled}
                        onClick={() => abrirModal(participantes.find(p => p.user_name === usuarioOBt))}
                    >
                        ELEGIR SLOT
                    </Button>

                    {esAdmin && (
                        <>
                            <Button onClick={sortearParticipantes} variant="outlined" sx={{ mt: 2, ml: 2 }}>
                                Sortear
                            </Button>
                            <Button onClick={empezarTorneo} variant="outlined" sx={{ mt: 2, ml: 2 }}>
                                Empezar
                            </Button>
                        </>
                    )}
                </Grid>

                <Grid container spacing={2} sx={{ mt: 4, flexDirection: props.isMobile ? "column" : "row", justifyContent: 'space-between' }}>
                    {/* Mostrar solo inscriptos o participantes, nunca ambos */}
                    {inscriptos.length > 0 && participantes.length === 0 && (
                        <Grid item xs={12} md={4}>
                            <Card sx={{ border: '2px dashed #2a2e38' }}>
                                <CardContent>
                                    <Typography variant="h6">Inscriptos al sorteo</Typography>
                                    <List>
                                        {inscriptos.map((u, i) => (
                                            <ListItem key={i}>
                                                <ListItemText primary={u.user_name} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {participantes.length > 0 && (
                        <Grid item xs={12} md={4}>
                            <Card sx={{ border: '2px dashed #2a2e38' }}>
                                <CardContent>
                                    <Typography variant="h6">Jugadores del torneo</Typography>
                                    <List>
                                        {participantes.map((u, i) => (
                                            <ListItem key={i}>
                                                <ListItemText
                                                    primary={u.user_name}
                                                    sx={{ color: u.slot ? 'green' : 'black', fontWeight: u.slot ? 'bold' : 'normal' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    {/* Cuadro del torneo */}
                    <Grid item xs={12} md={8}>
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
                    slots={getSlotsPorTipo()}
                    onGuardar={guardarSlot}
                />
            </Box>
        </Nlayout>
    );
}

export default Torneo;
