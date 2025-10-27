import * as Cesium from "cesium";
import { Cartesian3 } from 'cesium';

export const cities = {
    "NYC": {
        center: Cartesian3.fromDegrees(-73.98435971601633, 40.75171803897241, 0),
        vertiports: true,
        dz0: 480,
        fetchVertiportFileName: '/FixedVertiportsSettings_V2_NYC.json'
    },
    "NAU": {
        center: Cartesian3.fromDegrees(-73.98435971601633, 40.75171803897241, 0),
        vertiports: true,
        dz0: 480,
        fetchVertiportFileName: '/FixedVertiportsSettings_V1_NYC_Archer_United.json'
    },
    "SF": {
        center: Cartesian3.fromDegrees(-122.3816, 37.6191, 0),
        vertiports: true,
        dz0: 0,
        fetchVertiportFileName: '/FixedVertiportsSettings_V1_SF.json'
    },
    "ZRH": {
        center: Cartesian3.fromDegrees(8.545094, 47.373878, 580),
        vertiports: false,
        dz0: 580
    },
    "HF": {
        center: Cartesian3.fromDegrees(35.023484, 32.777805, 580),
        vertiports: false,
        dz0: 580
    },
    "NZ": {
        center: Cartesian3.fromDegrees(35.29755740551859, 32.702149095841264, 580),
        vertiports: false,
        dz0: 580
    },
    "DXB": {
        center: Cartesian3.fromDegrees(55.1390, 25.1124, 80),
        vertiports: false,
        dz0: 80
    },
    "KTH": {
        center: Cartesian3.fromDegrees(18.070336, 59.349744, 580),
        vertiports: false,
        dz0: 580
    },
    "UOM": {
        center: Cartesian3.fromDegrees(-83.73826609087581, 42.28074004295685, 580),
        vertiports: false,
        dz0: 580
    },
    "PAR": {
        center: Cartesian3.fromDegrees(2.294670305890747, 48.85821322426023, 0),
        vertiports: true,
        dz0: 580,
        fetchVertiportFileName: '/FixedVertiportsSettings_V1_PAR.json'
    },
    "HER": {
        center: Cartesian3.fromDegrees(25.129820168413037, 35.333686242682596, 300),
        vertiports: false,
        dz0: 300
    },
    "ZHAW": {
        center: Cartesian3.fromDegrees(8.726615248323863, 47.49776171780695, 580),
        vertiports: false,
        dz0: 580
    },
    "FRB": {
        center: Cartesian3.fromDegrees(7.161267, 46.805565, 580),
        vertiports: false,
        dz0: 580
    }
};
