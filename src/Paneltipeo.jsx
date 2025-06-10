import React, { useState } from 'react'
import Nlayout from './Nlayout'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Paneltipeo(props) {

    const [premios, setPremios] = useState('');
    const navigate = useNavigate();

    const handleCrear = async () => {
        try {
            const response = await axios.post('https://backmu.vercel.app/solicitudes', {                
                premios
            });

            const { id } = response.data;
            navigate(`/tipeos/${id}`); // o usar url si lo devuelves completo
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
                        <Typography variant="h5" gutterBottom>Crear Link</Typography>
                        
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
    )
}

export default Paneltipeo