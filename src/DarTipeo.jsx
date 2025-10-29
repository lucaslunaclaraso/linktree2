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

function DarTipeo() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [nuevoUsuario, setNuevoUsuario] = useState('');
    const [coins, setCoins] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        axios.get('https://backmu.vercel.app/solicitudes/usuarios')
            .then(res => setUsuarios(res.data))
            .catch(err => console.error('Error al obtener usuarios:', err));
    }, []);

    const handleDarCoins = () => {
        const nombre = usuarioSeleccionado || nuevoUsuario;

        axios.post('https://backmu.vercel.app/solicitudes/dar-tipeo', {
            nombre,
            cantidad: parseInt(coins),
        })
            .then(res => {
                setMensaje(res.data.mensaje);
                setModalAbierto(false);
                setUsuarioSeleccionado('');
                setNuevoUsuario('');
                setCoins('');
            })
            .catch(err => {
                setMensaje(`Error: ${err.response?.data?.error || err.message}`);
            });
    };

    const usuariosFiltrados = usuarios.filter((u) =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const usuarioExiste = usuarios.some(
        (u) => u.nombre.toLowerCase() === nuevoUsuario.toLowerCase()
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
                    }}>Dar Tipeos</Typography>

                    <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ color: "#fff" }}>Seleccionar Usuario</InputLabel>
                        <Select
                            value={usuarioSeleccionado}
                            onChange={(e) => {
                                setUsuarioSeleccionado(e.target.value);
                                setNuevoUsuario('');
                            }}
                            label="Seleccionar Usuario"
                            MenuProps={{
                                PaperProps: { style: { maxHeight: 250 } },
                            }}
                            sx={{
                                color: "#fff",
                                ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                                ".MuiSvgIcon-root": { color: "#fff" },
                            }}
                        >
                            <MenuItem disableRipple disableTouchRipple>
                                <TextField
                                    size="small"
                                    placeholder="Buscar..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    sx={{
                                        width: "100%",
                                        "& .MuiInputBase-input": { color: "#fff" },
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    }}
                                />
                            </MenuItem>

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

                    {/* Campo para ingresar nuevo usuario */}
                    <Typography
                        variant="body2"
                        sx={{ color: '#aaa', mt: 1, textAlign: 'center' }}
                    >
                        — O crear nuevo usuario —
                    </Typography>
                    <TextField
                        label="Nuevo Usuario"
                        value={nuevoUsuario}
                        onChange={(e) => {
                            setNuevoUsuario(e.target.value);
                            setUsuarioSeleccionado('');
                        }}
                        fullWidth
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#fff' },
                                '&:hover fieldset': { borderColor: '#ccc' },
                            },
                        }}
                        helperText={usuarioExiste ? "⚠️ Este usuario ya existe." : ""}
                        error={usuarioExiste}
                    />

                    {/* Campo de cantidad */}
                    {(usuarioSeleccionado || nuevoUsuario) && (
                        <TextField
                            type="number"
                            label="Cantidad de Tipeos"
                            value={coins}
                            onChange={(e) => setCoins(e.target.value)}
                            fullWidth
                            InputLabelProps={{ style: { color: '#fff' } }}
                            InputProps={{ style: { color: '#fff' } }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#fff' },
                                    '&:hover fieldset': { borderColor: '#ccc' },
                                },
                            }}
                        />
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        disabled={
                            (!usuarioSeleccionado && !nuevoUsuario) ||
                            usuarioExiste ||
                            !coins
                        }
                        onClick={() => setModalAbierto(true)}
                    >
                        DAR TIPEOS
                    </Button>

                    {mensaje && (
                        <Typography color="success.main">{mensaje}</Typography>
                    )}

                    <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
                        <Box sx={modalStyle}>
                            <Typography variant="h6" gutterBottom>
                                Confirmar entrega
                            </Typography>
                            <Typography>
                                Vas a dar <strong>{coins}</strong> tipeos al usuario <strong>{usuarioSeleccionado || nuevoUsuario}</strong>.
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

export default DarTipeo;
