import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    TextField,
    Modal,
    Typography,
} from '@mui/material';
import Nlayout from './Nlayout';
import axios from 'axios';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

function DarCoins() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [coins, setCoins] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        axios.get('https://backmu.vercel.app/solicitudes/usuarios') // ⚠️ Cambia por tu URL real
            .then(res => setUsuarios(res.data))
            .catch(err => console.error('Error al obtener usuarios:', err));
    }, []);

    const handleDarCoins = () => {
        axios.post('https://backmu.vercel.app/solicitudes/dar-coins', {
            nombre: usuarioSeleccionado,
            cantidad: parseInt(coins),
        })
            .then(res => {
                setMensaje(res.data.mensaje);
                setModalAbierto(false);
                setUsuarioSeleccionado('');
                setCoins('');
            })
            .catch(err => {
                setMensaje(`Error: ${err.response?.data?.error || err.message}`);
            });
    };
    const [busqueda, setBusqueda] = useState("");
    const usuariosFiltrados = usuarios.filter((u) =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    return (
        <Nlayout>
            <Box p={4}>
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                    <Typography sx={{
                        background: 'linear-gradient(180deg,#fff -31.86%,#a8a6af 132.28%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: 60,
                        fontFamily: 'PoetsenOne'
                    }} >Dar Coins</Typography>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ color: "#fff" }}>Seleccionar Usuario</InputLabel>
                        <Select
                            value={usuarioSeleccionado}
                            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                            label="Seleccionar Usuario"
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 250 },
                                },
                            }}
                            sx={{
                                color: "#fff",
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#fff",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#ccc",
                                },
                                ".MuiSvgIcon-root": {
                                    color: "#fff",
                                },
                            }}
                        >
                            {/* Campo de búsqueda */}
                            <MenuItem disableRipple disableTouchRipple>
                                <TextField
                                    size="small"
                                    placeholder="Buscar..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    onClick={(e) => e.stopPropagation()} // para que no cierre el menú
                                    onKeyDown={(e) => e.stopPropagation()} // evita que Select capture las teclas
                                    sx={{
                                        width: "100%",
                                        "& .MuiInputBase-input": { color: "#fff" },
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    }}
                                />
                            </MenuItem>

                            {/* Lista filtrada */}
                            {usuariosFiltrados.map((u, idx) => (
                                <MenuItem key={idx} value={u.nombre}>
                                    {u.nombre}
                                </MenuItem>
                            ))}

                            {usuariosFiltrados.length === 0 && (
                                <MenuItem disabled>No se encontraron resultados</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {usuarioSeleccionado && (
                        <TextField
                            type="number"
                            label="Cantidad de DCoins"
                            value={coins}
                            onChange={(e) => setCoins(e.target.value)}
                            fullWidth
                            InputLabelProps={{ style: { color: '#fff' } }}
                            InputProps={{
                                style: { color: '#fff' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#fff',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#ccc',
                                    },
                                },
                            }}
                        />
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!usuarioSeleccionado || !coins}
                        onClick={() => setModalAbierto(true)}
                    >
                        DAR COINS
                    </Button>

                    {mensaje && (
                        <Typography color="success.main">{mensaje}</Typography>
                    )}

                    <Modal
                        open={modalAbierto}
                        onClose={() => setModalAbierto(false)}
                    >
                        <Box sx={modalStyle}>
                            <Typography variant="h6" gutterBottom>
                                Confirmar entrega
                            </Typography>
                            <Typography>
                                Vas a dar <strong>{coins}</strong> DCoins al usuario <strong>{usuarioSeleccionado}</strong>.
                            </Typography>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
                                <Button variant="contained" onClick={handleDarCoins}>Confirmar</Button>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </Box>
        </Nlayout>
    );
}

export default DarCoins;
