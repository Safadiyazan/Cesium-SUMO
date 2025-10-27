
import * as Cesium from "cesium";
import { Transforms, Ellipsoid, Matrix4, Cartesian3, Cartographic, Math as CesiumMath, Color } from 'cesium';

// Function to calculate a new point given offsets in meters
export function computeNewPoint(center, dx, dy, dz) {
    // Create a matrix that represents the east, north, up AGL offset
    var offsetMatrix = Transforms.eastNorthUpToFixedFrame(center, Ellipsoid.WGS84, new Matrix4());
    // Offset the point by the specified distances
    var offsetPoint = Matrix4.multiplyByPoint(offsetMatrix, new Cartesian3(dx, dy, dz), new Cartesian3());
    return offsetPoint;
}

// Function to plot Point as black dot circle
export function plotPoint(viewer, newPoint) {
    // Create a point entity at the new position
    const scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var PointCatroStr = Cartographic.fromCartesian(newPoint, ellipsoid)
    viewer.entities.add({
        name: `Point`,
        description: `Location: (${CesiumMath.toDegrees(PointCatroStr.longitude)}, ${CesiumMath.toDegrees(PointCatroStr).latitude}, ${PointCatroStr.height})`,
        position: newPoint,
        point: {
            pixelSize: 5,
            color: Color.BLACK,
            outlineColor: Color.WHITE,
            outlineWidth: 1,
        },
        allowPicking: false,
    });
    return undefined;
}
