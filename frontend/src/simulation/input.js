import * as Cesium from "cesium";
import { ScreenSpaceEventHandler, Math as CesiumMath, Cartographic, defined, Transforms, Cartesian3, HorizontalOrigin, VerticalOrigin, ScreenSpaceEventType } from 'cesium';

export function setupInputHandlers(viewer, center, vertiportAddedCallback, pedestrianAddedCallback) {
    const scene = viewer.scene;
    const handler = new ScreenSpaceEventHandler(scene.canvas);

    let isNetworkSetup = false;
    let isPedestrianSetup = false;

    const labelEntity = viewer.entities.add({
        label: {
            show: false,
            showBackground: true,
            font: "14px Latin Modern",
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
        },
    });

    handler.setInputAction((movement) => {
        if (!isNetworkSetup && !isPedestrianSetup) return;

        let foundPosition = false;
        const cartesian = scene.pickPosition(movement.endPosition);

        if (defined(cartesian)) {
            const cartographic = Cartographic.fromCartesian(cartesian);
            const longitudeString = CesiumMath.toDegrees(cartographic.longitude).toFixed(2);
            const latitudeString = CesiumMath.toDegrees(cartographic.latitude).toFixed(2);
            const heightString = cartographic.height.toFixed(2);

            labelEntity.position = cartesian;
            labelEntity.label.show = true;
            labelEntity.label.text = `Lon: ${longitudeString}°\nLat: ${latitudeString}°\nAlt: ${heightString}m`;
            foundPosition = true;
        }

        if (!foundPosition) {
            labelEntity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction((event) => {
        if (!isNetworkSetup && !isPedestrianSetup) return;

        const cartesian = scene.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
        if (defined(cartesian)) {
            const cartographic = Cartographic.fromCartesian(cartesian);
            const longitudeDeg = CesiumMath.toDegrees(cartographic.longitude);
            const latitudeDeg = CesiumMath.toDegrees(cartographic.latitude);
            let heightDeg = 0;

            if (scene.sampleHeightSupported) {
                const updatedCartographic = scene.sampleHeight(cartographic, []);
                if (defined(updatedCartographic)) {
                    heightDeg = updatedCartographic.height;
                }
            }

            const adjustedCartesian = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightDeg);

            if (isNetworkSetup) {
                vertiportAddedCallback(adjustedCartesian, longitudeDeg, latitudeDeg, heightDeg);
            }

            if (isPedestrianSetup) {
                pedestrianAddedCallback(adjustedCartesian, longitudeDeg, latitudeDeg, heightDeg);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    window.addEventListener('keydown', (event) => {
        if (event.key === 'N') {
            isNetworkSetup = !isNetworkSetup;
            console.log(`Network setup is ${isNetworkSetup ? 'on' : 'off'}`);
        }
        if (event.key === 'P') {
            isPedestrianSetup = !isPedestrianSetup;
            console.log(`Pedestrian setup is ${isPedestrianSetup ? 'on' : 'off'}`);
        }
    });
}
