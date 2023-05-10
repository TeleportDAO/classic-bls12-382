// curve x = -0xd201000000010000
// BLS field modulus which is equal to ⅓(x-1)^2(x^4 - x^2 + 1) + x
let order: bigint = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn
// BLS subgroup order which is equal to (x^4 - x^2 + 1)
let groupOrder: bigint = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n

function mod(a: bigint, b: bigint): bigint {
    return ((a % b) + b) % b;
}

function modPow(base: Fp, exponent: bigint, modulus: bigint): Fp {
    if (exponent === 0n) return base.one();
    if (exponent === 1n) return base;
    if (modulus === 1n) return base.zero();
    // let result = 1n;
    let result: Fp = base.one();
    // base = mod(base, modulus);
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = result.mul(base)
      }
      exponent = exponent >> 1n
      base = base.mul(base)
    }
    return result;
}

// binary extended euclidean algorithm
// used this algorithm to find inverse of u mod v
// actual beea finds x1 and x2 which u * x1 + v * x2 = gcd(u, v) without using division
// since order is a prime number, gcd(this, order) = 1 and 
// so u * x1 + v * x2 (mod v) = u * x1 (mod v) = 1, therefore x1 is inverse of u

const modifiedBeea = (
    u: bigint, 
    v: bigint, 
    x1: bigint, 
    x2: bigint, 
    p: bigint
) => {
    let theInv = 0n

    while (u != 1n && v != 1n) {
        while (mod(u, 2n) == 0n && u > 0n) {
            u = u / 2n
            if (mod(x1, 2n) == 0n)
                x1 = x1 / 2n
            else 
                x1 = (x1 + p) / 2n
        }
        while (mod(v, 2n) == 0n) {
            v = v / 2n
            if (mod(x2, 2n) == 0n )
                x2 = x2 / 2n
            else 
                x2 = (x2 + p) / 2n
        }
        if (u > v) {
            u = u - v
            x1 = x1 - x2
        } else {
            v = v - u
            x2 = x2 -x1
        }
    }

    if (u == 1n) {
        theInv = mod(x1, p)
    }
    else {
        theInv = mod(x2, p)
    }

    return theInv;
    
}

interface Fp{
  	displayInfo(): void;
    inv(): any;
    add(y: any): any;
    sub(y: any): any;
    mul(y: any): any;
    equalOne(): Boolean;
    mulNonres(): any;
    pow(a: bigint): any;
    eq(y: any): Boolean;
    fromBigInt(x: bigint): any;
    zero(): any;
    one(): any;
}

class Fp1 implements Fp {
    public a0: bigint;
	constructor(a0: bigint){
      	this.a0 = mod(a0, order);
    }
  	displayInfo() {
        console.log("a0: ", this.a0)
    }
    inv(): Fp1{
        return new Fp1(
            modifiedBeea(
                this.a0,
                order, 
                1n, 
                0n, 
                order
            )
        )
    }
    add(y: Fp1): Fp1 {
        return new Fp1(
            mod(this.a0 + y.a0, order)
        )
    }
    sub(y: Fp1): Fp1 {
        return new Fp1(
            mod(this.a0 - y.a0, order)
        )
    }
    mul(y: Fp1): Fp1 {
        return new Fp1(
            mod(this.a0 * y.a0, order)
        )
    }
    equalOne(): Boolean{
        return this.eq(oneFp1)
    }
    mulNonres(): Fp1 {
        return new Fp1(
            this.a0
        )
    }
    pow(a: bigint): Fp1 {
        return modPow(
            this, 
            a,
            order
        ) as Fp1
    }
    eq(y: Fp1): Boolean{
        return this.a0 == y.a0
    } 
    fromBigInt(x: bigint): Fp1 {
        return new Fp1(x)
    }
    zero(): Fp1 {
        return zeroFp1
    }
    one(): Fp1 {
        return oneFp1
    }
}

let zeroFp1 = new Fp1 (0n)
let oneFp1 = new Fp1 (1n)

// form of elements of Fp2: a0 + a1u
// ai-s are member of Fp
// calculate u from u^2 + 1 = 0 which is irreducible in fp1
class Fp2 implements Fp {
    public a0: Fp1;
    public a1: Fp1;
    
