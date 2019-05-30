export function invert1dMat(matrix) {

    // Adapted from: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js

    // Performance note: Try not to allocate memory during a loop. This is done here
    // for the ease of understanding the code samples.
    var result = [];

    var n11 = matrix[0], n12 = matrix[4], n13 = matrix[8], n14 = matrix[12];
    var n21 = matrix[1], n22 = matrix[5], n23 = matrix[9], n24 = matrix[13];
    var n31 = matrix[2], n32 = matrix[6], n33 = matrix[10], n34 = matrix[14];
    var n41 = matrix[3], n42 = matrix[7], n43 = matrix[11], n44 = matrix[15];

    result[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    result[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    result[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    result[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    result[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    result[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    result[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    result[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    result[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    result[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    var determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12];

    if (determinant === 0) {
        throw new Error("Can't invert matrix, determinant is 0");
    }

    for (var i = 0; i < result.length; i++) {
        result[i] /= determinant;
    }

    return result;
}

export const CrossProduct = (A, B) => (
    [
        A[1] * B[2] - A[2] * B[1],
        A[2] * B[0] - A[0] * B[2],
        A[0] * B[1] - A[1] * B[0]
    ]);

export function Normalize(A) {
    const length = Math.sqrt(A[0] * A[0] + A[1] * A[1] + A[2] * A[2])
    return [A[0] / length, A[1] / length, A[2] / length];
}

export const isPowerOf2 = value =>
    ((value & (value - 1)) == 0);


export function MatrixMul(matrix1, matrix2) {
    let c = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            c[i * 4 + j] = 0.0;
            for (let k = 0; k < 4; k++) {
                c[i * 4 + j] += matrix1[i * 4 + k] * matrix2[k * 4 + j];
            }
        }
    }
    return c;
}
export const transpose1dMat = (m) => (
    [
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15],
    ]);
export const scale3dMat = (x) =>
    ([
        x, 0, 0, 0,
        0, x, 0, 0,
        0, 0, x, 0,
        0, 0, 0, 1
    ]);

export const translate3dMat = (a = 0, b = 0, c = 0) =>
    ([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        a, b, c, 1
    ]);


export const identity3dMat = () => (
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
);

export const rotateZ = angle => ([
    Math.cos(angle * Math.PI / 180.0), Math.sin(angle * Math.PI / 180.0), 0, 0,
    -Math.sin(angle * Math.PI / 180.0), Math.cos(angle * Math.PI / 180.0), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);

export const rotateY = angle => [
    Math.cos(angle * Math.PI / 180.0), 0, -Math.sin(angle * Math.PI / 180.0), 0,
    0, 1, 0, 0,
    Math.sin(angle * Math.PI / 180.0), 0, Math.cos(angle * Math.PI / 180.0), 0,
    0, 0, 0, 1
];

export const rotateX = angle => [
    1, 0, 0, 0,
    0, Math.cos(angle * Math.PI / 180.0), Math.sin(angle * Math.PI / 180.0), 0,
    0, -Math.sin(angle * Math.PI / 180.0), Math.cos(angle * Math.PI / 180.0), 0,
    0, 0, 0, 1
];


export const rotate3d = angle => (
    MatrixMul(MatrixMul(rotateX(angle), rotateY(angle)), rotateZ(angle))
);




/* const rotate3dMat = (a = 0, b = 0, c = 0) =>
([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  a, b, c, 1
]); */




