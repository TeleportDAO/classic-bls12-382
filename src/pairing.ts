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

// implementation based on https://crypto.stanford.edu/pbc/thesis.pdf [section 3.9.2, the tate pairing, algorithm 3]
// miller algorithm for Tate pairing
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

// calculate pairing function without final exponentiation
// for some x we have pairing(g1, sigma)^x = pairing(pk, H(m))^x
// x happens to be (order^12 - 1) / groupOrder
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

// raise calculated miller output to power (order^12 - 1) / groupOrder
function finalExponentiate(p: Fp12): Fp12 {
    return powHelper(p, ((order ** 12n) - 1n) / groupOrder) as Fp12 
}

export { pairing, miller, doubleEval, addEval, finalExponentiate }