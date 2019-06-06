const shirt = [1.0, 1.0, 1.0];
const pants = [1.0, 1.0, 1.0];
const skin = [1.0, 1.0, 1.0];


  export const humanPosition = [
    //shirt down back
    0, -2, 0, 4, -2, 0, 4, 4, 0,
    0, -2, 0, 4, 4, 0, 0, 4, 0,

    //shirt down front
    0, -2, 1.5, 4, -2, 1.5, 4, 4, 1.5,
    0, -2, 1.5, 4, 4, 1.5, 0, 4, 1.5,

    //shirt down front
    4, -2, 0, 4, -2, 1.5, 4, 4, 1.5,
    4, -2, 0, 4, 4, 1.5, 4, 4, 0,

    //shirt down front
    0, -2, 0, 0, -2, 1.5, 0, 4, 1.5,
    0, -2, 0, 0, 4, 1.5, 0, 4, 0,

    //skin head back
    0, -6, 0, 4, -6, 0, 4, -2, 0,
    0, -6, 0, 4, -2, 0, 0, -2, 0,

    //skin head front
    0, -6, 3, 4, -6, 3, 4, -2, 3,
    0, -6, 3, 4, -2, 3, 0, -2, 3,

    //skin head back
    4, -6, 0, 4, -6, 3, 4, -2, 3,
    4, -6, 0, 4, -2, 3, 4, -2, 0,
    //skin head back
    0, -6, 0, 0, -6, 3, 0, -2, 3,
    0, -6, 0, 0, -2, 3, 0, -2, 0,

    //skin head top
    0, -6, 3, 4, -6, 3, 4, -6, 0,
    0, -6, 3, 4, -6, 0, 0, -6, 0,

    //pants back
    0, 4, 0, 4, 4, 0, 4, 10, 0,
    0, 4, 0, 4, 10, 0, 0, 10, 0,

    //pants front
    0, 4, 1.5, 4, 4, 1.5, 4, 10, 1.5,
    0, 4, 1.5, 4, 10, 1.5, 0, 10, 1.5,

    4, 4, 0, 4, 4, 1.5, 4, 10, 1.5,
    4, 4, 0, 4, 10, 1.5, 4, 10, 0,

    0, 4, 0, 0, 4, 1.5, 0, 10, 1.5,
    0, 4, 0, 0, 10, 1.5, 0, 10, 0,
  ];

  export const humanColor = [
    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,

    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,

    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,
    //shirt down
    ...shirt, ...shirt, ...shirt,
    ...shirt, ...shirt, ...shirt,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,
    //skin head
    ...skin, ...skin, ...skin,
    ...skin, ...skin, ...skin,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,

    ...pants, ...pants, ...pants,
    ...pants, ...pants, ...pants,
  ];

  export const humanCoords = [

    //shirt down front
    0.4, 0.425, 0.6, 0.425, 0.6, 0.71,
    0.4, 0.425, 0.6, 0.71, 0.4, 0.71,

    //shirt down back
    0.6, 0.425, 0.8, 0.425, 0.8, 0.71,
    0.6, 0.425, 0.8, 0.71, 0.6, 0.71,

    //shirt down left
    0.6, 0.14, 0.8, 0.14, 0.8, 0.425,
    0.6, 0.14, 0.8, 0.425, 0.6, 0.425,

    //shirt down right
    0.4, 0.14, 0.6, 0.14, 0.6, 0.425,
    0.4, 0.14, 0.6, 0.425, 0.4, 0.425,

    //skin head front
    0, 0, 0.2, 0, 0.2, 0.1428,
    0, 0, 0.2, 0.1428, 0, 0.1428,

    //skin head back
    0.4, 0, 0.6, 0, 0.6, 0.1428,
    0.4, 0, 0.6, 0.1428, 0.4, 0.1428,

    //skin head right
    0.2, 0, 0.4, 0, 0.4, 0.1428,
    0.2, 0, 0.4, 0.1428, 0.2, 0.1428,

    //skin head left
    0.8, 0, 1, 0, 1, 0.1428,
    0.8, 0, 1, 0.1428, 0.8, 0.1428,

    //skin head top
    0.6, 0, 0.8, 0, 0.8, 0.1428,
    0.6, 0, 0.8, 0.1428, 0.6, 0.1428,

    //pants front
    0.2, 0.425, 0.4, 0.425, 0.4, 0.7,
    0.2, 0.425, 0.4, 0.7, 0.2, 0.7,


    //pants back
    0, 0.425, 0.2, 0.425, 0.2, 0.7,
    0, 0.425, 0.2, 0.7, 0, 0.7,

    //pants right
    0, 0.14, 0.2, 0.14, 0.2, 0.425,
    0, 0.14, 0.2, 0.425, 0, 0.425,

    //pants left
    0.2, 0.14, 0.4, 0.14, 0.4, 0.425,
    0.2, 0.14, 0.4, 0.425, 0.2, 0.425,
  ];
