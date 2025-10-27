import * as Cesium from "cesium";
import { Color, Cartesian3, Cartographic, Math as CesiumMath } from 'cesium';
import { computeNewPoint } from './utils';

export function plotAirspace(viewer, center, dx, dy, dz, dz0, dz1) {
    const centerPlotting = computeNewPoint(center, 0, 0, 0);
    const newPointSE = computeNewPoint(centerPlotting, dx / 2, -dy / 2, 0);
    const newPointNE = computeNewPoint(centerPlotting, dx / 2, dy / 2, 0);
    const newPointSW = computeNewPoint(centerPlotting, -dx / 2, -dy / 2, 0);
    const newPointNW = computeNewPoint(centerPlotting, -dx / 2, dy / 2, 0);

    const ellipsoid = viewer.scene.globe.ellipsoid;
    const cartographicNW = Cartographic.fromCartesian(newPointNW, ellipsoid);
    const cartographicNE = Cartographic.fromCartesian(newPointNE, ellipsoid);
    const cartographicSE = Cartographic.fromCartesian(newPointSE, ellipsoid);
    const cartographicSW = Cartographic.fromCartesian(newPointSW, ellipsoid);

    viewer.entities.add({
        name: 'Airspace',
        polygon: {
            hierarchy: Cartesian3.fromDegreesArray([
                CesiumMath.toDegrees(cartographicNW.longitude), CesiumMath.toDegrees(cartographicNW.latitude),
                CesiumMath.toDegrees(cartographicNE.longitude), CesiumMath.toDegrees(cartographicNE.latitude),
                CesiumMath.toDegrees(cartographicSE.longitude), CesiumMath.toDegrees(cartographicSE.latitude),
                CesiumMath.toDegrees(cartographicSW.longitude), CesiumMath.toDegrees(cartographicSW.latitude),
            ]),
            height: dz0 + dz1,
            extrudedHeight: dz0 + dz + dz1,
            material: Color.BLACK.withAlpha(0.1),
            outline: true,
            outlineColor: Color.BLACK,
        },
        allowPicking: false,
    });
}
