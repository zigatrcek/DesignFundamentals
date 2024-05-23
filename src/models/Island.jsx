import React, { useRef, useEffect, useCallback } from 'react';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import islandScene from '../assets/3d/town.glb';

const Island = ({
    isRotating,
    _setIsRotating,
    setCurrentStage,
    onClick,
    ...props
}) => {
    const islandRef = useRef(null);
    const { gl, viewport } = useThree();
    const { scene, nodes, materials } = useGLTF(islandScene);
    const interactableMeshNames = [
        'cup',
        'leftSidePapers',
        'knife',
        'helmet',
        'lamp',
        'shield',
        'candles',
        'ring',
        'mushroom',
        'gloves',
        'potion',
        'necklace',
        'bigPapers',
        'letter',
        'Papers.001',
    ];

    const lastX = useRef(0);
    const rotationSpeed = useRef(0);
    const dampingFactor = 0.95;

    const isRotatingRef = React.useRef(isRotating);
    function setIsRotating(value) {
        isRotatingRef.current = value;
        _setIsRotating(value);
    }

    const handleMeshClick = useCallback(
        (event) => {
            event.stopPropagation();
            const mesh = event.object;
            if (
                interactableMeshNames.includes(mesh.name) &&
                mesh.userData.onClick
            ) {
                mesh.userData.onClick();
            }
        },
        [interactableMeshNames]
    );

    // Event handlers for mouse and touch interactions
    const handlePointerDown = (e) => {
        console.log('pointer down');
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(true);
        console.log(isRotating);
    };

    const handlePointerUp = (e) => {
        console.log('pointer up');
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(false);
    };

    const handlePointerMove = (e) => {
        // console.log('pointer move');
        e.stopPropagation();
        e.preventDefault();
        // console.log(isRotating);
        if (isRotatingRef.current) {
            console.log('rotating');
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const delta = (clientX - lastX.current) / viewport.width;
            if (islandRef.current) {
                islandRef.current.rotation.y += delta * Math.PI * 0.01;
            }
            lastX.current = clientX;
            rotationSpeed.current = delta * 0.0001 * Math.PI;
        }
    };

    // Event handlers for keyboard interactions
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setIsRotating(true);
            const rotationDirection = e.key === 'ArrowLeft' ? 1 : -1;
            rotationSpeed.current = 0.005 * Math.PI * rotationDirection;
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setIsRotating(false);
        }
    };

    // Animation frame loop
    useFrame(() => {
        if (islandRef.current) {
            if (isRotating || rotationSpeed.current !== 0) {
                islandRef.current.rotation.y += rotationSpeed.current;
            }

            if (!isRotating) {
                rotationSpeed.current *= dampingFactor;
                if (Math.abs(rotationSpeed.current) < 0.0001) {
                    rotationSpeed.current = 0;
                }
            }
        }
    });

    useEffect(() => {
        const canvas = gl.domElement;
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // You can add any specific identification condition if needed
                    console.log(`Mesh found: ${child.name}`);
                    child.userData.onClick = () => {
                        console.log(`Mesh ${child.name} clicked`);
                        // Additional logic for when a mesh is clicked
                    };
                }
            });

            console.log('Scene is set up');
        }
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [gl, scene]);

    // Render the component
    return (
        <mesh ref={islandRef} {...props} onClick={handleMeshClick}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Island;
