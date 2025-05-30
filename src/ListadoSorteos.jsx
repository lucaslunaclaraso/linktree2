import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import Nlayout from './Nlayout';
import axios from 'axios'
export default function ListadoSorteos({ sorteos }) {

    const [listadoSorteos, setListadoSorteos] = useState()
    const obtenerSorteos = async () => {
        const peticion = await axios.get('https://backmu.vercel.app/sorteo/')

        setListadoSorteos(peticion?.data?.recordset)
    }

    useEffect(() => { obtenerSorteos() }, [])
    
    return (
        <Nlayout>
            <Box p={4}>
                <Typography sx={{
                    background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    fontSize: 60,
                    fontFamily: 'PoetsenOne'
                }} >Listado de Sorteos</Typography>
                {listadoSorteos?.map((sorteo) => (
                    <Card key={sorteo.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Grid style={{display:'flex', alignItems:'center',justifyContent:'space-between'}}>
                                <Typography variant="h6">{sorteo?.titulo}</Typography>
                                <Typography variant="h6" style={{color:'green'}} >{sorteo?.ganadores ? sorteo?.ganadores?.replaceAll('"', "")  :'No hay ganador'}</Typography>

                            </Grid>
                            <Button variant="outlined" component={Link} to={`/sorteo/${sorteo.id}`}>
                                Ver sorteo
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Nlayout>
    );
}
