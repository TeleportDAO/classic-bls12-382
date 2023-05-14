import { Fp1, Fp12 } from "./fields"
import { mod, powHelper, fp12FromBigInt, order, groupOrder } from "./fields"
import { zeroFp12 } from "./fields"
import { untwist, pointDouble, pointAdd, point } from "./points"

// https://crypto.stanford.edu/pbc/thesis.pdf [section 3.9.2, the tate pairing, algorithm 3, line 4]
// calculate Tz(Q) / V2z(Q)
function doubleEval(fp2Point: point, fpPoint: point) {
    let wideR = untwist(fp2Point)

    let slope = (
        wideR.x.mul(wideR.x).mul(fp12FromBigInt(3n))
    ).mul(
        wideR.y.mul(fp12FromBigInt(2n)).inv()
    )
    let v = wideR.y.sub(
        slope.mul(wideR.x)
    )

    let fpPointY = fpPoint.y as Fp1
    let fpPointX = fpPoint.x as Fp1

    return fp12FromBigInt(fpPointY.a0).sub(
        fp12FromBigInt(fpPointX.a0).mul(slope)
    ).sub(
        v
    )
}

function addEvalHelper(fp12PointR: point, fp12PointQ: point, fpPoint: point) {
    
    let slope = (fp12PointQ.y.sub(fp12PointR.y)).mul(
        (
            fp12PointQ.x.sub(fp12PointR.x)
        ).inv()
    )

    let v = (
        (
            fp12PointQ.y.mul(fp12PointR.x)
        ).sub(
            fp12PointR.y.mul(fp12PointQ.x)
        )
    ).mul(
        (
            fp12PointR.x.sub(fp12PointQ.x)
        ).inv()
    )

    let fpPointY = fpPoint.y as Fp1
    let fpPointX = fpPoint.x as Fp1

    return fp12FromBigInt(fpPointY.a0).sub(
        fp12FromBigInt(fpPointX.a0).mul(slope)
    ).sub(
        v
    )
}

// https://crypto.stanford.edu/pbc/thesis.pdf [section 3.9.2, the tate pairing, algorithm 3, line 7]
// calculate Lz,p(Q) / Vz+p(Q)
function addEval(fp2PointR: point, fp2PointQ: point, fpPoint: point) {
    let wideR = untwist(fp2PointR)
    let wideQ = untwist(fp2PointQ)

    let wideQY = wideQ.y as Fp12
    let wideRX = wideR.x as Fp12

    if (wideR.x.eq(wideQ.x) && wideR.y.eq(zeroFp12.sub(wideQY))) {
        let fpPointX = fpPoint.x as Fp1
        return fp12FromBigInt(fpPointX.a0).sub(wideRX)
    } else {
        return addEvalHelper(wideR, wideQ, fpPoint)
    }
}

/**
 * Helper function for the Miller loop in the Tate pairing algorithm.
 *
 * @param {point} fpPointP - The point P on the elliptic curve over Fp.
 * @param {point} fp2PointQ - The point Q on the elliptic curve over Fp2.
 * @param {point} fp2PointR - The point R on the elliptic curve over Fp2.
 * @param {boolean[]} boolsArr - The array of booleans representing the binary decomposition of the curve parameter b.
 * @param {Fp12} fp12Result - The Fp12 accumulator used in the Miller loop.
 * @returns {Fp12} The resulting Fp12 value after processing the Miller loop.
 */
function millerHelper(fpPointP: point, fp2PointQ: point, fp2PointR: point, boolsArr: boolean[], fp12Result: Fp12): Fp12 {
    if (boolsArr.length == 0) {
        return fp12Result;
    }

    let accum = fp12Result.mul(fp12Result).mul(doubleEval(fp2PointR, fpPointP))

    let doubleR = pointDouble(fp2PointR)

    if (boolsArr[0]) {
        boolsArr.shift()
        return millerHelper(fpPointP, fp2PointQ, pointAdd(doubleR, fp2PointQ), boolsArr, accum.mul(addEval(doubleR, fp2PointQ, fpPointP)))
    } else {
        boolsArr.shift()
        return millerHelper(fpPointP, fp2PointQ, doubleR, boolsArr, accum)
    }
}

// Miller algorithm for Tate pairing, based on https://crypto.stanford.edu/pbc/thesis.pdf [section 3.9.2, the tate pairing, algorithm 3].
/**
 * Computes the Miller loop in the Tate pairing algorithm.
 *
 * @param {point} fpPointP - The point P on the elliptic curve over Fp.
 * @param {point} fp2PointQ - The point Q on the elliptic curve over Fp2.
 * @returns {Fp12} The resulting Fp12 value after computing the Miller loop.
 */
function miller(fpPointP: point, fp2PointQ: point): Fp12 {

    let iterations : boolean[] = [];

    // curve x
    let b = 0xd201000000010000n

    while (b > 0n) {
        let theBool = mod(b, 2n) > 0n
        
        iterations.push(theBool);
        b = b >> 1n;
    }

    iterations.reverse().splice(0, 1); // remove first element

    return millerHelper(fpPointP, fp2PointQ, fp2PointQ, iterations, fp12FromBigInt(1n))
}

// Calculate the pairing function without final exponentiation.
// For some x, we have pairing(g1, sigma)^x = pairing(pk, H(m))^x,
// where x happens to be (order^12 - 1) / groupOrder.
/**
 * Computes the pairing of two points without final exponentiation.
 *
 * @param {point} p - The point P on the elliptic curve over Fp.
 * @param {point} q - The point Q on the elliptic curve over Fp2.
 * @returns {Fp12} The pairing value without final exponentiation if both points are on their respective curves and in their respective subgroups; otherwise, returns the zero value in Fp12.
 */
function pairing(p: point, q: point): Fp12 {
    if ( p.isInf || q.isInf ) {
        return zeroFp12;
    }

    if (
        p.isOnCurve() && 
        p.isInSubGroup() && 
        q.isOnCurve() && 
        q.isInSubGroup()
    ) {
        return miller(p, q)
    } else {
        return zeroFp12;
    }
}

// Raise the calculated Miller output to the power (order^12 - 1) / groupOrder.
// Final exponentiation step in the Tate pairing algorithm.
/**
 * Computes the final exponentiation in the Tate pairing algorithm.
 *
 * @param {Fp12} p - The Fp12 value resulting from the Miller loop.
 * @returns {Fp12} The final exponentiated Fp12 value.
 */
function finalExponentiate(p: Fp12): Fp12 {
    return powHelper(p, ((order ** 12n) - 1n) / groupOrder) as Fp12 
}

export { pairing, miller, doubleEval, addEval, finalExponentiate }