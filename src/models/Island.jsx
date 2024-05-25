import * as THREE from 'three';
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
    const mouse = new THREE.Vector2();
    const { camera, raycaster, gl, viewport } = useThree();
    const { scene, materials } = useGLTF(islandScene);
    const interactableMeshNames = [
        'cup_2',
        'leftSidePapers',
        'rightSidePapers',
        'knife_2',
        'helmet_2',
        'lamp_2',
        'shield_2',
        'candles_2',
        'ring_2',
        'mushroom_2',
        'gloves_2',
        'potion_2',
        'bottlegreen_2',
        'necklace_2',
        'bigPapers',
        'letter_2',
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

    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const handlePointerDown = (event) => {
        event.preventDefault();
        event.stopPropagation();

        mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

        //update raycaster to reflect mouse position
        raycaster.setFromCamera(mouse, camera);

        //objects intersecting ray
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            if (intersects[0].object.isMesh) {
                if (interactableMeshNames.includes(intersects[0].object.name)) {
                    console.log(
                        `Interactable mesh clicked: ${intersects[0].object.name}`
                    );
                } else {
                    console.log(
                        `Non-interactable mesh clicked: ${intersects[0].object.name}`
                    );
                }
            }
        }
        setIsRotating(true);
    };

    const handlePointerUp = (e) => {
        console.log('pointer up');
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(false);
    };

    const handlePointerMove = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isRotatingRef.current) {
            console.log('rotating');
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const delta = (clientX - lastX.current) / viewport.width;
            if (islandRef.current) {
                islandRef.current.rotation.y += delta * Math.PI * 0.009;
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
