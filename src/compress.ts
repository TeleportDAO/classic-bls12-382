import { order, mod } from "./fields"
import { Fp1 } from "./fields"
import { point } from "./points";

const POW_2_381 = 2n ** 381n;
const POW_2_382 = POW_2_381 * 2n; 
const POW_2_383 = POW_2_382 * 2n;

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

  let flaggedValue = BigInt(theHex)

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

export { g1PointCompress, uncompressG1Point }