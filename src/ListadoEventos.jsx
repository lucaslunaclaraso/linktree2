import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Button, Grid,
    TextField, Tooltip
} from '@mui/material';
import Nlayout from './Nlayout';
import axios from 'axios';

export default function ListadoEventos() {
    const [listadoEventos, setListadoEventos] = useState([]);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const obtenerSorteos = async () => {
        try {
            const res = await axios.get('https://backmu.vercel.app/sorteo/suscripcionesEventos');
            
            setListadoEventos(res.data.data || []);
        } catch (error) {
            console.error('Error al obtener sorteos:', error);
        }
    };

    useEffect(() => {
        obtenerSorteos();
    }, []);



    const filtrarPorFecha = (sorteo) => {
        const fecha = new Date(sorteo.fecha_creacion);
        const desde = fechaDesde ? new Date(fechaDesde) : null;
        const hasta = fechaHasta ? new Date(fechaHasta) : null;

        if (desde && fecha < desde) return false;
        if (hasta && fecha > hasta) return false;
        return true;
    };

    const sorteosFiltrados = listadoEventos
        .filter(filtrarPorFecha)
        .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    return (
        <Nlayout>
            <Box p={4}>
                <Typography
                    sx={{
                        background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: 60,
                        fontFamily: 'PoetsenOne',
                        mb: 4
                    }}
                >
                    Listado de Eventos
                </Typography>

                <Grid container spacing={2} mb={4}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha desde"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            sx={{
                                '& label': { color: 'white' },
                                '& input': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha hasta"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            sx={{
                                '& label': { color: 'white' },
                                '& input': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                </Grid>


                {sorteosFiltrados.length === 0 ? (
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" align="center">NO HAY EVENTOS</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    sorteosFiltrados.map((sorteo) => {
                       
                        return (
                            <Card key={sorteo.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6">{sorteo.nombre}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Fecha: {new Date(sorteo.fecha).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} textAlign="right">
                                            <Tooltip >
                                                <Typography
                                                    variant="h6"
                                                    color="green"
                                                    
                                                >
                                                    <Typography variant="h6">Ganó {sorteo.premio} Tipeos!</Typography>

                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>

                                    
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </Box>
        </Nlayout>
    );
}
