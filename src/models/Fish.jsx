import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

import fishScene from '../assets/3d/fish.glb';

export function Fish({ initialPosition, initialRotation, ...props }) {
    const fishRef = useRef();
    const { camera, size } = useThree();
    const { animations, nodes, materials } = useGLTF(fishScene);
    const { actions } = useAnimations(animations, fishRef);

    const getViewportEdges = () => {
        const aspect = size.width / size.height;
        const verticalFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical FOV to radians
        const height = 2 * Math.tan(verticalFOV / 2) * camera.position.z; // visible height
        const width = height * aspect; // visible width

        return {
            left: -width / 2,
            right: width / 2,
            top: height / 2,
            bottom: -height / 2,
        };
    };

    useEffect(() => {
        // Play the swimming animation if it exists
        actions.Animation.play();

        // Set initial position and rotation
        fishRef.current.position.set(
            initialPosition.x,
            initialPosition.y,
            initialPosition.z
        );
        fishRef.current.rotation.y = initialRotation;
    }, [actions, initialPosition, initialRotation]);

    useFrame((state) => {
        const speed = 0.05;
        const edges = getViewportEdges();

        if (fishRef.current.rotation.y === Math.PI / 2) {
            fishRef.current.position.x += speed;
            if (fishRef.current.position.x > edges.right) {
                fishRef.current.rotation.y = -Math.PI / 2;
            }
        } else {
            fishRef.current.position.x -= speed;
            if (fishRef.current.position.x < edges.left) {
                fishRef.current.rotation.y = Math.PI / 2;
            }
        }

        fishRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 2;
    });

    return (
        <group ref={fishRef} {...props} dispose={null}>
            <group name="Scene">
                <group
                    name="Armature"
                    position={[0.017, -0.029, 0.474]}
                    rotation={[1.521, 0.161, 3.119]}>
                    <group
                        name="defaultMaterial"
                        position={[-0.002, 0.472, -0.055]}
                        rotation={[1.521, 0.031, 2.982]}
                    />
                    <primitive object={nodes.Bone} />
                    <primitive object={nodes.Bone002} />
                </group>
                <skinnedMesh
                    name="defaultMaterial001"
                    geometry={nodes.defaultMaterial001.geometry}
                    material={materials.initialShadingGroup}
                    skeleton={nodes.defaultMaterial001.skeleton}
                    position={[0.017, -0.029, 0.474]}
                    rotation={[1.521, 0.161, 3.119]}
                />
            </group>
        </group>
    );
}

export default Fish;

useGLTF.preload(fishScene);
