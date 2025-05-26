import { Canvas, useThree, useFrame } from "@react-three/fiber";
import ShowRoom from "@components/three/ShowRoom";
import { OrbitControls, Environment } from "@react-three/drei";
import Appbar from "@components/Appbar";
import ColorCom from "@components/ColoeCom";
import { useState, Suspense, useRef, useEffect } from 'react';
import { 
    CircularProgress, 
    Box, 
    Typography,
    IconButton,
    Tooltip,
    Fade,
    Paper,
    Zoom,
    Badge,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShareIcon from '@mui/icons-material/Share';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import PauseIcon from '@mui/icons-material/Pause';
import * as THREE from 'three';

// Scene component to handle rotation
function Scene({ color, onLoaded, isAutoRotating }: { 
    color: string; 
    onLoaded: () => void;
    isAutoRotating: boolean;
}) {
    const controlsRef = useRef<any>(null);
    const { camera, gl } = useThree();

    const handleRotate = (direction: 'left' | 'right') => {
        if (!controlsRef.current) return;
        const rotationAmount = direction === 'left' ? -Math.PI/4 : Math.PI/4;
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationAmount);
        controlsRef.current.update();
    };

    useEffect(() => {
        const handleRotateEvent = (event: CustomEvent) => {
            handleRotate(event.detail as 'left' | 'right');
        };

        window.addEventListener('rotate-model', handleRotateEvent as EventListener);
        return () => {
            window.removeEventListener('rotate-model', handleRotateEvent as EventListener);
        };
    }, []);

    // Handle auto-rotation
    useFrame(() => {
        if (isAutoRotating && controlsRef.current) {
            camera.position.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                THREE.MathUtils.degToRad(0.5)
            );
            controlsRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls 
                ref={controlsRef}
                enablePan={false}
                minPolarAngle={Math.PI/4}
                maxPolarAngle={Math.PI/1.5}
            />
            <directionalLight position={[3, 3, 3]} />
            <ShowRoom 
                color={color}
                onLoaded={onLoaded}
            />
            <Environment preset="studio" />
        </>
    );
}

export default function Home() {
    const [selectedColor, setSelectedColor] = useState("#FF0000");
    const [isLoading, setIsLoading] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(false);

    const handleSceneLoaded = () => {
        setIsLoading(false);
    };

    const handleCameraView = () => {
        setViewCount(prev => prev + 1);
    };

    const toggleAutoRotate = () => {
        setIsAutoRotating(!isAutoRotating);
    };

    const rotationActions = [
        { icon: <RotateLeftIcon />, name: 'Rotate Left', onClick: () => window.dispatchEvent(new CustomEvent('rotate-model', { detail: 'left' })) },
        { icon: <RotateRightIcon />, name: 'Rotate Right', onClick: () => window.dispatchEvent(new CustomEvent('rotate-model', { detail: 'right' })) },
        { 
            icon: isAutoRotating ? <PauseIcon /> : <ThreeSixtyIcon />, 
            name: isAutoRotating ? 'Stop Auto-Rotate' : 'Auto-Rotate',
            onClick: toggleAutoRotate 
        },
    ];

    return (
        <Box sx={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#f8f9fa',
            overflow: 'hidden'
        }}>
            <Appbar />
            
            {/* Main Content */}
            <Box sx={{ 
                flex: 1, 
                position: 'relative',
                m: { xs: 1, sm: 2 },
                borderRadius: 4,
                overflow: 'hidden',
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
            }}>
                {/* Rotation Controls */}
                <SpeedDial
                    ariaLabel="Rotation controls"
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        zIndex: 10,
                    }}
                    icon={<SpeedDialIcon />}
                    direction="right"
                >
                    {rotationActions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={action.onClick}
                            tooltipOpen
                        />
                    ))}
                </SpeedDial>

                {/* Action Buttons */}
                <Zoom in={!isLoading} style={{ transitionDelay: '500ms' }}>
                    <Box sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        zIndex: 10,
                        display: 'flex',
                        gap: 1,
                        transition: 'all 0.3s ease'
                    }}>
                        <Tooltip title="Save View" arrow>
                            <IconButton 
                                onClick={handleCameraView}
                                sx={{ 
                                    bgcolor: 'white',
                                    '&:hover': { 
                                        bgcolor: 'white',
                                        transform: 'scale(1.1)'
                                    },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Badge badgeContent={viewCount} color="primary">
                                    <CameraAltOutlinedIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Help" arrow>
                            <IconButton 
                                onClick={() => setShowHelp(!showHelp)}
                                color={showHelp ? "primary" : "default"}
                                sx={{ 
                                    bgcolor: 'white',
                                    '&:hover': { 
                                        bgcolor: 'white',
                                        transform: 'scale(1.1)'
                                    },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <HelpOutlineIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Share Design" arrow>
                            <IconButton 
                                sx={{ 
                                    bgcolor: 'white',
                                    '&:hover': { 
                                        bgcolor: 'white',
                                        transform: 'scale(1.1)'
                                    },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Design" arrow>
                            <IconButton 
                                sx={{ 
                                    bgcolor: 'white',
                                    '&:hover': { 
                                        bgcolor: 'white',
                                        transform: 'scale(1.1)'
                                    },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <RestartAltIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Zoom>

                {/* Help Panel */}
                <Fade in={showHelp}>
                    <Paper sx={{ 
                        position: 'absolute',
                        left: { xs: '50%', sm: 20 },
                        top: { xs: 20, sm: '50%' },
                        transform: { 
                            xs: 'translateX(-50%)', 
                            sm: 'translateY(-50%)' 
                        },
                        zIndex: 10,
                        p: 3,
                        maxWidth: 320,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 2 
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        mr: 1, 
                                        color: 'primary.main',
                                        fontSize: 28
                                    }} 
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    How to Customize
                                </Typography>
                            </Box>
                            <IconButton 
                                size="small" 
                                onClick={() => setShowHelp(false)}
                                sx={{ 
                                    '&:hover': { 
                                        transform: 'scale(1.1)',
                                        bgcolor: 'transparent' 
                                    }
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Typography 
                            variant="body2" 
                            component="ol" 
                            sx={{ 
                                pl: 2, 
                                mb: 0,
                                '& li': {
                                    mb: 1,
                                    color: 'text.secondary'
                                },
                                '& li:last-child': {
                                    mb: 0
                                }
                            }}
                        >
                            <li>Select a color from the palette below</li>
                            <li>Click any part of the shoe to apply the color</li>
                            <li>Use mouse or touch to rotate the view</li>
                            <li>Scroll to zoom in/out</li>
                        </Typography>
                    </Paper>
                </Fade>

                {/* Loading Indicator */}
                <Fade in={isLoading}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        textAlign: 'center',
                        bgcolor: 'white',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        minWidth: 200
                    }}>
                        <CircularProgress 
                            size={48} 
                            thickness={4} 
                            sx={{ color: 'primary.main' }}
                        />
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mt: 2, 
                                color: 'text.secondary',
                                fontWeight: 500
                            }}
                        >
                            Loading 3D Model...
                        </Typography>
                    </Box>
                </Fade>
                
                {/* 3D Canvas */}
                <Canvas>
                    <color attach={'background'} args={["#ffffff"]} />
                    <Suspense fallback={null}>
                        <Scene 
                            color={selectedColor}
                            onLoaded={handleSceneLoaded}
                            isAutoRotating={isAutoRotating}
                        />
                    </Suspense>
                </Canvas>
            </Box>

            {/* Color Selector */}
            <Zoom in={!isLoading} style={{ transitionDelay: '300ms' }}>
                <Box>
                    <ColorCom onColorSelect={setSelectedColor}/>
                </Box>
            </Zoom>
        </Box>
    );
}