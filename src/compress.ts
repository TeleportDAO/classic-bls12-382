import { order, mod, fp1FromBigInt } from "./fields"
import { Fp1, Fp2 } from "./fields"
import { point } from "./points";

const POW_2_381 = 2n ** 381n;
const POW_2_382 = POW_2_381 * 2n; 
const POW_2_383 = POW_2_382 * 2n;

// TODO: use the modPow in fields.ts
function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = mod(base, modulus);
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = mod(result * base, modulus);
      }
      exponent = exponent >> 1n
      base = mod(base * base, modulus);
    }
    return result;
}
  
function tonelliShanks(n: bigint, p: bigint): bigint | null {
    if (modPow(n, (p - 1n) / 2n, p) !== 1n) {
      return null;
    }
  
    let q = p - 1n;
    let s = 0n;
    while (q % 2n === 0n) {
      q = q / 2n;
      s += 1n;
    }
  
    if (s === 1n) {
      return modPow(n, (p + 1n) / 4n, p);
    }
  
    let z = 2n;
    while (modPow(z, (p - 1n) / 2n, p) !== p - 1n) {
      z += 1n;
    }
  
    let c = modPow(z, q, p);
    let r = modPow(n, (q + 1n) / 2n, p);
    let t = modPow(n, q, p);
    let m = s;
    while (t !== 1n) {
      let i = 0n;
      let e = t;
      while (e !== 1n) {
        e = modPow(e, 2n, p);
        i += 1n;
      }
      const b = modPow(c, modPow(2n, m - i - 1n, p - 1n), p);
      r = mod(r * b, p);
      c = modPow(b, 2n, p);
      t = mod(t * c, p);
      m = i;
    }
    return r;
}
  
function squareRootInFiniteField(n: bigint, p: bigint): bigint[] {
    const root1 = tonelliShanks(n, p);
    if (root1 === null) {
      return [];
    }
    const root2 = p - root1;
    return [root1, root2];
}

function g1PointCompress(p: point): string {

  if (p.isInSubGroup()) {
    let X = p.x as Fp1
    let Y = p.y as Fp1

    let yFlag = (Y.a0 * 2n) / order

    let flaggedValue = X.a0 + yFlag * POW_2_381 + POW_2_383

    return flaggedValue.toString(16)

  } else {
    throw "error: the point is not in the subgroup"
  }
}

function uncompressG1Point(theHex: string): point {

  let flaggedValue = BigInt("0x" + theHex)

  if (flaggedValue >= POW_2_383) {

    let X = mod(flaggedValue, POW_2_381)
    let X3Plus4 = (X ** 3n) + 4n
    
    let ys = squareRootInFiniteField(X3Plus4, order)

    let yFlag = mod(flaggedValue, POW_2_382) / POW_2_381

    let Y = (ys[0] *2n)/ order == yFlag ? ys[0] : ys[1]

    return new point(
      new Fp1(X),
      new Fp1(Y),
      false
    )

  } else {
    throw "error: wrong uncompressed format"
  }
}

// https://eips.ethereum.org/assets/eip-3068/2012-685_Square_Root_Even_Ext.pdf
function Fp2sqrt(a: Fp2): Fp2 {
  let a1 = a.pow((order - 3n) / 4n)
  let alpha =  a1.mul((a1.mul(a)))

  let a0 = (alpha.pow(order)).mul(alpha)

  if ( a0.eq((a.zero().sub(a.one()))) ) {
      throw "error: there is no sqrt"
  }

  let x0 = a1.mul(a)

  let x: Fp2

  if ( alpha.eq((a.zero().sub(a.one()))) ) {
      x = new Fp2(
          x0.a1.zero().sub(x0.a1),
          x0.a0
      )
  } else {
      let b = (alpha.add(alpha.one())).pow((order - 1n) / 2n )
      x = b.mul(x0)
  }

  return x
}

function g2PointCompress(p: point): string {

  if (p.isInSubGroup()) {
    let X = p.x as Fp2
    let Y = p.y as Fp2

    let flag: bigint

    if (Y.a1.a0 == 0n) {
      flag = (Y.a0.a0 * 2n) / order
    } else {
      flag = (Y.a1.a0 * 2n) / order ? 1n : 0n
    }

    let flaggedx1 = X.a1.a0 + flag * POW_2_381 + POW_2_383
    let flaggedx0 = X.a0.a0

    return (flaggedx1.toString(16).padStart(96, "0") + flaggedx0.toString(16).padStart(96, "0"))

  } else {
    throw "error: the point is not in the subgroup"
  }
}

function uncompressG2Point(theHex: string): point {

  let flaggedx1 = BigInt("0x" + theHex.slice(0, 96))
  let flaggedx0 = BigInt("0x" + theHex.slice(96))

  if (flaggedx1 >= POW_2_383) {

    let X = new Fp2(
      fp1FromBigInt(flaggedx0),
      fp1FromBigInt(mod(flaggedx1, POW_2_381))
    )

    let iPlusOneMul4 = new Fp2(
      fp1FromBigInt(4n),
      fp1FromBigInt(4n)
    )

    let X3Plus4 = X.mul(X).mul(X).add(iPlusOneMul4)
    
    let Y = Fp2sqrt(X3Plus4)

    let flag: bigint

    if (Y.a1.a0 == 0n) {
      flag = (Y.a0.a0 * 2n) / order
    } else {
      flag = (Y.a1.a0 * 2n) / order ? 1n : 0n
    }

    let yFlag = mod(flaggedx1, POW_2_382) / POW_2_381

    let finalY = flag == yFlag ? Y : Y.zero().sub(Y)

    return new point(
      X,
      finalY,
      false
    )

  } else {
    throw "error: wrong uncompressed format"
  }
}

export { g1PointCompress, uncompressG1Point, g2PointCompress, uncompressG2Point }