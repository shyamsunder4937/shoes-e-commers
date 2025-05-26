import '@src/shoes.scss';
import { useState } from 'react';
import { Box, Tooltip, Zoom } from '@mui/material';

const COLORS = [
    { hex: '#000000', name: 'Black' },
    { hex: '#D3D3D3', name: 'Light Gray' },
    { hex: '#808080', name: 'Gray' },
    { hex: '#CC0000', name: 'Sport Red' },
    { hex: '#D2B48C', name: 'Tan' },
    { hex: '#000080', name: 'Navy Blue' },
    { hex: '#87CEEB', name: 'Sky Blue' },
    { hex: '#FFB6C1', name: 'Light Pink' },
    { hex: '#FFA500', name: 'Orange' },
];

interface ColorComProps {
    onColorSelect?: (color: string) => void;
}

export default function ColorCom({ onColorSelect }: ColorComProps) {
    const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        onColorSelect?.(color);
    };

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 600,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            zIndex: 1000,
        }}>
            <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {COLORS.map((color) => (
                    <Tooltip 
                        key={color.hex} 
                        title={color.name}
                        arrow
                        TransitionComponent={Zoom}
                    >
                        <Box
                            onClick={() => handleColorClick(color.hex)}
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: color.hex,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: '2px solid',
                                borderColor: selectedColor === color.hex 
                                    ? 'primary.main' 
                                    : 'transparent',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                },
                                position: 'relative',
                                '&::after': selectedColor === color.hex ? {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '30%',
                                    height: '30%',
                                    borderRadius: '50%',
                                    bgcolor: 'white',
                                    opacity: 0.8,
                                } : {},
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
}

