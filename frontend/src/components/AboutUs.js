import React from 'react';
import { Button } from 'react-bootstrap';

const AboutUs = ({ isOpen, toggleAboutUs }) => {
    if (!isOpen) {
        return null;
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.75)',
        color: 'white',
        zIndex: 20,
        borderRadius: '10px',
        textAlign: 'center',
    };

    return (
        <div style={style}>
            <h2>About Cesium-SUMO</h2>
            <p>This repository provides an open-source tool for integrating SUMO simulation output with CesiumJS.</p>
            <p>For questions, feedback, or support, please contact: <br/> Yazan Safadi — <a href="mailto:safadiyazan@gmail.com" style={{color: 'white'}}>safadiyazan@gmail.com</a></p>
            <p>This repository is open-source and distributed under the Apache 2.0 License.</p>
            <Button variant="light" onClick={toggleAboutUs}>Close</Button>
        </div>
    );
};

export default AboutUs;
