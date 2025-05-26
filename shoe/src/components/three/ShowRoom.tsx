import * as THREE from "three";
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useThree } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment, AccumulativeShadows, RandomizedLight, Lightformer, SpotLight } from "@react-three/drei";
import {  useEffect, useRef , useState} from "react";

interface ShowRoomProps {
    color: string;
    onLoaded?: () => void;
}

export default function ShowRoom({ color, onLoaded }: ShowRoomProps) {
    const { raycaster, scene } = useThree();
    const cameraControlsRef = useRef<CameraControls>(null!);
    const gltf = useLoader(
        GLTFLoader, 
        '/models/custom.glb',
        undefined,
        (loader) => {
            setTimeout(() => onLoaded?.(), 100);
        }
    );

    useEffect(() => {
        scene.background = new THREE.Color('#f5f5f5');
        cameraControlsRef.current.setTarget(0, 0, 0, false);
        cameraControlsRef.current.setPosition(3, 2, 3);

        // Initialize materials
        gltf.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;

                // Handle materials
                if (object.material) {
                    // For multi-material meshes
                    if (Array.isArray(object.material)) {
                        object.material = object.material.map(mat => {
                            const newMat = new THREE.MeshStandardMaterial();
                            newMat.copy(mat);
                            newMat.roughness = 0.3;
                            newMat.metalness = 0.2;
                            newMat.envMapIntensity = 1.5;
                            return newMat;
                        });
                    }
                    // For single material meshes
                    else {
                        const newMat = new THREE.MeshStandardMaterial();
                        newMat.copy(object.material);
                        newMat.roughness = 0.3;
                        newMat.metalness = 0.2;
                        newMat.envMapIntensity = 1.5;
                        object.material = newMat;
                    }
                }
            }
        });
    }, [gltf.scene, scene]);

    const shoesClick = (event: { stopPropagation: () => void }) => {
        event.stopPropagation();
        
        const intersects = raycaster.intersectObjects(gltf.scene.children, true);
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object as THREE.Mesh;
            
            // Handle material change
            if (clickedMesh.material) {
                // For single material
                if (clickedMesh.material instanceof THREE.MeshStandardMaterial) {
                    clickedMesh.material.color.set(color);
                    clickedMesh.material.needsUpdate = true;
                }
                // For multi-material array
                else if (Array.isArray(clickedMesh.material)) {
                    const faceIndex = Math.floor(intersects[0].faceIndex! / 2);
                    const material = clickedMesh.material[faceIndex];
                    if (material instanceof THREE.MeshStandardMaterial) {
                        material.color.set(color);
                        material.needsUpdate = true;
                    }
                }
            }

            // Camera focus on clicked part
            cameraControlsRef.current.fitToBox(clickedMesh, true, {
                paddingLeft: 0.5,
                paddingRight: 0.5,
                paddingBottom: 0.5,
                paddingTop: 0.5
            });
        }
    };

    return (
        <>
            <CameraControls 
                ref={cameraControlsRef}
                enabled={true}
                dollyToCursor={true}
                minDistance={2}   
                maxDistance={4}
                minPolarAngle={Math.PI/4}
                maxPolarAngle={Math.PI/1.5}
                boundaryFriction={0.8}
                smoothTime={0.5}
            />  

            {/* Enhanced lighting setup */}
            <ambientLight intensity={1} />
            <directionalLight 
                position={[5, 5, 5]} 
                intensity={2}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-5, 5, -5]} intensity={1.5} />
            <directionalLight position={[5, -5, 5]} intensity={1} />

            {/* Key light for highlights */}
            <SpotLight
                position={[3, 5, 2]}
                intensity={2}
                angle={0.5}
                penumbra={0.8}
                distance={10}
                castShadow
            />

            <primitive 
                object={gltf.scene} 
                onClick={shoesClick}
                scale={1}
                position={[0, 0, 0]}
                castShadow
                receiveShadow
            />

            {/* Enhanced shadow setup */}
            <ContactShadows
                position={[0, -0.099, 0]}
                opacity={0.4}
                scale={10}
                blur={3}
                far={10}
                resolution={1024}
                color="#000000"
            />

            {/* Studio environment for realistic reflections */}
            <Environment preset="studio" background={false} />
        </>
    );
}