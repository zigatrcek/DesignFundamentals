// CustomLoader.jsx
import React from 'react';
import { Html } from '@react-three/drei';
import '../index.css';

const CustomLoader = ({ showLoader }) => {
    return (
        <Html center>
            <div className="custom-loader" onClick={() => showLoader(false)}>
                <img
                    src="src\assets\images\mai-col\town_colorAdjusted.png"
                    alt="Top Slide"
                    className="slide-top"
                />
                <img
                    src="src\assets\images\mai-col\parchment.png"
                    alt="Bottom Slide"
                    className="slide-bottom"
                />
                <p>Click anywhere to begin</p>
            </div>
        </Html>
    );
};

export default CustomLoader;
