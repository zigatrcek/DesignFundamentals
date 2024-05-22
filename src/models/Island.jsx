import React, { useRef, useEffect } from 'react';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import islandScene from '../assets/3d/town.glb';

const Island = ({ isRotating, setIsRotating, setCurrentStage, ...props }) => {
    const islandRef = useRef(null);
    const { gl, viewport } = useThree();
    const { scene, nodes, materials } = useGLTF(islandScene);

    const lastX = useRef(0);
    const rotationSpeed = useRef(0);
    const dampingFactor = 0.95;

    // Event handlers for mouse and touch interactions
    const handlePointerDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(true);
    };

    const handlePointerUp = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(false);
    };

    const handlePointerMove = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isRotating) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const delta = (clientX - lastX.current) / viewport.width;
            if (islandRef.current) {
                islandRef.current.rotation.y += delta * Math.PI * 0.01;
            }
            lastX.current = clientX;
            rotationSpeed.current = delta * 0.01 * Math.PI;
        }
    };

    // Event handlers for keyboard interactions
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setIsRotating(true);
            const rotationDirection = e.key === 'ArrowLeft' ? 1 : -1;
            rotationSpeed.current = 0.01 * Math.PI * rotationDirection;
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
    }, [gl]);

    // Render the component
    return (
        <mesh ref={islandRef} {...props}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Island;
