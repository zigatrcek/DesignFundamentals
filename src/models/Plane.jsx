import React, { useRef, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import planeScene from '../assets/3d/plane1.glb';
import { a } from '@react-spring/three';

const Plane = ({ isRotating, planePosition, ...props }) => {
    const ref = useRef();
    const { scene, animations } = useGLTF(planeScene);
    const { actions } = useAnimations(animations, ref);

    useEffect(() => {
        if (ref.current) {
            ref.current.position.set(...planePosition);
            console.log('Updated Plane Position:', ref.current.position);
        }
        if (isRotating) {
            actions['Take001'].play();
        } else {
            actions['Take001'].stop();
        }
    }, [actions, isRotating, planePosition]);

    return (
        <mesh {...props} ref={ref}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Plane;
