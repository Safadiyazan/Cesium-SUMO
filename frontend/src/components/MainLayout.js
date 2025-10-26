import React, { useState, useCallback } from 'react';
import CesiumViewer from './CesiumViewer';
import Toolbar from './Toolbar';
import Drawer from './Drawer';
import TimelineControls from './TimelineControls'; // Import the new component

const MainLayout = () => {
    const [viewer, setViewer] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const handleViewerReady = useCallback((viewerInstance) => {
        setViewer(viewerInstance);
    }, []);

    const toggleDrawer = useCallback(() => {
        setDrawerOpen(prev => !prev);
    }, []);

    return (
        <div>
            <CesiumViewer onViewerReady={handleViewerReady} />
            <Toolbar toggleDrawer={toggleDrawer} />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} viewer={viewer} />
            <TimelineControls viewer={viewer} />
        </div>
    );
};

export default MainLayout;
