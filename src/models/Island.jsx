import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
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
    const controlsRef = useRef();
    const mouse = new THREE.Vector2();
    const { camera, raycaster, gl, viewport } = useThree();
    const { scene } = useGLTF(islandScene);

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

    const [rotationY, setRotationY] = useState(0);
    const lastX = useRef(0);
    const rotationSpeed = useRef(0);
    const dampingFactor = 0.95;
    const isDragging = useRef(false);

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

    let pointer = false; //pointer state so that island doesn't start rotating on click

    const handlePointerDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        lastX.current = e.clientX;
        mouse.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;

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
        pointer = true;
    };

    const handlePointerUp = (e) => {
        console.log('pointer up');
        e.stopPropagation();
        e.preventDefault();
        _setIsRotating(false);
        isDragging.current = false;
        pointer = false;
    };

    const handlePointerMove = (e) => {
        if (pointer) {
            _setIsRotating(true);
            e.stopPropagation();
            e.preventDefault();
            isDragging.current = true;

            if (isDragging.current) {
                const deltaX = e.clientX - lastX.current;
                rotationSpeed.current = deltaX * 0.002;
                lastX.current = e.clientX;
            }

            if (isRotating) {
                console.log('rotating');
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const deltaX = (clientX - lastX.current) / viewport.width;
                islandRef.current.rotation.y += deltaX * Math.PI * 0.009;
                lastX.current = clientX;
                rotationSpeed.current = deltaX * 0.0001 * Math.PI;
            }
        }
    };

    //keyboard interractions
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const rotationDirection = e.key === 'ArrowLeft' ? 1 : -1;
            rotationSpeed.current = 0.005 * Math.PI * rotationDirection;
            setIsRotating(true);
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setIsRotating(false); // Indicate rotation input has ended
        }
    };

    // Animation frame loop
    useFrame(() => {
        if (islandRef.current) {
            islandRef.current.rotation.y += rotationSpeed.current;

            if (
                !isRotatingRef.current &&
                Math.abs(rotationSpeed.current) > 0.0001
            ) {
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

    return (
        <mesh ref={islandRef} {...props}>
            <primitive object={scene} />
            <OrbitControls ref={controlsRef} enableDamping={true} />
        </mesh>
    );
};

export default Island;
