
import * as Cesium from "cesium";
import { ClockStep, ClockRange, JulianDate, Cartesian3, Cartographic } from 'cesium';
import { cities } from './config';
import { computeNewPoint, plotPoint } from './utils';
import { setupViewer, setupInputHandling } from './viewer';
import { plotAirspace } from './airspace';
import { addAircraft, addAgent } from './entities';
import { setupInputHandlers } from './input';

export async function loadSimulation(viewer, data, dataSUMO1, dataSUMO2, dataSUMO3, city) {
    try {
        viewer.entities.removeAll();
    } catch (error) {
        console.log(`Error loading: ${error}`);
    }

    const cityConfig = cities[city];
    if (!cityConfig) {
        console.error(`Invalid city: ${city}`);
        return;
    }

    const { center, vertiports, dz0, fetchVertiportFileName } = cityConfig;

    const initialPosition = computeNewPoint(center, 0, 0, 1000);
    const initialOrientation = {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-45.0),
        roll: Cesium.Math.toRadians(0),
    };

    setupViewer(viewer, center, initialPosition, initialOrientation);
    setupInputHandling(viewer, initialPosition, initialOrientation);

    plotPoint(viewer, center);

    if (data.Settings.Airspace.dz1) {
        const { dx, dy, dz, dz1 } = data.Settings.Airspace;
        plotAirspace(viewer, center, dx, dy, dz, dz0, dz1);
    }

    const { dtS, tf } = data.SimInfo;
    const timeStepInSeconds = 1 * dtS;
    const totalSeconds = tf;
    const startSim = JulianDate.now();
    const stopSim = JulianDate.addSeconds(startSim, totalSeconds, new JulianDate());

    viewer.clock.startTime = startSim.clone();
    viewer.clock.stopTime = stopSim.clone();
    viewer.clock.currentTime = startSim.clone();
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = false;
    viewer.clock.clockRange = ClockRange.CLAMPED;
    viewer.clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;

    const entitiesArray = [];
    const positionPropertyArray = [];

    if (data.ObjAircraft) {
        data.ObjAircraft.forEach((aircraft, index) => {
            const trajectoryPositions = [];
            for (let i = 0; i < aircraft.x.length; i += timeStepInSeconds / dtS) {
                const currentPosition = computeNewPoint(center, aircraft.x[i], aircraft.y[i], aircraft.z[i]);
                trajectoryPositions.push({
                    longitude: Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(currentPosition).longitude),
                    latitude: Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(currentPosition).latitude),
                    height: Cesium.Cartographic.fromCartesian(currentPosition).height
                });
            }
            addAircraft(
                viewer,
                startSim,
                stopSim,
                timeStepInSeconds,
                index + 1,
                trajectoryPositions,
                aircraft.AMI,
                aircraft.tda,
                aircraft.taa,
                aircraft.rs,
                aircraft.rd,
                entitiesArray,
                positionPropertyArray
            );
        });
    }

    const processSUMOData = (sumoData) => {
        if (sumoData.ObjSUMO) {
            sumoData.ObjSUMO.forEach((agent, index) => {
                const trajectoryPositions = [];
                for (let i = 0; i < agent.lon.length - 1; i += timeStepInSeconds / dtS) {
                    trajectoryPositions.push({
                        longitude: agent.lon[i],
                        latitude: agent.lat[i],
                        height: dz0
                    });
                }
                addAgent(
                    viewer,
                    startSim,
                    stopSim,
                    timeStepInSeconds,
                    index + 1,
                    trajectoryPositions,
                    agent.AMI,
                    agent.tda,
                    agent.taa,
                    agent.rs,
                    agent.rd,
                    entitiesArray,
                    positionPropertyArray
                );
            });
        }
    };

    processSUMOData(dataSUMO1);
    processSUMOData(dataSUMO2);
    processSUMOData(dataSUMO3);

    if (vertiports) {
        fetch(fetchVertiportFileName)
            .then(response => response.json())
            .then(data => {
                data.forEach(vertiport => {
                    const vertiportLocation = Cesium.Cartesian3.fromDegrees(
                        vertiport.longitude,
                        vertiport.latitude,
                        vertiport.height
                    );
                    // Add vertiport visualization here
                });
            })
            .catch(error => console.error('Error loading fixed Vertiport settings:', error));
    }

    setupInputHandlers(viewer, center, 
        (adjustedCartesian, longitudeDeg, latitudeDeg, heightDeg) => {
            console.log('Vertiport added at:', { longitudeDeg, latitudeDeg, heightDeg });
            // Vertiport creation logic here
        },
        (adjustedCartesian, longitudeDeg, latitudeDeg, heightDeg) => {
            console.log('Pedestrian added at:', { longitudeDeg, latitudeDeg, heightDeg });
            // Pedestrian creation logic here
        }
    );
}