	constructor(a0: Fp1, a1: Fp1){
        this.a0 = a0;
    	this.a1 = a1;
    }
  	displayInfo(){
        console.log("a0: ", this.a0)
        console.log("a1: ", this.a1)
    }
    inv(): Fp2 {
        let factor = (
            (
                (this.a1.mul(this.a1))
            ).add(
                (this.a0.mul(this.a0))
            )
        ).inv()

        return new Fp2(
            this.a0.mul(factor),
            this.a1.mul(fp1FromBigInt(-1n)).mul(factor)
        )
    }
    add(y: Fp2): Fp2 {
        return new Fp2(
            this.a0.add(y.a0),
            this.a1.add(y.a1)
        )
    }
    sub(y: Fp2): Fp2 {
        return new Fp2(
            this.a0.sub(y.a0),
            this.a1.sub(y.a1)
        )
    }
    // using karatsuba algorithm for multiplication
    mul(y: Fp2): Fp2 {
        return new Fp2(
            (
                this.a0.mul(y.a0)
            ).sub(
                this.a1.mul(y.a1), 
            ),
            (
                this.a1.mul(y.a0)
            ).add(
                this.a0.mul(y.a1), 
            ),
        )
    }
    equalOne(): Boolean {
        return this.a1.eq(zeroFp1) && this.a0.eq(oneFp1)
    }
    // * (u + 1)
    mulNonres(): Fp2 {
        return new Fp2(
            this.a0.sub(this.a1),
            this.a1.add(this.a0)
        )
    }
    pow(a: bigint): Fp2 {
        return modPow(
            this, 
            a,
            order
        ) as Fp2
    }
    eq(y: Fp2): Boolean{
        return this.a1.eq(y.a1) && this.a0.eq(y.a0)
    } 
    fromBigInt(x: bigint): Fp2 {
        return new Fp2(fp1FromBigInt(x), zeroFp1)
    }
    zero(): Fp2 {
        return zeroFp2
    }
    one(): Fp2 {
        return oneFp2
    }
}

function fp1FromBigInt(x: bigint): Fp1 {
    return new Fp1(x)
}

function fp2FromBigInt(x: bigint): Fp2 {
    return new Fp2(fp1FromBigInt(x), zeroFp1)
}

function fp6FromBigInt(x: bigint): Fp6 {
    return new Fp6(fp2FromBigInt(x), zeroFp2, zeroFp2)
}

function fp12FromBigInt(x: bigint): Fp12 {
    return new Fp12(fp6FromBigInt(x), zeroFp6)
}

let zeroFp2 = new Fp2 (zeroFp1, zeroFp1)
let oneFp2 = new Fp2 (oneFp1, zeroFp1)

// form of elements of Fp6: b0 + b1v + b2v^2
// bi-s are member of Fp2
// calculate v from v^3 - (u + 1) = 0 which is irreducible in fp2
class Fp6 implements Fp {
    public a0: Fp2;
    public a1: Fp2;
    public a2: Fp2;
    
    
	constructor(a0: Fp2, a1: Fp2, a2: Fp2){
        this.a0 = a0;
        this.a1 = a1;
        this.a2 = a2;
    }

  	displayInfo() {
        console.log("a0: ", this.a0)
        console.log("a1: ", this.a1)
        console.log("a2: ", this.a2)
    }
    inv(): Fp6 {
        let t0 = (this.a0.mul(this.a0)).sub(this.a1.mul(this.a2).mulNonres())
        let t1 = (this.a2.mul(this.a2)).mulNonres().sub(this.a0.mul(this.a1))
        let t2 = (this.a1.mul(this.a1)).sub(this.a0.mul(this.a2))
        let factor = 
            (
                this.a0.mul(t0)
            ).add(
                (
                    (this.a2.mul(t1)).mulNonres()
                ).add(
                    (this.a1.mul(t2)).mulNonres()
                )
            ).inv()
        return new Fp6(
            t0.mul(factor),
            t1.mul(factor),
            t2.mul(factor)
        )
    }
    add(y: Fp6): Fp6 {
        return new Fp6(
            this.a0.add(y.a0),
            this.a1.add(y.a1),
            this.a2.add(y.a2)
        )
    }
    sub(y: Fp6): Fp6 {
        return new Fp6(
            this.a0.sub(y.a0),
            this.a1.sub(y.a1),
            this.a2.sub(y.a2)
        )
    }
    // using karatsuba algorithm for multiplication
    mul(y: Fp6): Fp6 {
        let t0 = this.a0.mul(y.a0)
        let t1 = this.a1.mul(y.a1)
        let t2 = this.a2.mul(y.a2)
        return new Fp6(
            t0.add(this.a1.add(this.a2).mul(y.a1.add(y.a2)).sub(t1.add(t2)).mulNonres()),
            this.a0.add(this.a1).mul(y.a0.add(y.a1)).sub(t0.add(t1)).add(t2.mulNonres()),
            t1.add(this.a0.add(this.a2).mul(y.a0.add(y.a2)).sub(t0.add(t2)))
        )
    }
    equalOne(): Boolean {
        return this.a2.eq(zeroFp2) && this.a1.eq(zeroFp2) && this.a0.eq(oneFp2)
    }

