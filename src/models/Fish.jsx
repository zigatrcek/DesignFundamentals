import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import fishScene from '../assets/3d/fish.glb';

const Fish = ({ isRotating, ...props }) => {
    const ref = React.useRef();
    const { scene, animations } = useGLTF(fishScene);
    const { actions } = useAnimations(animations, ref);

    useEffect(() => {
        console.log({ isRotating });
        if (isRotating) {
            actions['Animation'].play();
        } else {
            actions['Animation'].stop();
        }
    }, [actions, isRotating]);

    return (
        <mesh {...props} ref={ref}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Fish;
