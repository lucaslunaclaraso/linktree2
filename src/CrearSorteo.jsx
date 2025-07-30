import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';
import Nlayout from './Nlayout';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
export default function CrearSorteo() {
    const [titulo, setTitulo] = useState('');
    const [clave, setClave] = useState('');
    const [video, setVideo] = useState('');
    const [premios, setPremios] = useState('');
    const [tipo, setTipo] = useState('Normal');
    console.log('tipo', tipo)
    const navigate = useNavigate();

    const handleCrear = async () => {
        try {
            const response = await axios.post('https://backmu.vercel.app/sorteo', {
                titulo,
                premios,
                clave,
                video,
                tipo
            });

            const { id, url } = response.data;
            navigate(`/sorteo/${id}${clave ? `?fb=${encodeURIComponent(clave)}` : ''}`);
        } catch (error) {
            console.error('Error al crear sorteo:', error);
            alert('Hubo un error al crear el sorteo.');
        }
    };

    const handleChange = (event) => {
        setTipo(event.target.value);
    };
    return (
        <Nlayout>
            <Box p={4}>
                <Card>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

                        <TextField
                            fullWidth
                            label="Palabra Clave"
                            margin="normal"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="URL video"
                            margin="normal"
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo de Sorteo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tipo}
                                label="Tipo de Sorteo"
                                onChange={handleChange}
                            >
                                <MenuItem value={'Normal'}>Normal</MenuItem>
                                <MenuItem value={'Suscriptores'}>Suscriptores</MenuItem>

                            </Select>
                        </FormControl>

                        <Button variant="contained" color="primary" fullWidth onClick={handleCrear}>
                            Crear
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Nlayout>
    );
}
