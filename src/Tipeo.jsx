import React, { useEffect, useState } from 'react'
import Nlayout from './Nlayout'
import { Alert, Box, Button, CircularProgress, Grid, Link, Paper, Step, StepLabel, Stepper, TextField, Typography, styled } from '@mui/material'
import backgroundImg from './main_intro.jpg'
import axios from 'axios'
import { FaCloudUploadAlt } from 'react-icons/fa'


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function Tipeo(props) {
    const [userEmail, setUserEmail] = useState('');
    const mailKick = localStorage.getItem('kick_mail')
    const [solicitudes, setSolicitudes] = useState()
    const [cargar, setCargar] = useState()
    const nombre = props.nombre
    const [isWinner, setIsWinner] = useState()
    const checkWinner = async () => {
        setCargar(true)
        const peticion = await axios.post(`https://backmu.vercel.app/sorteo/check-ganador`, { nombre })
        const peticionTipeo = await axios.post(`https://backmu.vercel.app/solicitudes/tipeo`, { nombre })
        const soli = peticionTipeo?.data?.map((p) => p.solicitudes)
        setSolicitudes(soli)
        setIsWinner(peticion?.data)
        setUserEmail(mailKick)
        setTimeout(() => {
            setCargar(false)
            
        }, 3000);
    }


    useEffect(() => { checkWinner() }, [])
console.log('soli', solicitudes < 1)
    const [activeStep, setActiveStep] = useState(0);
    const [offerScreenshot, setOfferScreenshot] = useState(null);
    const [bnbScreenshot, setBnbScreenshot] = useState(null);
    const [bnbAddress, setBnbAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [offerScreenshotUrl, setOfferScreenshotUrl] = useState('');
    const [bnbScreenshotUrl, setBnbScreenshotUrl] = useState('');
    const [url, setUrl] = useState('')
    const steps = ['Registrarse', 'Subir captura de Ajustes', 'Subir captura de BNB'];


    const handleNext = () => {
        if (validateStep()) {
            setError('');
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setError('');
        setActiveStep((prev) => prev - 1);
    };

    const validateStep = () => {
        if (activeStep === 1 && !offerScreenshot) {
            setError('Debes subir una captura de Ajustes - Ofertas');
            return false;
        }
        if (activeStep === 2 && (!bnbScreenshot || !bnbAddress)) {
            setError('Debes subir una captura del QR y la dirección BNB, y proporcionar la dirección');
            return false;
        }
        return true;
    };

    const handleRequestTipeo = async () => {
        setLoading(true);
        setError('');

        try {
            // Validar datos antes de procesar
            if (!offerScreenshot || !bnbScreenshot || !bnbAddress) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Subir imágenes a Cloudinary
            const uploadToCloudinary = async (file) => {
                if (!file || !(file instanceof File)) {
                    throw new Error('Archivo inválido');
                }
                const formData = new FormData();

                formData.append('file', file);
                formData.append('upload_preset', 'ml_default'); // Reemplaza con tu preset
                const response = await fetch('https://api.cloudinary.com/v1_1/dks7seyl8/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Error al subir la imagen a Cloudinary');
                }
                const data = await response.json();
                return data.secure_url;
            };

            const offerScreenshotUrl = await uploadToCloudinary(offerScreenshot);
            const bnbScreenshotUrl = await uploadToCloudinary(bnbScreenshot);

            // Enviar solicitud al backend proxy
            const response = await fetch('https://backmu.vercel.app/solicitudes/submit-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: localStorage.getItem('kick_user'),
                    offerScreenshot: offerScreenshotUrl,
                    bnbScreenshot: bnbScreenshotUrl,
                    bnbAddress,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar la solicitud');
            }

            setSuccess(true);
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Subir imagen a Cloudinary
    const uploadToCloudinary = async (file) => {
        if (!file || !(file instanceof File)) {
            throw new Error('Archivo inválido');
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ml_default'); // Reemplaza con tu preset
            const response = await fetch('https://api.cloudinary.com/v1_1/dks7seyl8/image/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Error al subir la imagen a Cloudinary');
            }
            const data = await response.json();
            return data.secure_url;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambio de archivo y subir a Cloudinary
    const handleFileChange = (setFile, setUrl) => async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            try {
                const url = await uploadToCloudinary(file);
                setUrl(url);
                setError('');
            } catch (err) {
                setError('Error al subir la imagen: ' + err.message);
            }
        }
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Es obligatorio estar registrado con el siguiente enlace:
                        </Typography>
                        <Link
                            href="https://stake1021.com/?offer=eldenguee&c=1590cd3460"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: 'block', my: 2 }}
                        >
                            https://stake1021.com/?offer=eldenguee&c=1590cd3460
                        </Link>
                        <Typography>
                            Necesitas estar registrado con este enlace porque luego se pedirá una captura de Ajustes - Ofertas para verificar que estás vinculado a este código.
                        </Typography>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Sube la captura de pantalla de Ajustes - Ofertas
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                            Deberías ver una pantalla como esta:
                        </Typography>

                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<FaCloudUploadAlt />}
                        >
                            Subir Captura
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange(setOfferScreenshot, setOfferScreenshotUrl)}
                            />
                        </Button>
                        {offerScreenshot && (
                            <Typography sx={{ mt: 2 }}>
                                Archivo seleccionado: {offerScreenshot.name}
                            </Typography>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Sube la captura del QR y la dirección BNB
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                            Haz clic en el botón de depositar junto a tu saldo, selecciona BNB y sube una captura del QR y la dirección que aparece.
                        </Typography>

                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<FaCloudUploadAlt />}
                        >
                            Subir Captura
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange(setBnbScreenshot, setBnbScreenshotUrl)}
                            />
                        </Button>
                        {bnbScreenshot && (
                            <Typography sx={{ mb: 2 }}>
                                Archivo seleccionado: {bnbScreenshot.name}
                            </Typography>
                        )}
                        <TextField
                            fullWidth
                            label="Dirección BNB"
                            value={bnbAddress}
                            onChange={(e) => setBnbAddress(e.target.value)}
                            variant="outlined"
                            sx={{ mt: 2 }}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };
    return (
        <Nlayout>
            <Grid style={{ background: '#11111d', marginTop: props.isMobile ? '-30%' : '-10%', width: '100%' }}>

                {
                    cargar ?
                        <Grid style={{
                            backgroundImage: `
                  linear-gradient(to bottom, rgba(63, 61, 69, 0.8), rgba(63, 61, 69, 0)),
                  url(${backgroundImg})
                  `,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            height: '980px',
                            backgroundColor: '#3f3d45',
                            margin: '0 auto',
                            position: 'relative',
                            backgroundPosition: '50%'
                        }}>
                            <Grid className='container' style={{
                                padding: 50,
                                gap: '10px',
                                justifyContent: 'center',

                            }}>
                                <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                    <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '32px', fontFamily: 'Outfit,sans-serif' }} >
                                        eldenguee.com
                                    </Typography>
                                    <Typography sx={{
                                        background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 'bold',
                                        fontSize: props.isMobile ? 32 : 65,
                                        fontFamily: 'Belerofonte'
                                    }} >Verificando..</Typography>
                                </Grid>

                                <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >

                                </Grid>
                            </Grid>
                        </Grid>

                        :

                        solicitudes < 1 ?

                            <Grid style={{
                                backgroundImage: `
    linear-gradient(to bottom, rgba(63, 61, 69, 0.8), rgba(63, 61, 69, 0)),
    url(${backgroundImg})
  `,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                height: '980px',
                                backgroundColor: '#3f3d45',
                                margin: '0 auto',
                                position: 'relative',
                                backgroundPosition: '50%'
                            }}>
                                <Grid className='container' style={{
                                    padding: 50,
                                    gap: '10px',
                                    justifyContent: 'center',

                                }}>
                                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                        <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '32px', fontFamily: 'Outfit,sans-serif', textAlign: 'center' }} >
                                            No estás habilitado para solicitar tipeo, lo tienes que ganar en algún sorteo realizado por el dengue!

                                        </Typography>
                                        <Typography sx={{
                                            background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold',
                                            fontSize: props.isMobile ? 32 : 50,
                                            fontFamily: 'Belerofonte'
                                        }} >Eldenguee.com</Typography>
                                    </Grid>

                                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >


                                        <Button

                                            sx={{
                                                color: 'black',
                                                fontWeight: 'bold',
                                                padding: '0.75rem 2rem',
                                                fontSize: '.8rem',
                                                fontFamily: 'Outfit,sans-serif',
                                                backgroundImage: `linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)`,
                                                border: '2px solid #e0c060',
                                                borderRadius: '100px',
                                                boxShadow: '0 0 8px rgba(118, 118, 245, 0.8)',
                                                textTransform: 'uppercase',
                                                transition: 'all 0.3s ease-in-out',
                                                '&:hover': {
                                                    boxShadow: '0 0 16px rgba(118, 118, 245, 1)',
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                            href='/'
                                        >
                                            Volver al inicio
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            :

                            <Grid style={{
                                backgroundImage: `
    linear-gradient(to bottom, rgba(63, 61, 69, 0.8), rgba(63, 61, 69, 0)),
    url(${backgroundImg})
  `,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                height: '980px',
                                backgroundColor: '#3f3d45',
                                margin: '0 auto',
                                position: 'relative',
                                backgroundPosition: '50%',
                                marginTop: '2%'
                            }}>
                                <Grid className='container' style={{
                                    padding: 50,
                                    gap: '10px',
                                    justifyContent: 'center',

                                }}>
                                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                        <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '32px', fontFamily: 'Outfit,sans-serif', textAlign: 'center' }} >
                                            Felicitaciones estás habilitado para solicitar un tipeo!. Te dejo las instrucciones para hacerlo

                                        </Typography>
                                        <Typography sx={{
                                            background: 'linear-gradient(317deg,#b58a1b 4.52%,#e0c060 34.37%,#ffeeb2 50.47%,#ffe77c 65.63%,#ffca41 110.56%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold',
                                            fontSize: props.isMobile ? 32 : 50,
                                            fontFamily: 'Belerofonte'
                                        }} >Eldenguee.com</Typography>
                                    </Grid>

                                    <Box sx={{ maxWidth: 600, mx: 'auto', my: 1 }}>
                                        <Paper elevation={3} sx={{ p: 3 }}>
                                            <Typography variant="h4" align="center" gutterBottom>
                                                Solicitud para Eldenguee
                                            </Typography>
                                            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                                                {steps.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                            {success ? (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Gracias, tu solicitud fue recibida.
                                                    </Typography>
                                                    <Typography>
                                                        Cuando tu tipeo esté listo, recibirás un correo en: <strong>{userEmail}</strong>
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    {error && (
                                                        <Alert severity="error" sx={{ mb: 2 }}>
                                                            {error}
                                                        </Alert>
                                                    )}
                                                    {getStepContent(activeStep)}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                                        <Button
                                                            disabled={activeStep === 0 || loading}
                                                            onClick={handleBack}
                                                            variant="outlined"
                                                        >
                                                            Atrás
                                                        </Button>
                                                        <Button
                                                            onClick={activeStep === steps.length - 1 ? handleRequestTipeo : handleNext}
                                                            variant="contained"
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <CircularProgress size={24} />
                                                            ) : activeStep === steps.length - 1 ? (
                                                                'Terminar solicitud'
                                                            ) : (
                                                                'Siguiente'
                                                            )}
                                                        </Button>
                                                    </Box>
                                                </>
                                            )}
                                        </Paper>
                                    </Box>
                                </Grid>
                            </Grid>
                }
            </Grid>
        </Nlayout>
    )
}

export default Tipeo