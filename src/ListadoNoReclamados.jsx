import React, { useEffect, useRef, useState } from 'react';
import Nlayout from './Nlayout';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';

function ListadoNoReclamados() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(`https://backmu.vercel.app/solicitudes/no-reclamados`);
                setUsuarios(response.data);
            } catch (err) {
                setError('Error al obtener usuarios');
            }
        };
        fetchUsuarios();
    }, []);

    const enviarMailsAutomatico = () => {
        if (usuarios.length === 0) return;
        setEnviando(true);
        indexRef.current = 0;
        setProgreso(0);

        intervalRef.current = setInterval(async () => {
            if (indexRef.current >= usuarios.length) {
                clearInterval(intervalRef.current);
                setEnviando(false);
                return;
            }

            const usuario = usuarios[indexRef.current];

            try {
                await axios.post(`https://backmu.vercel.app/solicitudes/enviar-mail`, {
                    mail: usuario.mail,
                    solicitudes: usuario.solicitudes
                });
                console.log(`Mail enviado a ${usuario.mail}`);
            } catch (err) {
                console.error(`Error al enviar mail a ${usuario.mail}:`, err);
            }

            indexRef.current += 1;
            setProgreso(indexRef.current);
        }, 60 * 1000); // 1 minuto
    };

    return (
        <Nlayout>
            <Box p={4}>
                <Button
                    variant="contained"
                    onClick={enviarMailsAutomatico}
                    disabled={enviando}
                    sx={{ mb: 3 }}
                >
                    {enviando ? 'Enviando mails...' : 'Enviar mails automáticamente'}
                </Button>

                {usuarios?.length === 0 ? (
                    <Typography>No hay usuarios disponibles</Typography>
                ) : (
                    <>
                        <Typography mb={2}>
                            Progreso: {progreso} / {usuarios.length}
                        </Typography>

                        {usuarios?.map((usuario) => (
                            <Card key={usuario.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>
                                            <Typography variant="h6" color="green">
                                                {usuario.nombre} ({usuario.mail})
                                            </Typography>
                                            <Typography>
                                                Tipeos: {usuario.solicitudes}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </Box>
        </Nlayout>
    );
}

export default ListadoNoReclamados;
