import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import FileLoader from './FileLoader';

const Drawer = ({ isOpen, toggleDrawer, viewer }) => {
    const offcanvasStyle = {
        width: '350px', // Set a fixed width for the drawer
        backgroundColor: 'rgba(33, 37, 41, 0.9)', // Dark, semi-transparent background
        color: 'white',
    };

    return (
        <Offcanvas show={isOpen} onHide={toggleDrawer} style={offcanvasStyle} placement="start">
            <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title>Controls</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <FileLoader viewer={viewer} />
                {/* Other components can be added here in the future */}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Drawer;
