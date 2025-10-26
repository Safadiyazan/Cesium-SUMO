import React, { useEffect, useRef } from 'react';
import {
    Ion,
    Viewer,
    Terrain,
    createOsmBuildingsAsync,
    ImageryLayer,
    OpenStreetMapImageryProvider
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import token from '../../../token'; // Adjust path to token

Ion.defaultAccessToken = token;

const CesiumViewer = ({ onViewerReady }) => {
    const cesiumContainer = useRef(null);

    useEffect(() => {
        if (cesiumContainer.current) {
            const viewer = new Viewer(cesiumContainer.current, {
                terrain: Terrain.fromWorldTerrain(),
                // Default UI elements to disable
                baseLayerPicker: false,
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                geocoder: false,
                animation: false,
                timeline: false,
                fullscreenButton: false,
                infoBox: false,
                selectionIndicator: false,
                // Base layer setup
                baseLayer: new ImageryLayer(new OpenStreetMapImageryProvider({
                    url: "https://tile.openstreetmap.org/"
                })),
            });

            createOsmBuildingsAsync().then(buildingTileset => {
                viewer.scene.primitives.add(buildingTileset);
            });

            if (onViewerReady) {
                onViewerReady(viewer);
            }

            // Cleanup
            return () => {
                viewer.destroy();
            };
        }
    }, [onViewerReady]);

    return <div ref={cesiumContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default CesiumViewer;
