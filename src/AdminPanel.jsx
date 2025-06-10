import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link,
} from '@mui/material';
import axios from 'axios';
import Nlayout from './Nlayout';

const AdminPanel = (props) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null);

    // Obtener solicitudes del backend
    useEffect(() => {
        const fetchSolicitudes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://backmu.vercel.app/solicitudes/');
                setSolicitudes(response.data);
            } catch (err) {
                setError('Error al cargar las solicitudes: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, []);

    // Manejar acción de aceptar/rechazar
    const handleAction = async (id, action) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.put(
                `https://backmu.vercel.app/solicitudes/${id}/update`,
                { status: action },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setSolicitudes((prev) =>
                prev.map((solicitud) =>
                    solicitud.id === id ? { ...solicitud, status: response.data.status } : solicitud
                )
            );
        } catch (err) {
            setError(`Error al ${action === 'accepted' ? 'aceptar' : 'rechazar'} la solicitud: ` + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Abrir diálogo para ver captura
    const handleOpenScreenshot = (url) => {
        console.log(url)
        setSelectedScreenshot(url);
        setOpenDialog(true);
    };

    // Cerrar diálogo
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedScreenshot(null);
    };
    
    return (
        <Nlayout>
            <Box sx={{ maxWidth: 1200, mx: 'auto', my: 4, p: 2 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                       Solicitudes de Tipeo
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : solicitudes.length === 0 ? (
                        <Typography align="center">No hay solicitudes disponibles.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Captura Ajustes</TableCell>
                                        <TableCell>Captura BNB</TableCell>
                                        <TableCell>Dirección BNB</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {solicitudes?.filter((sorteo) => sorteo.status === 'pending' ).reverse()?.map((solicitud) => (
                                        <TableRow key={solicitud.id}>
                                            <TableCell>{solicitud.nombre}</TableCell>
                                            <TableCell>{solicitud.email}</TableCell>
                                            <TableCell>
                                                <Button
                                                   
                                                    onClick={() => handleOpenScreenshot(solicitud.offerScreenshot)}
                                                    underline="hover"
                                                >
                                                    Ver Captura
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    
                                                    onClick={() => handleOpenScreenshot(solicitud.bnbScreenshot)}
                                                    underline="hover"
                                                >
                                                    Ver Captura
                                                </Button>
                                            </TableCell>
                                            <TableCell>{solicitud.bnbAddress}</TableCell>
                                            <TableCell>
                                                {solicitud.status === 'pending' ? 'Pendiente' :
                                                    solicitud.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                                            </TableCell>
                                            <TableCell>
                                                {solicitud.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleAction(solicitud.id, 'accepted')}
                                                            disabled={loading}
                                                            sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                                                        >
                                                            Aceptar
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleAction(solicitud.id, 'rejected')}
                                                            disabled={loading}
                                                        >
                                                            Rechazar
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Diálogo para mostrar capturas */}
                <Dialog open={openDialog}  maxWidth="md" fullWidth>
                    <DialogTitle>Visualizar Captura</DialogTitle>
                    <DialogContent>
                        {selectedScreenshot && (
                            <img
                                src={selectedScreenshot}
                                alt="Captura de pantalla"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} variant="outlined">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Nlayout>
    );
};

export default AdminPanel;