
const scale = 100000;
const mlns = 1000000;
const orbitScale = scale * 5;
const day = 60 * 24;
const year = day * 365;

const getAngle = days => 27 / (days * 10);
const getAngleAroundSun = days => 3650 / (days * 10);

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
        orbits: []
    },
    {
        file: 'mercury.jpg',
        radius: 4878 / 2 / scale,
        ownRotate: getAngle(58.65),
        orbit: 59.9 * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(87.969),
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },
    {
        file: 'venus.jpg',
        orbit: 108.2 * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(224.7),
        ownRotate: getAngle(243),
        radius: 12104 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },
    {
        file: 'earth.jpg',
        orbit: 149.6  * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(365+6/24),
        ownRotate: getAngle((23 * 60 + 56) / day),
        radius: 12752 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: [
            {
                file: "moon.jpg",
                radius: 3476 /2/ scale,
                orbit: 380000 / orbitScale,
                planetCircuit: getAngle(27.3),
                ownRotate: getAngle(27.3),
                angle: 0,
                translateX: 0,
                translateZ: 0,
            },
        ],
    },
    {
        file: 'mars.jpg',
        orbit: 227.9 * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(686.738),
        ownRotate: getAngle((24 * 60 + 37) / day),
        radius: 6788 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },
    {
        file: 'jupiter.jpg',
        orbit: 778.3  * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(11*365+315),
        ownRotate: getAngle((9 * 60 + 48) / day),
        radius: 142800 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },
    {
        file: 'saturn.jpg',
        orbit: 1427  * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(29*365+167),
        ownRotate: getAngle((10 * 60 + 14) / day),
        radius: 120660 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },
    {
        file: 'uranus.jpg',
        orbit: 2870 * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(84.014*365),
        ownRotate: getAngle((10 * 60 + 49) / day),
        radius: 51108 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },
    {
        file: 'neptune.jpg',
        orbit: 4497  * mlns / orbitScale,
        sunCircuit: getAngleAroundSun(164.78*365),
        ownRotate: getAngle((15 * 60 + 40) / day),
        radius: 49530 / 2 / scale,
        inLight: 1,
        angle: 0,
        translateX: 0,
        translateZ: 0,
        orbits: []
    },

];



