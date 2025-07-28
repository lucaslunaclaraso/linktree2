import { Box, Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Nlayout from './Nlayout';
import axios from 'axios';

function ListaCodigos(props) {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const svgRef = useRef(null);
    const [codigos, setCodigos] = useState([]);
    const [error, setError] = useState('');

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });

        if (svgRef.current) {
            const ellipse = svgRef.current.querySelector('ellipse');
            if (ellipse) {
                ellipse.setAttribute('cx', `${x}%`);
                ellipse.setAttribute('cy', `${y}%`);
            }
        }
    };

    const handleMouseLeave = () => {
        setMousePos({ x: -100, y: -100 });
        if (svgRef.current) {
            const ellipse = svgRef.current.querySelector('ellipse');
            if (ellipse) {
                ellipse.setAttribute('cx', '1.25%');
                ellipse.setAttribute('cy', '82.24121557454892%');
            }
        }
    };
    useEffect(() => {
        const fetchCodigos = async () => {
            try {
                const response = await axios.get(`https://backmu.vercel.app/solicitudes/codigos`);
                setCodigos(response.data);
            } catch (err) {
                setError('Error al obtener códigos');
            }
        };
        fetchCodigos();
    }, []);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }
    return (
        <Nlayout>
            <Box p={4}>
           
                {codigos.length === 0 ? (
                    <Typography>No hay códigos disponibles</Typography>
                ) : (
                    codigos.map((codigoItem) => {
                        // Limpiar y separar usuarios que canjearon
                        const usuarios = codigoItem.usuarios
                            ? codigoItem.usuarios.replaceAll('"', '').replace('[', '').replace(']', '').split(',').map(u => u.trim())
                            : [];

                        const primeros = usuarios.slice(0, 2).join(', ');
                        const textoUsuarios = usuarios.length > 2 ? `${primeros}...` : primeros;

                        return (
                            <Card key={codigoItem.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6">{codigoItem.codigo}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Usos restantes: {codigoItem.usos}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} textAlign="right">
                                            <Tooltip title={usuarios.join(', ') || 'Nadie ha canjeado'}>
                                                <Typography
                                                    variant="h6"
                                                    color="green"
                                                    sx={{ cursor: usuarios.length > 0 ? 'pointer' : 'default' }}
                                                >
                                                    {usuarios.length > 0 ? textoUsuarios : 'No canjeado'}
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
    )
}

export default ListaCodigos