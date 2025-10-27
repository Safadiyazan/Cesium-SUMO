import React, { useState, useCallback } from 'react';
import CesiumViewer from './CesiumViewer';
import Toolbar from './Toolbar';
import Drawer from './Drawer';
import TimelineControls from './TimelineControls';
import AboutUs from './AboutUs';

const MainLayout = () => {
    const [viewer, setViewer] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isAboutUsOpen, setAboutUsOpen] = useState(false);
    const [mapLayer, setMapLayer] = useState('OSM'); // 'OSM' or '3D'

    const handleViewerReady = useCallback((viewerInstance) => {
        setViewer(viewerInstance);
    }, []);

    const toggleDrawer = useCallback(() => {
        setDrawerOpen(prev => !prev);
    }, []);

    const toggleAboutUs = useCallback(() => {
        setAboutUsOpen(prev => !prev);
    }, []);

    const toggleMapLayer = useCallback(() => {
        setMapLayer(prevLayer => (prevLayer === 'OSM' ? '3D' : 'OSM'));
    }, []);

    return (
        <div>
            <CesiumViewer onViewerReady={handleViewerReady} mapLayer={mapLayer} />
            <Toolbar
                toggleDrawer={toggleDrawer}
                viewer={viewer}
                toggleAboutUs={toggleAboutUs}
                toggleMapLayer={toggleMapLayer}
                mapLayer={mapLayer}
            />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} viewer={viewer} />
            <AboutUs isOpen={isAboutUsOpen} toggleAboutUs={toggleAboutUs} />
            <TimelineControls viewer={viewer} />
        </div>
    );
};

export default MainLayout;
