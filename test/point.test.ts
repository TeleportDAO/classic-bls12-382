import { expect } from "chai";
import { point, pointAdd, pointMul } from '../src/points';
import { Fp1, Fp2, Fp6, Fp12, groupOrder } from '../src/fields';

const g1AddTestVector = require("./fixtures/g1_add.json")
const g2AddTestVector = require("./fixtures/g2_add.json")

const g1MulTestVector = require("./fixtures/g1_mul.json")
const g2MulTestVector = require("./fixtures/g2_mul.json")

let zeroFp1 = new Fp1 (0n)
let oneFp1 = new Fp1 (1n)
let zeroFp2 = new Fp2 (zeroFp1, zeroFp1)
let oneFp2 = new Fp2 (oneFp1, zeroFp1)
let zeroFp6 = new Fp6 (zeroFp2, zeroFp2, zeroFp2)
let oneFp6 = new Fp6 (oneFp2, zeroFp2, zeroFp2)
let zeroFp12 = new Fp12 (zeroFp6, zeroFp6)
let oneFp12 = new Fp12 (oneFp6, zeroFp6)

function createG1Point(xStr: bigint, yStr: bigint): point {
    return new point(
        new Fp1(xStr),
        new Fp1(yStr),
        false
    )
}

function createG2Point(
    xStr_a1: bigint, 
    xStr_a0: bigint, 
    yStr_a1: bigint,
    yStr_a0: bigint,
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

describe("Points", () => {

    it("g1 add", function() {
        for (let i = 0; i < g1AddTestVector.length; i++) {
            let p1 = createG1Point(
                BigInt("0x" + g1AddTestVector[i].p1x),
                BigInt("0x" + g1AddTestVector[i].p1y)
            )
    
            let p2 = createG1Point(
                BigInt("0x" + g1AddTestVector[i].p2x),
                BigInt("0x" + g1AddTestVector[i].p2y)
            )
    
            let res = createG1Point(
                BigInt("0x" + g1AddTestVector[i].rsx),
                BigInt("0x" + g1AddTestVector[i].rsy)
            )
    
            let p1PlusP2 = pointAdd(p1, p2)
    
            expect(
                res.eq(p1PlusP2)
            ).to.equal(true)
        }
    })

    it("g1 mul", function() {
        for (let i = 0; i < g1MulTestVector.length; i++) {
            let p1 = createG1Point(
                BigInt("0x" + g1MulTestVector[i].p1x),
                BigInt("0x" + g1MulTestVector[i].p1y)
            )
    
            let scalar = BigInt("0x" + g1MulTestVector[i].scalar)
    
            let res = createG1Point(
                BigInt("0x" + g1MulTestVector[i].rsx),
                BigInt("0x" + g1MulTestVector[i].rsy)
            )
    
            let sclMulP1 = pointMul(scalar, p1)
    
            expect(
                res.eq(sclMulP1)
            ).to.equal(true)
        }
    }).timeout(20000)

    it("g2 add", function() {
        for (let i = 0; i < g2AddTestVector.length; i++) {
            let p1 = createG2Point(
                BigInt("0x" + g2AddTestVector[i].p1x_a1),
                BigInt("0x" + g2AddTestVector[i].p1x_a0),
                BigInt("0x" + g2AddTestVector[i].p1y_a1),
                BigInt("0x" + g2AddTestVector[i].p1y_a0)
            )
    
            let p2 = createG2Point(
                BigInt("0x" + g2AddTestVector[i].p2x_a1),
                BigInt("0x" + g2AddTestVector[i].p2x_a0),
                BigInt("0x" + g2AddTestVector[i].p2y_a1),
                BigInt("0x" + g2AddTestVector[i].p2y_a0)
            )
    
            let res = createG2Point(
                BigInt("0x" + g2AddTestVector[i].rsx_a1),
                BigInt("0x" + g2AddTestVector[i].rsx_a0),
                BigInt("0x" + g2AddTestVector[i].rsy_a1),
                BigInt("0x" + g2AddTestVector[i].rsy_a0)
            )
    
            let p1PlusP2 = pointAdd(p1, p2)
    
            expect(
                res.eq(p1PlusP2)
            ).to.equal(true)
        }
    })

    it("g2 mul", function() {

        for (let i = 0; i < g2MulTestVector.length; i++) {
            let p1 = createG2Point(
                BigInt("0x" + g2MulTestVector[i].p1x_a1),
                BigInt("0x" + g2MulTestVector[i].p1x_a0),
                BigInt("0x" + g2MulTestVector[i].p1y_a1),
                BigInt("0x" + g2MulTestVector[i].p1y_a0)
            )
    
            let scalar = BigInt("0x" + g2MulTestVector[i].scalar)
    
            let res = createG2Point(
                BigInt("0x" + g2MulTestVector[i].rsx_a1),
                BigInt("0x" + g2MulTestVector[i].rsx_a0),
                BigInt("0x" + g2MulTestVector[i].rsy_a1),
                BigInt("0x" + g2MulTestVector[i].rsy_a0)
            )
    
            let sclMuP1 = pointMul(scalar, p1)
    
            expect(
                res.eq(sclMuP1)
            ).to.equal(true)
        }
    }).timeout(20000)
    
    it.only("point at infinity", function() {
        for (let i = 0; i < g2MulTestVector.length; i++) {
            let p1 = createG2Point(
                BigInt("0x" + g2MulTestVector[i].p1x_a1),
                BigInt("0x" + g2MulTestVector[i].p1x_a0),
                BigInt("0x" + g2MulTestVector[i].p1y_a1),
                BigInt("0x" + g2MulTestVector[i].p1y_a0)
            )
    
            let orderMuP1 = pointMul(groupOrder, p1)
            expect(
                orderMuP1.isInf
            ).to.equal(true)
        }
    }).timeout(200000)
    
})
