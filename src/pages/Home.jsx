import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState, Suspense, useEffect, useRef } from 'react';
import Loader from '../components/Loader';
import Island from '../models/Island';
import Sky from '../models/Sky';
import Plane from '../models/Plane';
import Fish from '../models/Fish';

const Home = () => {
    const [isRotating, _setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const planeRef = useRef();

    const adjustIslandForScreenSize = () => {
        let screenScale = null;
        let screenPosition = [-1, -7.5, 5];
        let rotation = [0.1, -4.7, 0];
        if (window.innerWidth < 768) {
            screenScale = [0.9, 0.9, 0.9];
        } else {
            screenScale = [1, 1, 1];
        }
        return [screenScale, screenPosition, rotation];
    };
    const adjustPlaneForScreenSize = () => {
        let screenScale, screenPosition;

        if (window.innerWidth < 768) {
            //resizing non functional
            screenScale = [1.5, 1.5, 1.5];
            screenPosition = [0, 2, 30];
        } else {
            screenScale = [3, 3, 10];
            screenPosition = [0, 1, 30];
        }
        return [screenScale, screenPosition];
    };
    const [planeScale, planePosition] = adjustPlaneForScreenSize();
    const [islandScale, islandPosition, islandRotation] =
        adjustIslandForScreenSize();
    useEffect(() => {
        // This useEffect could log the position or perform other side effects
        if (planeRef.current) {
            console.log('Plane Position:', planeRef.current.position);
        }
    }, [planePosition]);

    return (
        <section className="w-full h-screen relative">
            {/*<div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
                POPUP

            </div>*/}
            <Canvas
                className={`w-full h-screen bg-transparent ${
                    isRotating ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                camera={{ position: [0, 0, 35], near: 0.01, far: 1000 }}>
                <Suspense fallback={<Loader />}>
                    <directionalLight position={[10, 5, 10]} intensity={0.1} />
                    <ambientLight intensity={1.7} color="#fce1bb" />
                    {/*<pointLight />*/}
                    <hemisphereLight
                        skyColor="#b1e1ff"
                        groundColor="#000000"
                        intensity={1}
                    />
                    <Fish position={[-10, 0, 5]} />
                    <Sky isRotating={isRotating} />
                    <Island
                        position={islandPosition}
                        scale={islandScale}
                        rotation={islandRotation}
                        isRotating={isRotating}
                        _setIsRotating={_setIsRotating}
                        setCurrentStage={setCurrentStage}
                    />
                    <Plane
                        isRotating={isRotating}
                        planeScale={planeScale}
                        planePosition={planePosition}
                        rotation={[0, 20, 0]}
                    />
                    <OrbitControls
                        enableZoom={true}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 3}
                        maxDistance={100}
                        minDistance={0}
                        zoomSpeed={1.2}
                        enableDamping:true
                    />
                </Suspense>
            </Canvas>
        </section>
    );
};

export default Home;
