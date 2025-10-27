import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Toolbar = ({ toggleDrawer, viewer, toggleAboutUs, toggleMapLayer, mapLayer }) => {
    const toolbarStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10, // Ensure it's above the Cesium viewer
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const logoStyle = {
        width: '25px',
        height: '25px',
    };

    const logoButtonStyle = {
        borderRadius: '50%',
        padding: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        backgroundColor: 'white',
        border: 'none',
    };

    const zoomIn = () => {
        if (viewer) {
            viewer.camera.zoomIn(viewer.camera.positionCartographic.height / 2.0);
        }
    };

    const zoomOut = () => {
        if (viewer) {
            viewer.camera.zoomOut(viewer.camera.positionCartographic.height);
        }
    };

    const goHome = () => {
        if (viewer) {
            viewer.zoomTo(viewer.entities);
        }
    };

    return (
        <div style={toolbarStyle}>
            <ButtonGroup>
                <Button variant="dark" style={logoButtonStyle}>
                    <img src="/Logo.png" alt="Logo" style={logoStyle} />
                </Button>
                <Button variant="dark" onClick={goHome} title="Home">
                    <i className="bi bi-house"></i>
                </Button>
                <Button variant="dark" onClick={zoomIn} title="Zoom In">
                    <i className="bi bi-zoom-in"></i>
                </Button>
                <Button variant="dark" onClick={zoomOut} title="Zoom Out">
                    <i className="bi bi-zoom-out"></i>
                </Button>
                <Button variant="dark" onClick={toggleMapLayer} title="Toggle Map Layer">
                    {mapLayer}
                </Button>
                <Button variant="dark" disabled title="Create Simulation">
                    <i className="bi bi-plus-circle"></i>
                </Button>
                <Button variant="dark" disabled title="Run Simulation">
                    <i className="bi bi-play"></i>
                </Button>
                <Button variant="dark" onClick={toggleDrawer} title="View Simulation">
                    <i className="bi bi-binoculars"></i>
                </Button>
                <Button variant="dark" onClick={toggleAboutUs} title="About Us">
                    <i className="bi bi-info-circle"></i>
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default Toolbar;
