import * as Cesium from "cesium";
import {
    JulianDate,
    SampledPositionProperty,
    Cartesian3,
    Color,
    TimeIntervalCollection,
    TimeInterval,
    PathGraphics,
    VelocityOrientationProperty,
    DistanceDisplayCondition,
    CallbackProperty,
    HeadingPitchRoll,
    Transforms,
    Ellipsoid,
    Math as CesiumMath,
    PolylineDashMaterialProperty,
    HeightReference
} from 'cesium';
import { computeNewPoint } from './utils';

export async function addAircraft(
    viewer,
    startSim,
    stopSim,
    timeStepInSeconds,
    aircraftIndex,
    flightData,
    ami,
    tda,
    taa,
    rs,
    rd,
    entitiesArray,
    positionPropertyArray
) {
    const startAircraft = JulianDate.addSeconds(startSim, tda, new JulianDate());
    const stopAircraft = JulianDate.addSeconds(startSim, taa, new JulianDate());
    const positionProperty = new SampledPositionProperty();
    const polylinePositions = [];

    for (let i = 0; i < flightData.length; i++) {
        const dataPoint = flightData[i];
        const time = JulianDate.addSeconds(startSim, i * timeStepInSeconds, new JulianDate());
        const position = Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
        positionProperty.addSample(time, position);
        polylinePositions.push(position);
    }

    const pathEntity = viewer.entities.add({
        name: `Aircraft: ${aircraftIndex}, Waypoint Path`,
        polyline: {
            positions: polylinePositions,
            material: Color.DARKGRAY.withAlpha(0.4),
            width: 5,
        },
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAircraft, stop: stopAircraft })]),
        allowPicking: false,
    });

    const completedPathPositions = new CallbackProperty(() => {
        const currentTime = viewer.clock.currentTime;
        return polylinePositions.filter((_, index) => {
            const waypointTime = JulianDate.addSeconds(startSim, index * timeStepInSeconds, new JulianDate());
            return JulianDate.lessThanOrEquals(waypointTime, currentTime);
        });
    }, false);

    const plannedPathPositions = new CallbackProperty(() => {
        const currentTime = viewer.clock.currentTime;
        return polylinePositions.filter((_, index) => {
            const waypointTime = JulianDate.addSeconds(startSim, index * timeStepInSeconds, new JulianDate());
            return JulianDate.greaterThan(waypointTime, currentTime);
        });
    }, false);

    viewer.entities.add({
        polyline: {
            positions: completedPathPositions,
            material: Color.DARKBLUE.withAlpha(0.4),
            width: 3,
        },
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAircraft, stop: stopAircraft })]),
        allowPicking: false,
    });

    viewer.entities.add({
        polyline: {
            positions: plannedPathPositions,
            material: new PolylineDashMaterialProperty({
                color: Color.DARKRED.withAlpha(0.4),
                dashLength: 8.0,
            }),
            width: 3,
        },
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAircraft, stop: stopAircraft })]),
        allowPicking: false,
    });

    const safetySphere = viewer.entities.add({
        name: `Aircraft: ${aircraftIndex}, Safety Space`,
        position: positionProperty,
        ellipsoid: {
            radii: new Cartesian3(rs, rs, rs),
            material: Color.RED.withAlpha(0.1),
            outline: true,
            outlineColor: Color.BLACK.withAlpha(0.2),
        },
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAircraft, stop: stopAircraft })]),
        allowPicking: false,
    });

    const detectionSphere = viewer.entities.add({
        name: `Aircraft: ${aircraftIndex}, Detection Space`,
        position: positionProperty,
        ellipsoid: {
            radii: new Cartesian3(rd, rd, rd),
            material: Color.BLACK.withAlpha(0.05),
            outline: true,
            outlineColor: Color.BLACK.withAlpha(0.05),
        },
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAircraft, stop: stopAircraft })]),
        allowPicking: false,
    });

    let aircraftUrl, scale;
    switch (ami) {
        case 1:
            aircraftUrl = "/glbs/YS_VTOL_Medical.glb";
            scale = 2;
            break;
        case 2:
            aircraftUrl = "/glbs/YS_Drone_MedicalCargo.glb";
            scale = 1;
            break;
        case 3:
            aircraftUrl = "/glbs/YS_VTOL.glb";
            scale = 2;
            break;
        case 4:
            aircraftUrl = "/glbs/YS_Drone_Pack.glb";
            scale = 1;
            break;
        default:
            aircraftUrl = "/glbs/YS_VTOL.glb";
            scale = 2;
    }

    const airplaneEntity = viewer.entities.add({
        name: `Aircraft: ${aircraftIndex}, Model`,
        position: positionProperty,
        model: {
            uri: aircraftUrl,
            scale: scale,
        },
        path: new PathGraphics({ width: 0.2 }),
        orientation: new VelocityOrientationProperty(positionProperty),
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAircraft, stop: stopAircraft })]),
        allowPicking: false,
    });

    entitiesArray.push(airplaneEntity);
    positionPropertyArray.push(positionProperty);
}

export async function addAgent(
    viewer,
    startSim,
    stopSim,
    timeStepInSeconds,
    agentIndex,
    trajData,
    ami,
    tda,
    taa,
    rs,
    rd,
    entitiesArray,
    positionPropertyArray
) {
    const startAgent = JulianDate.addSeconds(startSim, tda, new JulianDate());
    const stopAgent = JulianDate.addSeconds(startSim, taa, new JulianDate());
    const positionProperty = new SampledPositionProperty();
    const polylinePositions = [];

    for (let i = 0; i < trajData.length; i++) {
        const dataPoint = trajData[i];
        const time = JulianDate.addSeconds(startSim, i * timeStepInSeconds, new JulianDate());
        const position = Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude);
        positionProperty.addSample(time, position);
        polylinePositions.push(position);
    }

    viewer.entities.add({
        polyline: {
            positions: polylinePositions,
            material: Color.RED.withAlpha(0.4),
            width: 5,
            clampToGround: true
        },
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAgent, stop: stopAgent })]),
        allowPicking: false,
    });

    let agentUrl, scale;
    switch (ami) {
        case 1:
            agentUrl = "/glbs/YS_Human.glb";
            scale = 1;
            break;
        case 2:
            agentUrl = "/glbs/YS_Motor.glb";
            scale = 1;
            break;
        case 3:
            agentUrl = "/glbs/YS_Bus.glb";
            scale = 0.5;
            break;
        case 5:
            agentUrl = "/glbs/YS_Train.glb";
            scale = 0.5;
            break;
        default:
            agentUrl = "/glbs/YS_NewCar.glb";
            scale = 0.25;
    }

    const agentEntity = viewer.entities.add({
        name: `Agent: ${agentIndex}, Model`,
        position: positionProperty,
        model: {
            uri: agentUrl,
            scale: scale,
            heightReference: Cesium.HeightReference.CLAMP_TO_TERRAIN,
        },
        orientation: new VelocityOrientationProperty(positionProperty),
        availability: new TimeIntervalCollection([new TimeInterval({ start: startAgent, stop: stopAgent })]),
        allowPicking: false,
    });

    entitiesArray.push(agentEntity);
    positionPropertyArray.push(positionProperty);
}