    // * v
    mulNonres(): Fp6 {
        return new Fp6(
            this.a2.mulNonres(),
            this.a0, 
            this.a1
        )
    }
    pow(a: bigint): Fp6 {
        return modPow(
            this, 
            a,
            order
        ) as Fp6
    }
    eq(y: Fp6): Boolean {
        return this.a2.eq(y.a2) && this.a1.eq(y.a1) && this.a0.eq(y.a0)
    } 
    fromBigInt(x: bigint): Fp6 {
        return new Fp6(fp2FromBigInt(x), zeroFp2, zeroFp2)
    }
    zero(): Fp6 {
        return zeroFp6
    }
    one(): Fp6 {
        return oneFp6
    }
}

let zeroFp6 = new Fp6 (zeroFp2, zeroFp2, zeroFp2)
let oneFp6 = new Fp6 (oneFp2, zeroFp2, zeroFp2)

// form of elements of Fp12: c0 + c1w
// ci-s are member of Fp6
// calculate w from w^2 - v = 0 which is irreducible inn fp6
class Fp12 implements Fp {
    public a0: Fp6;
    public a1: Fp6;
    
	constructor(a0: Fp6, a1: Fp6){
        this.a0 = a0;
    	this.a1 = a1;
    }
  	displayInfo(){
        console.log("a0: ", this.a0.displayInfo())
        console.log("a1: ", this.a1.displayInfo())
    }
    inv(): Fp12 {
        let factor = 
            ((
                this.a0.mul(this.a0)
            ).sub(
                this.a1.mul(this.a1).mulNonres()
            )).inv()
  
        return new Fp12(
            this.a0.mul(factor),
            // -1 * a1 * factor
            zeroFp6.sub(this.a1.mul(factor))
        )
    }
    add(y: Fp12): Fp12 {
        return new Fp12(
            this.a0.add(y.a0),
            this.a1.add(y.a1)
        )
    }
    sub(y: Fp12): Fp12 {
        return new Fp12(
            this.a0.sub(y.a0),
            this.a1.sub(y.a1)
        )
    }

    // using karatsuba algorithm for multiplication
    mul(y: Fp12): Fp12 {
        return new Fp12(
            (this.a0.mul(y.a0)).add((this.a1.mul(y.a1).mulNonres())),
            (this.a1.mul(y.a0)).add(this.a0.mul(y.a1))
        )
    }
    equalOne(): Boolean {
        return this.a1.eq(zeroFp6) && this.a0.eq(oneFp6)
    }
    mulNonres(): Fp12{
        throw "error: not mul non res"
    }
    pow(a: bigint): Fp12 {
        return modPow(
            this, 
            a,
            order
        ) as Fp12
    }
    eq(y: Fp12): Boolean {
        return this.a1.eq(y.a1) && this.a0.eq(y.a0)
    } 
    fromBigInt(x: bigint): Fp12 {
        return new Fp12(fp6FromBigInt(x), zeroFp6)
    }
    zero(): Fp12 {
        return zeroFp12
    }
    one(): Fp12 {
        return oneFp12
    }
}

function powHelper(a0: Fp, exp: bigint): Fp {
    let accum = a0.one();
    while (exp > 0n){
        if ((exp & 1n) != 0n) {
            accum = accum.mul(a0);
        }

        exp = exp >> 1n;
        a0 = a0.mul(a0);
    }
    return accum;
}


let zeroFp12 = new Fp12 (zeroFp6, zeroFp6)
let oneFp12 = new Fp12 (oneFp6, zeroFp6)

export { Fp, Fp1, Fp2, Fp6, Fp12 }
export { mod, powHelper, fp1FromBigInt, fp2FromBigInt, fp6FromBigInt, fp12FromBigInt }
export { order, groupOrder }
export { zeroFp1, oneFp1, zeroFp2, oneFp2, zeroFp6, oneFp6, zeroFp12, oneFp12 }