import { expect } from "chai"
import { point } from "../src/points"
import { Fp1, Fp2 } from "../src/fields"

import { pairing } from "../src/pairing"

const pairingTestVector = require("./fixtures/pairing.json")
// const bls = require('@noble/bls12-381');

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

describe("Verification", () => {

    it.only("verify test", function() {
        for (let i = 0; i < pairingTestVector.length; i++) {
            let p1 = createG1Point(
                BigInt("0x" + pairingTestVector[i].points[0].p1x),
                BigInt("0x" + pairingTestVector[i].points[0].p1y)
            )

            let q1 = createG2Point(
                BigInt("0x" + pairingTestVector[i].points[0].q1x_a1),
                BigInt("0x" + pairingTestVector[i].points[0].q1x_a0),
                BigInt("0x" + pairingTestVector[i].points[0].q1y_a1),
                BigInt("0x" + pairingTestVector[i].points[0].q1y_a0)
            )

            let p2 = createG1Point(
                BigInt("0x" + pairingTestVector[i].points[0].p1x),
                BigInt("0x" + pairingTestVector[i].points[0].p1y)
            )

            let q2 = createG2Point(
                BigInt("0x" + pairingTestVector[i].points[0].q1x_a1),
                BigInt("0x" + pairingTestVector[i].points[0].q1x_a0),
                BigInt("0x" + pairingTestVector[i].points[0].q1y_a1),
                BigInt("0x" + pairingTestVector[i].points[0].q1y_a0)
            )

            let pairingRes = pairing(p1.pointNegate(), q1)
            let pairingRes2 = pairing(p2, q2)
            expect(
                pairingRes.mul(pairingRes2).equalOne()
            ).to.equal(true)
        }

    }).timeout(20000)

    // it("messageVerification", async function() {
    //     let hashedMessage = "01a6ba2f9a11fa5598b2d8ace0fbe0a0eacb65deceb476fbbcb64fd24557c2f4"
    //     let moc = (await bls.PointG2.hashToCurve(hashedMessage)).toAffine()
    //     let privateKey = 0x63eda653299d7d483339d80809a1d80553bda402fffe5bfeffaaffff00000001n
    
    //     let G = new point (
    //         fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
    //         fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
    //         false 
    //     )
    
    //     let P = pointMul(privateKey, G)
    
    //     let Hm = new point (
    //         new Fp2(
    //             fp1FromBigInt(moc[0].c0.value),
    //             fp1FromBigInt(moc[0].c1.value),
    //         ),
    //         new Fp2(
    //             fp1FromBigInt(moc[1].c0.value),
    //             fp1FromBigInt(moc[1].c1.value),
    //         ),
    //         false
    //     )
    
    //     let S = pointMul(privateKey, Hm)
    
    //     if (!P.isOnCurve() || !P.isInSubGroup())
    //         throw("invalid publickey")
    //     if (!Hm.isOnCurve() || !Hm.isInSubGroup())
    //         throw("invalid message")
    //     if (!S.isOnCurve() || !S.isInSubGroup())
    //         throw("invalid signature")
    //     if (!G.isOnCurve() || !G.isInSubGroup())
    //         throw("invalid generator point")
    
    //     let pairingRes = pairing(P.pointNegate(), Hm)
    //     let pairingRes2 = pairing(G, S)
    
    //     expect(
    //         pairingRes.mul(pairingRes2).equalOne()
    //     ).to.equal(true)
    // }).timeout(80000)
})
