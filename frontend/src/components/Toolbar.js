import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Toolbar = ({ toggleDrawer }) => {
    const toolbarStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10, // Ensure it's above the Cesium viewer
    };

    return (
        <div style={toolbarStyle}>
            <Button variant="dark" onClick={toggleDrawer}>
                <i className="bi bi-list"></i>
            </Button>
        </div>
    );
};

export default Toolbar;
