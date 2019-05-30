/*

schema for planet : {
        file: `${name}.jpg`,
        radius: radiusInKm/sunRadiusInKm,
        ownRotate: ok. 27 dni,
        orbit: 0,
        sunCircuit: 0,
}

1 min = 1 year
1sec = 60 * 24 * 365
*/
const scale = 100000;
const mlns = 1000000;
const orbitScale = scale * 5;
const day = 60 * 24;
const year = day * 365;


const getAngle = days => 27 / (days * 10);
export default [
    {
        file: 'sun.jpg',
        radius: 1392000 / 2 / scale,
        ownRotate: getAngle(27),
        orbit: 0,
        sunCircuit: 0,
        inLight: 0,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'mercury.jpg',
        radius: 4878 / 2 / scale,
        ownRotate: getAngle(58.65),
        orbit: 59.9 / 2 * mlns / orbitScale,
        //sunCircuit: 87, 969 dnia,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'venus.jpg',
        orbit: 108.2 / 2 * mlns / orbitScale,
        //sunCircuit: 224, 7 doby,
        ownRotate: getAngle(243),
        radius: 12104 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'earth.jpg',
        orbit: 149.6 / 2 * mlns / orbitScale,
        //sunCircuit: 365 dni 6h,
        ownRotate: getAngle((23 * 60 + 56) / day),
        radius: 12752 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'mars.jpg',
        orbit: 227.9 / 2 * mlns / orbitScale,
        //sunCircuit: 686, 738 dnia,
        ownRotate: getAngle((24 * 60 + 37) / day),
        radius: 6788 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'jupiter.jpg',
        orbit: 778.3 / 2 * mlns / orbitScale,
        //sunCircuit: 11 lat 315 dni,
        ownRotate: getAngle((9 * 60 + 48) / day),
        radius: 142800 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'saturn.jpg',
        orbit: 1427 / 2 * mlns / orbitScale,
        //sunCircuit: 29 lat 167 dni,
        ownRotate: getAngle((10 * 60 + 14) / day),
        radius: 120660 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'uranus.jpg',
        orbit: 2870 / 2 * mlns / orbitScale,
        //sunCircuit: 84, 014 lat,
        ownRotate: getAngle((10 * 60 + 49) / day),
        radius: 51108 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },
    {
        file: 'neptune.jpg',
        orbit: 4497 / 2 * mlns / orbitScale,
        //sunCircuit: 164, 78 lat,
        ownRotate: getAngle((15 * 60 + 40) / day),
        radius: 49530 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
    },

];



