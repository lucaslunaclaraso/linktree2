// SlotModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Select, MenuItem } from "@mui/material";

export default function SlotModal({ abierto, onCerrar, jugador, slots, onGuardar }) {
    const [slotSeleccionado, setSlotSeleccionado] = useState("");

    const handleGuardar = () => {
        if (!slotSeleccionado) return;
        onGuardar(slotSeleccionado);
        setSlotSeleccionado(""); // limpiar select
    };

    return (
        <Modal
            open={abierto}
            onClose={onCerrar}
            aria-labelledby="modal-slot-title"
            aria-describedby="modal-slot-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                p: 4,
                borderRadius: 2,
                minWidth: 300
            }}>
                <Typography id="modal-slot-title" variant="h6" gutterBottom>
                    Elegir slot para {jugador?.user_name || ""}
                </Typography>

                <Select
                    fullWidth
                    value={slotSeleccionado}
                    onChange={(e) => setSlotSeleccionado(e.target.value)}
                >
                    <MenuItem value="" disabled>Seleccionar slot</MenuItem>
                    {slots.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Guardar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onCerrar}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
