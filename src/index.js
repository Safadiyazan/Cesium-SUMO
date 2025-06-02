import "../src/css/main.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
// Import components =====================================================================
import HeaderYS from './components/HeaderYS';
import Dashboard from './components/Dashboard';
import './css/main.css'; // Ensure this import is here
import token from './token.js'; // Import the token from the token.js file
// Cesium Viewer Setting =================================================================
import {IonResource, SceneMode, ImageryLayer, OpenStreetMapImageryProvider, SkyBox, WebMercatorProjection, ClockStep, ClockRange, HeadingPitchRoll, VelocityOrientationProperty, PathGraphics, DistanceDisplayCondition, CallbackProperty, TimeInterval, TimeIntervalCollection, SampledPositionProperty, JulianDate, Cartographic, Sun, ShadowMode, Color, Ellipsoid, Matrix4, Transforms, Cesium3DTileset, Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
Ion.defaultAccessToken = token;
// const viewer = new Viewer("cesiumContainer", {
//   terrain: Terrain.fromWorldTerrain(),
// });
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
  baseLayerPicker: false,
  baseLayer: new ImageryLayer(new OpenStreetMapImageryProvider({
    url: "https://tile.openstreetmap.org/"
  })),
});
const buildingTileset = await createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset); 
// buildingTileset.preloadFlight = true;
// buildingTileset.preloadSiblings = true;
// buildingTileset.preloadWhenHidden = true;
// buildingTileset.dynamicScreenSpaceError = false;
// buildingTileset.maximumScreenSpaceError = 2;
// viewer.scene.pick = () => { return undefined; };
// viewer.scene.globe.enableLighting = true;

// App UI ==========================================================
function App() {
  return (
    <div>
      <HeaderYS />
      <Dashboard />
    </div>
  );
}
const domNodeA = document.getElementById('App');
const rootA = createRoot(domNodeA);
rootA.render(<App />);
export { viewer };
