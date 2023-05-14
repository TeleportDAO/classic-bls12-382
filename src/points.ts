import { Fp, Fp1, Fp2, Fp6, Fp12, groupOrder } from "./fields";
import { mod } from "./fields";


/**
 * Represents a point on an elliptic curve using two coordinates x and y.
 * This class also includes several methods for working with points on the curve.
 */
class point {
    public x: Fp;
    public y: Fp;
    public isInf: Boolean;

    /**
     * Creates a new point object.
     *
     * @param {Fp} x - The x-coordinate of the point.
     * @param {Fp} y - The y-coordinate of the point.
     * @param {Boolean} isInf - A boolean flag indicating if the point represents the point at infinity.
     */
    constructor(
        x: Fp, 
        y: Fp, 
        isInf: Boolean
    ){
        if (typeof x != typeof y ) {
            throw Error("error: x and y must have same types")
        } else {
            this.x = x;
            this.y = y;
            this.isInf = isInf;
        }
    }

    /**
     * Displays information about the point, including the x and y coordinates.
     */
    displayInfo(){
        console.log("x:")
        this.x.displayInfo()
        console.log("y:")
        this.y.displayInfo()
    }

    /**
     * Checks if the point is in the curve's subgroup.
     *
     * @returns {Boolean} True if the point is in the subgroup, false otherwise.
     */
    isInSubGroup(): Boolean {
        let mustInf = pointMul(groupOrder, this)
        return mustInf.isInf;
    }

    /**
     * Compares two points for equality.
     *
     * @param {point} q - The other point to compare with.
     * @returns {Boolean} True if the points are equal, false otherwise.
     */
    eq(q: point): Boolean {
        if (this.isInf) {
            return this.isInf == q.isInf
        } else {
            return this.x.eq(q.x) && this.y.eq(q.y) && this.isInf == q.isInf
        }
    }

    /**
     * Checks if the point lies on the elliptic curve.
     *
     * @returns {Boolean} True if the point is on the curve, false otherwise.
     */
    isOnCurve(): Boolean {
        if (this.isInf) 
            return false;

        return this.y.mul(this.y).eq(
            this.x.mul(
                this.x.mul(this.x)
            ).add(
                this.x.fromBigInt(4n).mulNonres()
            )
        )
    }

    /**
     * Negates the point on the elliptic curve.
     *
     * @returns {point} The negated point.
     */
    pointNegate(): point {
        return new point(
            this.x,
            this.y.zero().sub(this.y),
            this.isInf
        )
    }

    /**
     * Returns the point at infinity for the elliptic curve.
     *
     * @returns {point} The point at infinity.
     */
    pointAtInfinity(): point {
        return new point(
            this.x.zero(),
            this.y.zero(),
            true
        )
    }
}

/**
 * Doubles a point on the elliptic curve.
 *
 * @param {point} p - The point to double.
 * @returns {point} The doubled point.
 */
function pointDouble(p: point): point {
    if (p.isInf) {
        return p
    }

    let slope, x3, y3;
    slope = (p.x.mul(p.x).mul(p.x.fromBigInt(3n))).mul((p.y.mul(p.y.fromBigInt(2n))).inv())
    x3 = (slope.mul(slope)).sub((p.x.mul(p.x.fromBigInt(2n))))
    y3 = ((p.x.sub(x3)).mul(slope)).sub(p.y)

    return new point (x3, y3, false)
}

/**
 * Adds two points on the elliptic curve.
 *
 * @param {point} p - The first point.
 * @param {point} q - The second point.
 * @returns {point} The sum of the two points.
 */
function pointAdd(p: point, q: point): point {
    if (p.isInf) {
        return q
    }
    if (q.isInf) {
        return p
    }

    if (p.x.eq(q.x) && p.y.eq(q.y)) {
        return pointDouble(p);
    } else if (p.x.eq(q.x) && !p.y.eq(q.y)) {
        return p.pointAtInfinity(); 
    } 

    let slope, x3, y3

    let b1 = q.x.sub(p.x)
    slope = b1.inv()
    let theSub = q.y.sub(p.y)

    slope = theSub.mul(slope)

    x3 = (slope.mul(slope)).sub((p.x.add(q.x)))
    y3 = ((p.x.sub(x3)).mul(slope)).sub(p.y)
    
    return new point(x3, y3, false);
}

let zeroFp1 = new Fp1 (0n)
let oneFp1 = new Fp1 (1n)
let zeroFp2 = new Fp2 (zeroFp1, zeroFp1)
let oneFp2 = new Fp2 (oneFp1, zeroFp1)
let zeroFp6 = new Fp6 (zeroFp2, zeroFp2, zeroFp2)

// untwist maps a point in G2 space into a point in G12 space
function untwist(fp2Point: point): point {
    // FIXME: what if the point is point at infinity

    let root = new Fp6(zeroFp2, oneFp2, zeroFp2)
    let fp2PointX = fp2Point.x as Fp2
    let wideXA0 = new Fp6(fp2PointX, zeroFp2, zeroFp2)
    let wideX = new Fp12(wideXA0, zeroFp6)
    let forInvX = new Fp12(root, zeroFp6)
    wideX = wideX.mul(forInvX.inv())


    let fp2PointY = fp2Point.y as Fp2
    let wideYA0 = new Fp6(fp2PointY, zeroFp2, zeroFp2)
    let wideY = new Fp12(wideYA0, zeroFp6)
    let forInvY = new Fp12(zeroFp6, root)
    wideY = wideY.mul(forInvY.inv())

    return new point(wideX, wideY, false)
}

/**
 * Multiplies a point on the elliptic curve by a scalar.
 *
 * @param {bigint} scalar - The scalar to multiply the point with.
 * @param {point} base - The base point on the elliptic curve.
 * @returns {point} The resulting point after multiplication.
 */
function pointMul(scalar: bigint, base: point): point {
    if (base.isInf) {
        return base.pointAtInfinity()
    }
    if (
        base.isOnCurve() && 
        scalar > 0n
    ) {
        return pointMulHelper(scalar, base, new point(base.x.zero(), base.x.zero(), true));
    } else if (base.isOnCurve() && scalar == 0n) {
        return base.pointAtInfinity();
    } else if (base.isOnCurve() && scalar < 0n) {
        return pointMulHelper(-1n * scalar, base.pointNegate(), base.pointAtInfinity());
    }
    
    throw Error("error: is not on curve")
}
  
/**
 * Helper function for point multiplication. Implements the double-and-add algorithm.
 *
 * @param {bigint} scalar - The scalar to multiply the point with.
 * @param {point} base - The base point on the elliptic curve.
 * @param {point} accum - The accumulator point for the double-and-add algorithm.
 * @returns {point} The resulting point after multiplication.
 */
function pointMulHelper(scalar: bigint, base: point, accum: point): point {
    if (scalar == 0n) {
        return accum;
    }
    const doubleBase = pointAdd(base, base);
    if ((mod(scalar, 2n)) == 1n) {
        pointAdd(accum, base)
        return pointMulHelper(scalar / 2n, doubleBase, pointAdd(accum, base));
    } else {
        return pointMulHelper(scalar / 2n, doubleBase, accum);
    }
}


export { untwist, pointDouble, pointAdd, pointMul, point }