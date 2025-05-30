import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';
import Nlayout from './Nlayout';

export default function CrearSorteo() {
    const [titulo, setTitulo] = useState('');
    const [premios, setPremios] = useState('');
    const navigate = useNavigate();

    const handleCrear = async () => {
        try {
            const response = await axios.post('https://backmu.vercel.app/sorteo', {
                titulo,
                premios
            });

            const { id, url } = response.data;
            navigate(`/sorteo/${id}`); // o usar url si lo devuelves completo
        } catch (error) {
            console.error('Error al crear sorteo:', error);
            alert('Hubo un error al crear el sorteo.');
        }
    };

    return (
        <Nlayout>
            <Box p={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Crear sorteo</Typography>
                        <TextField
                            fullWidth
                            label="Título"
                            margin="normal"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            label="Cantidad de premios"
                            margin="normal"
                            value={premios}
                            onChange={(e) => setPremios(e.target.value)}
                        />
                        <Button variant="contained" color="primary" fullWidth onClick={handleCrear}>
                            Crear
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Nlayout>
    );
}
