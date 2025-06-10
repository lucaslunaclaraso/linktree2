import React, { useEffect, useState } from 'react'
import Nlayout from './Nlayout'
import { Button, Grid } from '@mui/material'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

function TipeoCustom(props) {
    const { url } = useParams();
    const navigate = useNavigate();

    const tipeo = true
    const nombre = localStorage.getItem('kick_user')
    const mail = localStorage.getItem('kick_mail')
    const [registrado, setRegistrado] = useState('')
    const [deshabilitar, setDeshabilitar] = useState(false)
    const isLoggedIn = nombre;
    const [solicitud, setSolicitud] = useState()
    const obtenerSorteos = async () => {
        const peticion = await axios.get(`https://backmu.vercel.app/solicitudes/${url}`)
        setSolicitud(peticion?.data)
    }
    useEffect(() => { obtenerSorteos() }, [])

    console.log('solicitud', solicitud)

    const solicitarTipeo = async () => {
        const peticion = await axios.post(`https://backmu.vercel.app/solicitudes/${url}/unirse`, { nombre })
        console.log(peticion)
        if (!peticion?.data?.registrado) {
            const peticionUser = await axios.post(`https://backmu.vercel.app/sorteo/crearUser`, { nombre, mail, tipeo })
            navigate(`/tipeo`); // o usar url si lo devuelves completo

        } else {
            setRegistrado('Ya reclamaste el tipeo')
            setDeshabilitar(true)
            navigate(`/tipeo`); // o usar url si lo devuelves completo
        }

    }
    return (
        <Nlayout>
            <Grid style={{ margin: '0 auto', height: '600px', alignContent: 'center' }}>

                <Button

                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        padding: '0.75rem 2rem',
                        fontSize: '.8rem',
                        width: '100%',
                        backgroundImage: `linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)`,
                        border: '2px solid #e0c060',
                        borderRadius: '12px',
                        boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                        textTransform: 'uppercase',
                        margin: '0 auto',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                            transform: 'scale(1.05)',
                        },
                    }}
                    onClick={isLoggedIn && !deshabilitar ? solicitarTipeo : alert("Tenes que estar logueado")}
                    disabled={deshabilitar}
                >
                    {deshabilitar ? registrado : 'Reclamar solicitud de tipeo'}
                </Button>
            </Grid>

        </Nlayout>
    )
}

export default TipeoCustom