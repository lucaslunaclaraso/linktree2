import React, { useEffect, useState } from 'react'
import Nlayout from './Nlayout'
import { Alert, Box, Button, CircularProgress, Grid, Link, Paper, Step, StepLabel, Stepper, TextField, Typography, styled } from '@mui/material'
import backgroundImg from './main_intro.jpg'
import axios from 'axios'
import { FaCloudUploadAlt } from 'react-icons/fa'
import paso1 from './Paso1-gif.gif'
import paso2 from './Paso2-gif.gif'
import paso3 from './Paso3-gif.gif'
import vault from './vault.jpg'
import ej2 from './ejpaso2.jpg'
import ej3 from './ejpaso3.jpg'
import successImg from './withdraw.jpg'
import { BrowserQRCodeReader } from '@zxing/browser'

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
    const nombre = localStorage.getItem('kick_user');
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
        setCargar(false)

    }


    useEffect(() => { checkWinner() }, [])

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
    const steps = ['Paso 1', 'Paso 2', 'Paso 3', 'Paso 4'];


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
        if (activeStep === 2 && !offerScreenshot) {
            setError('Debes subir una captura de Ajustes - Ofertas');
            return false;
        }
        if (activeStep === 3 && (!bnbScreenshot || !bnbAddress)) {

            setError('Debes subir una captura del QR y la dirección BNB, y proporcionar la dirección');
            return false;
        }


        return true;
    };

    const [deshabilitarBoton, setDeshabilitarBoton] = useState(false)

    const getPublicIP = async () => {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    };
    const handleRequestTipeo = async () => {
        setLoading(true);
        setError('');
        const ip = await getPublicIP();
        try {
            if (!bnbAddress.startsWith('0x')) {
                throw new Error('UPS! eso no parece una dirección BNB');
            }
            if (activeStep === 2 && (
                bnbAddress?.toLowerCase() === '0x3f1bD53eB8A3F5d60147A5C0c47279a...' ||
                bnbAddress?.toLowerCase() === '0x3f1bD53eB8A3F5d60147A5C0c47279a'
            )) {
                setError('La dirección BNB debe ser una real..');
                return false;
            }
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
            setDeshabilitarBoton(true)
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
                    ip
                }),
            });

            console.log('response', response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar la solicitud');
            }

            setSuccess(true);
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
            setDeshabilitarBoton(false)
        }
    };
    const [isUploading, setIsUploading] = useState(false);

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
            setIsUploading(false)
        }
    };
    // Manejar cambio de archivo y subir a Cloudinary
    const handleFileChange = (setFile, setUrl) => async (event) => {
        const file = event.target.files[0];

        if (file) {
            setFile(file);
            try {
                setIsUploading(true)
                const url = await uploadToCloudinary(file);
                setUrl(url);
                setError('');
            } catch (err) {
                setError('Error al subir la imagen: ' + err.message);
            }
        }
    };

    const decodeQRFromUrl = async (imageUrl) => {
        try {
            const reader = new BrowserQRCodeReader();
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                        reject(new Error('Imagen sin dimensiones válidas'));
                    } else {
                        resolve();
                    }
                };
                img.onerror = () => reject(new Error('Error al cargar imagen'));
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const result = await reader.decodeFromCanvas(canvas);
            return result?.getText() || null;

        } catch (err) {
            console.warn('QR no leído:', err);
            return null;
        }
    };

    const handleFileChangeBnB = (setFile, setUrl) => async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);

        // Leer QR
        const qrTexto = await decodeQRFromUrl(localUrl);
        if (!qrTexto) {
            setError('No se pudo subir la imagen. Asegurate de que esté visible y claro.');
            setDeshabilitarBoton(true)

            return;
        }

        try {
            setIsUploading(true); // Si usás estado local para loading
            const uploadedUrl = await uploadToCloudinary(file);
            setDeshabilitarBoton(false)

            setFile(file);
            setUrl(uploadedUrl);
            setError('');
        } catch (err) {
            setError('Error al subir la imagen: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (url) => {
        setSelectedImage(url);
        setIsOpen(true);
    };

    const closeImage = () => {
        setIsOpen(false);
        setSelectedImage(null);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 1:
                return (
                    <Box>
                        <Box style={{ backgroundColor: '#1a2c38', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <Typography sx={{ mt: 2 }}>
                                Felicitaciones estás habilitado para solicitar un tipeo
                            </Typography>
                            <Box sx={{ backgroundColor: '#1e293b', p: 2, borderRadius: 1, mt: 2, border: '2px dashed #2a2e38' }}>
                                <Typography>
                                    Es obligatorio estar registrado con el siguiente enlace y el código <strong>"eldenguee"</strong> como muestra arriba
                                </Typography>

                                <Link
                                    href="https://stake1022.com/?offer=eldenguee&c=1590cd3460"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'block',
                                        mt: 1,
                                        mb: 2,
                                        color: '#4ade80',
                                        wordBreak: 'break-all',
                                    }}
                                >
                                    https://stake1022.com/?offer=eldenguee&c=1590cd3460
                                </Link>
                            </Box>
                            <Typography sx={{ fontWeight: 'bold', mb: 1, display: 'inline-block' }}>
                                Instrucciones:
                            </Typography>
                            <Button onClick={() => openImage(paso1)} style={{ margin: '0 auto', display: 'flex', background: 'red', color: 'white' }}>Ver tutorial</Button>



                        </Box>

                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                mt: 3,
                                backgroundColor: '#3b82f6',
                                '&:hover': {
                                    backgroundColor: '#2563eb',
                                },
                                width: '100%',
                            }}
                        >
                            SIGUIENTE
                        </Button>

                        <Typography sx={{ mt: 2, backgroundImage: '#0f212f' }}>
                            Necesitas estar registrado con este enlace porque luego se pedirá una captura de <strong>Ajustes - Ofertas</strong> para verificar que estás vinculado a este código.
                        </Typography>


                    </Box>
                );
            case 0:
                return (
                    <Box sx={{ p: 2 }}>

                        <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                            SI SOS DE ARGENTINA Y NO ESTAS REGISTRADO EN STAKE MIRA ESTE VIDEO!
                        </Typography>

                        <Box
                            sx={{
                                backgroundColor: '#1e293b',
                                borderRadius: 2,
                                p: 2,
                                color: '#cbd5e1',
                                mb: 2,
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', border: '2px dashed #2a2e38' }}
                        >
                            <video src="https://res.cloudinary.com/dks7seyl8/video/upload/v1756416979/2025-08-28_02-49-17_u2digf.mp4" controls style={{width:'100%'}}></video>
                            <Box sx={{ backgroundColor: '#1e293b', p: 2, borderRadius: 1, mt: 2, border: '2px dashed #2a2e38' }}>
                                <Typography>
                                    Es obligatorio estar registrado con el siguiente enlace y el código <strong>"eldenguee"</strong> como muestra arriba
                                </Typography>

                                <Link
                                    href="https://stake1022.com/?offer=eldenguee&c=1590cd3460"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'block',
                                        mt: 1,
                                        mb: 2,
                                        color: '#4ade80',
                                        wordBreak: 'break-all',
                                    }}
                                >
                                    https://stake1022.com/?offer=eldenguee&c=1590cd3460
                                </Link>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleNext}


                            sx={{
                                backgroundColor: '#3b82f6',
                                flex: 1,
                                '&:hover': {
                                    backgroundColor: '#2563eb',
                                },
                            }}
                        >
                            Siguiente
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                            Sube la captura de pantalla de Ajustes - Ofertas
                        </Typography>
                        <Button onClick={() => openImage(paso2)} style={{ margin: '0 auto', display: 'flex', background: 'red', color: 'white' }}>Ver tutorial</Button>
                        {/* <img src={paso2} style={{ width: '60%', borderRadius: '5px', margin: '0 auto', display: 'flex' }} /> */}

                        <Box
                            sx={{
                                backgroundColor: '#1e293b',
                                borderRadius: 2,
                                p: 2,
                                color: '#cbd5e1',
                                mb: 2,
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', border: '2px dashed #2a2e38' }}
                        >
                            <Box
                                sx={{
                                    borderBottom: '1px solid #334155',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    pb: 1,
                                    mb: 1,
                                    fontWeight: 'bold',
                                }}
                            >
                                <Typography>Tu imagen</Typography>
                                <Typography>
                                    {offerScreenshot ? `Archivo seleccionado: ${offerScreenshot.name}` : 'No hay archivo'}
                                </Typography>
                            </Box>
                            {
                                isUploading ?
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                        <CircularProgress size={30} color="inherit" />
                                    </Box>
                                    :
                                    <img src={offerScreenshotUrl} style={{ width: '20%', borderRadius: '5px', margin: '0 auto', display: 'flex' }} />
                            }

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<FaCloudUploadAlt />}
                                    sx={{
                                        backgroundColor: '#334155',
                                        color: '#fff',
                                        flex: 1,
                                        '&:hover': {
                                            backgroundColor: '#475569',
                                        },
                                    }}
                                >
                                    Cargar imagen
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange(setOfferScreenshot, setOfferScreenshotUrl)}
                                    />
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!offerScreenshot}

                                    sx={{
                                        backgroundColor: '#3b82f6',
                                        flex: 1,
                                        '&:hover': {
                                            backgroundColor: '#2563eb',
                                        },
                                    }}
                                >
                                    Siguiente
                                </Button>
                            </Box>
                        </Box>

                        <Box style={{ backgroundColor: '#0c1b26', padding: 10, borderRadius: 5 }}>
                            <Typography
                                sx={{
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                                onClick={() => openImage(ej2)}
                            >
                                Click para ver ejemplo de captura
                            </Typography>
                        </Box>
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                            Sube la captura del QR y tu dirección BNB
                        </Typography>
                        <Button onClick={() => openImage(paso3)} style={{ margin: '0 auto', display: 'flex', background: 'red', color: 'white' }}>Ver tutorial</Button>
                        {/* <img src={paso3} style={{ width: '100%', borderRadius: '5px' }} /> */}

                        <Box
                            sx={{
                                backgroundColor: '#1e293b',
                                borderRadius: 2,
                                p: 2,
                                color: '#cbd5e1',
                                mb: 2,
                            }}
                            style={{ marginTop: '15px', border: '2px dashed #2a2e38' }}
                        >
                            <Box
                                sx={{
                                    borderBottom: '1px solid #334155',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    pb: 1,
                                    mb: 1,
                                    fontWeight: 'bold',
                                }}
                            >
                                <Typography>Tu imagen</Typography>
                                <Typography>
                                    {bnbScreenshot ? `Archivo seleccionado: ${bnbScreenshot.name}` : 'No hay archivo'}
                                </Typography>

                            </Box>
                            {
                                isUploading ?
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                        <CircularProgress size={30} color="inherit" />
                                    </Box>
                                    :
                                    <img src={bnbScreenshotUrl} style={{ width: '20%', borderRadius: '5px', margin: '0 auto', display: 'flex' }} />

                            }

                        </Box>

                        <Typography sx={{ color: '#fff', fontWeight: 500, mb: 0 }}>
                            Pegá la direccion BNB que figura en tu cuenta acá abajo - Ejemplo: <span style={{ textDecoration: 'underline', }}> 0x3f1bD53eB8A3F5d60147A5C0c47279a...</span>
                        </Typography>

                        <TextField
                            fullWidth
                            value={bnbAddress}
                            onChange={(e) => setBnbAddress(e.target.value)}
                            variant="outlined"
                            sx={{
                                mt: 2,
                                backgroundColor: '#0c1b26', // fondo oscuro como el de la imagen
                                borderRadius: '8px',
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#2c4454', // borde azul/gris
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3e5d6f',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5da6d6', // color más claro al hacer foco
                                    },
                                    input: {
                                        color: 'white',
                                    },
                                },
                            }}
                            InputProps={{
                                style: {
                                    height: '44px',
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<FaCloudUploadAlt />}
                                sx={{
                                    backgroundColor: '#334155',
                                    color: '#fff',
                                    flex: 1,
                                    '&:hover': {
                                        backgroundColor: '#475569',
                                    },
                                }}
                            >
                                Cargar imagen
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange(setBnbScreenshot, setBnbScreenshotUrl)}
                                />
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleRequestTipeo}
                                disabled={!bnbScreenshot || deshabilitarBoton}

                                sx={{
                                    backgroundColor: '#3b82f6',
                                    flex: 1,
                                    '&:hover': {
                                        backgroundColor: '#2563eb',
                                    },
                                }}
                            >
                                {deshabilitarBoton ? 'Enviando solicitud' : 'Terminar'}
                            </Button>
                        </Box>

                        <Box style={{ backgroundColor: '#0c1b26', padding: 10, borderRadius: 5 }}>
                            <Typography
                                sx={{
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                                onClick={() => openImage(ej3)}

                            >
                                Click para ver ejemplo de captura
                            </Typography>
                        </Box>

                    </Box>



                );
            default:
                return null;
        }
    };

    const redirectHome = () => {
        window.location.href = '/'
    }
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
                                marginTop: props.isMobile ? '1%' : '2%'
                            }}>
                                <Grid className='container' style={{
                                    padding: props.isMobile ? 10 : 50,
                                    gap: '10px',
                                    justifyContent: 'center',

                                }}>
                                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>


                                    </Grid>

                                    <Box sx={{ mx: 'auto', my: 1, mt: '8%' }}>
                                        <Paper
                                            elevation={!success && 8}
                                            sx={{
                                                maxWidth: !props.isMobile ? 600 : '100%',
                                                margin: '0 auto',
                                                borderRadius: success ? 'none' : 2,
                                                overflow: 'hidden',
                                                backgroundColor: success ? 'transparent' : '#1a2c38',
                                                color: '#fff',
                                                p: 2,
                                            }}
                                        >
                                            {
                                                !success &&
                                                <>
                                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                        📝 Solicitud de tipeo
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            backgroundColor: '#1e293b',
                                                            borderRadius: '999px',
                                                            p: '6px',
                                                            mb: 3,
                                                        }}
                                                    >
                                                        {steps.map((label, index) => (
                                                            <Box
                                                                key={label}
                                                                sx={{
                                                                    flex: 1,
                                                                    textAlign: 'center',
                                                                    borderRadius: '999px',
                                                                    backgroundColor: activeStep === index ? '#334155' : 'transparent',
                                                                    color: '#fff',
                                                                    fontWeight: 'bold',
                                                                    py: 1,
                                                                    transition: 'background-color 0.3s',
                                                                }}
                                                            >
                                                                <Typography variant="body1">{label}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </>
                                            }

                                            {success ? (
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#0c1b26',
                                                        borderRadius: '12px',
                                                        padding: 3,
                                                        width: '80%',
                                                        margin: '0 auto',
                                                        textAlign: 'center',
                                                        color: 'white',
                                                    }}
                                                >
                                                    {/* Título con ícono y botón cerrar */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <Typography sx={{ fontWeight: 'bold' }}>Solicitud de tipeo</Typography>
                                                        <Button sx={{ color: 'white' }} size="small">✕</Button>
                                                    </Box>

                                                    {/* Imagen */}
                                                    <Box sx={{ mb: 2 }}>
                                                        <img
                                                            src={successImg}// Colocá la ruta correcta a tu imagen
                                                            alt="Caja fuerte"
                                                            style={{ width: '100%', height: 'auto', margin: '0 auto' }}
                                                        />
                                                    </Box>

                                                    {/* Mensaje principal */}
                                                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>
                                                        ¡Se completó tu solicitud de tipeo!
                                                    </Typography>

                                                    {/* Cuadro con correo */}
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            backgroundColor: '#15232f',
                                                            color: 'white',
                                                            padding: 2,
                                                            borderRadius: '8px',
                                                            mb: 3,
                                                        }}
                                                        style={{ border: '2px dashed #2a2e38' }}
                                                    >
                                                        <Typography sx={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                                            Cuando tu tipeo esté listo te llegará un correo a:
                                                        </Typography>
                                                        <Typography sx={{ fontWeight: 'bold', mt: 1, textAlign: 'left' }}>
                                                            {userEmail}
                                                        </Typography>

                                                    </Paper>
                                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>

                                                        <Typography sx={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                                            Dirección de retiro:
                                                        </Typography>
                                                        <Typography sx={{ fontWeight: 'bold', mt: 1, textAlign: 'left' }}>
                                                            {bnbAddress}
                                                        </Typography>
                                                    </Box>

                                                    {/* Botón */}
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: '#007bff',
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontWeight: 'bold',
                                                            '&:hover': {
                                                                backgroundColor: '#0066d6',
                                                            },
                                                        }}
                                                        onClick={redirectHome}
                                                    >
                                                        Listo
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <>
                                                    {error && (
                                                        <Alert severity="error" sx={{ mb: 2 }}>
                                                            {error}
                                                        </Alert>
                                                    )}
                                                    {getStepContent(activeStep)}
                                                    {isOpen && selectedImage && (
                                                        <div
                                                            style={{
                                                                position: 'fixed',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100vw',
                                                                height: '100vh',
                                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                zIndex: 99999,
                                                            }}
                                                        >
                                                            {/* Botón X para cerrar */}
                                                            <button
                                                                onClick={closeImage}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 20,
                                                                    right: 20,
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    fontSize: '32px',
                                                                    color: '#fff',
                                                                    cursor: 'pointer',
                                                                    zIndex: 99999,
                                                                }}
                                                                aria-label="Cerrar visor"
                                                            >
                                                                &times;
                                                            </button>

                                                            {/* Imagen ampliada */}
                                                            <img
                                                                src={selectedImage}
                                                                alt="Expanded"
                                                                style={{
                                                                    maxWidth: '90%',
                                                                    maxHeight: '90%',
                                                                    borderRadius: 10,
                                                                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                                                }}
                                                                onClick={(e) => e.stopPropagation()} // evita que se cierre al hacer click sobre la imagen
                                                            />
                                                        </div>
                                                    )}
                                                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                                {
                                                    activeStep !== 0 &&
                                                    <Button
                                                        disabled={activeStep === 0 || loading}
                                                        onClick={handleBack}
                                                        variant="outlined"
                                                    >
                                                        Atrás
                                                    </Button>
                                                }

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
                                            </Box> */}
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



