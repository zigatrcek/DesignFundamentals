// CustomLoader.jsx
import React, { useEffect } from 'react';
import '../index.css';

const CustomLoader = ({ onClick }) => {
    return (
        <div className="custom-loader" onClick={onClick}>
            <div>
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
        </div>
    );
};

export default CustomLoader;
