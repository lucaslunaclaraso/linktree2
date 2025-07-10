import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Button, Grid,
    TextField, Tooltip
} from '@mui/material';
import Nlayout from './Nlayout';
import axios from 'axios';

export default function ListadoSorteos() {
    const [listadoSorteos, setListadoSorteos] = useState([]);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const obtenerSorteos = async () => {
        try {
            const res = await axios.get('https://backmu.vercel.app/sorteo/');
            setListadoSorteos(res.data?.recordset || []);
        } catch (error) {
            console.error('Error al obtener sorteos:', error);
        }
    };

    useEffect(() => {
        obtenerSorteos();
    }, []);

    const cambiarEstado = async (estado, id) => {
        const nuevoEstado = estado === 'activo' ? 'oculto' : 'activo';
        try {
            await axios.put(`https://backmu.vercel.app/sorteo/${id}/eliminar`, {
                estado: nuevoEstado,
            });
            obtenerSorteos();
        } catch (error) {
            console.error('Error al cambiar el estado:', error);
        }
    };

    const filtrarPorFecha = (sorteo) => {
        const fecha = new Date(sorteo.fecha_creacion);
        const desde = fechaDesde ? new Date(fechaDesde) : null;
        const hasta = fechaHasta ? new Date(fechaHasta) : null;

        if (desde && fecha < desde) return false;
        if (hasta && fecha > hasta) return false;
        return true;
    };

    const sorteosFiltrados = listadoSorteos
        .filter(s => s.estado === 'activo')
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
                    Listado de Sorteos
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
                            <Typography variant="h6" align="center">NO HAY SORTEOS CREADOS</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    sorteosFiltrados.map((sorteo) => {
                        const ganadores = sorteo.ganadores
                            ? sorteo.ganadores.replaceAll('"', '').replace('[', '').replace(']', '').split(',')
                            : [];

                        const primeros = ganadores.slice(0, 2).join(', ');
                        const textoGanadores = ganadores.length > 2 ? `${primeros}...` : primeros;

                        return (
                            <Card key={sorteo.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6">{sorteo.titulo}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Fecha: {new Date(sorteo.fecha_creacion).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} textAlign="right">
                                            <Tooltip title={ganadores.join(', ') || 'No hay ganador'}>
                                                <Typography
                                                    variant="h6"
                                                    color="green"
                                                    sx={{ cursor: ganadores.length > 0 ? 'pointer' : 'default' }}
                                                >
                                                    {ganadores.length > 0 ? textoGanadores : 'No hay ganador'}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>

                                    <Grid mt={2} container spacing={2}>
                                        <Grid item>
                                            <Button variant="outlined" component={Link} to={`/sorteo/${sorteo.id}`}>
                                                Ver sorteo
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => cambiarEstado(sorteo.estado, sorteo.id)}
                                            >
                                                Eliminar sorteo
                                            </Button>
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
