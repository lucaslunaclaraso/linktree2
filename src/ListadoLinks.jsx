import React, { useEffect, useState } from 'react'
import Nlayout from './Nlayout'
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import axios from 'axios'

function ListadoLinks() {
    const [listadoLinks, setListadoLinks] = useState()
    const obtenerSorteos = async () => {
        const peticion = await axios.get('https://backmu.vercel.app/solicitudes/tipeos')

        setListadoLinks(peticion?.data)
    }
    useEffect(() => { obtenerSorteos() }, [])

    return (
        <Nlayout>
            <Box
                sx={{
                    maxHeight: '600px',
                    width: '50%',
                    padding: '15px',
                    margin: '0 auto',
                    overflowY: 'auto',
                    pr: 1
                }}
            >
                {listadoLinks?.map((sorteo) => (
                    <Card key={sorteo.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6">{sorteo?.id}</Typography>
                                <Typography variant="h6" sx={{ color: 'green' }}>
                                    Premios: {sorteo?.premios} - Quedan {
                                        sorteo?.usuarios && sorteo?.usuarios.trim() !== ''
                                            ? sorteo.premios - sorteo.usuarios.split(',').length
                                            : sorteo.premios
                                    }
                                </Typography>
                            </Grid>
                            <Grid sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button variant="outlined" sx={{ backgroundColor: 'red', color: 'white' }}>
                                    Eliminar sorteo
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
            </Box>


        </Nlayout>

    )
}

export default ListadoLinks