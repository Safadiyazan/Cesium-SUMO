import React, { useEffect, useRef } from 'react';
import {
    Ion,
    Viewer,
    Terrain,
    createOsmBuildingsAsync,
    ImageryLayer,
    OpenStreetMapImageryProvider,
    Cesium3DTileset
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import token from '../../../token'; // Adjust path to token

Ion.defaultAccessToken = token;

const CesiumViewer = ({ onViewerReady, mapLayer }) => {
    const cesiumContainer = useRef(null);
    const viewerRef = useRef(null);
    const buildingsRef = useRef(null);
    const osmImageryLayerRef = useRef(null);
    const ionTilesetRef = useRef(null);

    useEffect(() => {
        if (cesiumContainer.current && !viewerRef.current) {
            const osmImageryLayer = new ImageryLayer(new OpenStreetMapImageryProvider({
                url: "https://tile.openstreetmap.org/"
            }));
            osmImageryLayerRef.current = osmImageryLayer;

            const viewer = new Viewer(cesiumContainer.current, {
                terrain: Terrain.fromWorldTerrain(),
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
                baseLayer: osmImageryLayer,
            });
            viewerRef.current = viewer;

            createOsmBuildingsAsync().then(buildingTileset => {
                viewer.scene.primitives.add(buildingTileset);
                buildingsRef.current = buildingTileset;
            });

            if (onViewerReady) {
                onViewerReady(viewer);
            }
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, [onViewerReady]);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const showOsmLayer = mapLayer === 'OSM';

        if (osmImageryLayerRef.current) osmImageryLayerRef.current.show = showOsmLayer;
        if (buildingsRef.current) buildingsRef.current.show = showOsmLayer;
        viewer.scene.globe.show = showOsmLayer;

        if (mapLayer === '3D') {
            if (!ionTilesetRef.current) {
                (async () => {
                    try {
                        const tileset = await Cesium3DTileset.fromIonAssetId(2275207);
                        viewer.scene.primitives.add(tileset);
                        ionTilesetRef.current = tileset;
                        viewer.zoomTo(tileset);
                    } catch (error) {
                        console.error(`Error loading tileset: ${error}`);
                    }
                })();
            } else {
                ionTilesetRef.current.show = true;
                viewer.zoomTo(ionTilesetRef.current);
            }
        } else {
            if (ionTilesetRef.current) {
                ionTilesetRef.current.show = false;
            }
        }
    }, [mapLayer]);


    return <div ref={cesiumContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default CesiumViewer;
