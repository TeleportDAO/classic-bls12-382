
import { point } from "../dist/index"
import { Fp1, Fp2, fp1FromBigInt } from "../dist/src/fields"

function createG1Point(xStr: bigint, yStr: bigint): point {
    return new point(
        new Fp1(xStr),
        new Fp1(yStr),
        false
    )
}

function createG2Point(
    xStr_a0: bigint, 
    xStr_a1: bigint, 
    yStr_a0: bigint,
    yStr_a1: bigint,
): point {
    return new point(
        new Fp2(
            new Fp1(xStr_a0),
            new Fp1(xStr_a1),
        ),
        new Fp2(
            new Fp1(yStr_a0),
            new Fp1(yStr_a1),
        ),
        false
    )
}

export { createG1Point, createG2Point }