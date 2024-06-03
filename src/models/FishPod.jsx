import React from 'react';
import Fish from './Fish';

const FishPod = () => {
    const initialPositions = [
        { x: -10, y: 0, z: 20, rotationY: Math.PI / 2 },
        { x: -10, y: 2, z: 0, rotationY: Math.PI / 2 },
        { x: -10, y: -2, z: 10, rotationY: Math.PI / 2 },
        { x: 10, y: 0, z: -5, rotationY: -Math.PI / 2 },
        { x: 10, y: 2, z: 0, rotationY: -Math.PI / 2 },
    ];

    return (
        <>
            {initialPositions.map((pos, index) => (
                <Fish
                    key={index}
                    initialPosition={{ x: pos.x, y: pos.y, z: pos.z }}
                    initialRotation={pos.rotationY}
                />
            ))}
        </>
    );
};

export default FishPod;
