import React, { useState } from 'react'
import Nlayout from './Nlayout'
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function PanelTorneo(props) {
    const [titulo, setTitulo] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [tipo, setTipo] = useState('Normal');
    const navigate = useNavigate();

    const handleCrear = async () => {
        try {
            const response = await axios.post('https://backmu.vercel.app/torneo', {
                titulo,
                cantidad,               
                tipo
            });

            const { torneoId, url } = response.data;
            navigate(`/torneo/${torneoId}`);
        } catch (error) {
            console.error('Error al crear torneo:', error);
            alert('Hubo un error al crear el torneo.');
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
                        <Typography variant="h5" gutterBottom>Crear Torneo</Typography>
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
                            label="Cantidad de Participantes (Par)"
                            margin="normal"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />


                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipos de Slots</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tipo}
                                label="Tipo de Sorteo"
                                onChange={handleChange}
                            >
                                <MenuItem value={'Pragmatic'}>Pragmatic</MenuItem>
                                <MenuItem value={'HackSaw'}>HackSaw</MenuItem>
                                <MenuItem value={'Todos'}>Todos</MenuItem>

                            </Select>
                        </FormControl>

                        <Button variant="contained" color="primary" fullWidth onClick={handleCrear}>
                            Crear
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Nlayout>

    )
}

export default PanelTorneo