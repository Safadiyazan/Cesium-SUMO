import * as Cesium from "cesium";
import { Cartesian3, Math as CesiumMath, ShadowMode, HeadingPitchRoll } from 'cesium';
import { computeNewPoint } from './utils';

export function setupViewer(viewer, center, initialPosition, initialOrientation) {
    viewer.scene.globe.enableLighting = true; // Enable lighting for the sun and shadows
    viewer.shadows = true; // Enable shadows

    // Set shadow mode (for example, to have both terrain and 3D models cast and receive shadows):
    viewer.scene.shadowMode = ShadowMode.ENABLED;

    // You can also specify how detailed the shadows should be (higher quality may impact performance):
    viewer.shadowMap.maximumDistance = 5000.0; // Maximum shadow distance in meters

    viewer.camera.flyTo({
        destination: initialPosition,
        orientation: {
            heading: initialOrientation.heading,
            pitch: initialOrientation.pitch,
        },
        duration: 30,
    });
}

export function setupInputHandling(viewer, initialPosition, initialOrientation) {
    const camera = viewer.camera;
    let pitch = initialOrientation.pitch;
    let roll = initialOrientation.roll;
    let yaw = initialOrientation.heading;

    const keyState = {
        'w': false, 's': false, 'a': false, 'd': false,
        'q': false, 'e': false, 'ArrowUp': false, 'ArrowDown': false,
        'ArrowLeft': false, 'ArrowRight': false, 'PageUp': false, 'PageDown': false,
    };

    const onKeyDown = (event) => {
        if (keyState[event.key] !== undefined) {
            keyState[event.key] = true;
            event.preventDefault();
        }

        if (event.key === 'h') {
            pitch = initialOrientation.pitch;
            roll = initialOrientation.roll;
            yaw = initialOrientation.heading;
            camera.flyTo({
                destination: initialPosition,
                orientation: initialOrientation,
            });
            viewer.trackedEntity = undefined;
        }
    };

    const onKeyUp = (event) => {
        if (keyState[event.key] !== undefined) {
            keyState[event.key] = false;
        }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const pitchRate = 0.04;
    const rollRate = 0.04;
    const yawRate = 0.04;
    const moveSpeed = 30.0;
    const heightAdjustmentSpeed = 5.0;

    const handleMovement = () => {
        if (keyState['w']) pitch += pitchRate;
        if (keyState['s']) pitch -= pitchRate;
        if (keyState['a']) roll += rollRate;
        if (keyState['d']) roll -= rollRate;
        if (keyState['q']) yaw += yawRate;
        if (keyState['e']) yaw -= yawRate;

        if (keyState['ArrowUp']) camera.moveForward(moveSpeed);
        if (keyState['ArrowDown']) camera.moveBackward(moveSpeed);
        if (keyState['ArrowLeft']) camera.moveLeft(moveSpeed);
        if (keyState['ArrowRight']) camera.moveRight(moveSpeed);
        if (keyState['PageUp']) camera.moveUp(heightAdjustmentSpeed);
        if (keyState['PageDown']) camera.moveDown(heightAdjustmentSpeed);

        camera.setView({
            orientation: {
                pitch: pitch,
                roll: roll,
                heading: yaw,
            },
        });

        viewer.render();
        requestAnimationFrame(handleMovement);
    };

    handleMovement();
}
