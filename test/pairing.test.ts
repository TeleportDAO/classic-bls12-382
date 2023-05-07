import { expect } from "chai"
import { pointMul, point } from "../src/points"
import { groupOrder } from "../src/fields"
import { Fp1, Fp2 } from "../src/fields"

import { pairing, doubleEval, addEval } from "../src/pairing"

const pairingTestVector = require("./fixtures/pairing.json")

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

describe("Pairing", () => {
    it("pairing properties checks", function() {
        for (let i = 0; i < pairingTestVector.length; i++) {
            let p = createG1Point(
                BigInt("0x" + pairingTestVector[i].points[0].p1x),
                BigInt("0x" + pairingTestVector[i].points[0].p1y)
            )

            let q = createG2Point(
                BigInt("0x" + pairingTestVector[i].points[0].q1x_a0),
                BigInt("0x" + pairingTestVector[i].points[0].q1x_a1),
                BigInt("0x" + pairingTestVector[i].points[0].q1y_a0),
                BigInt("0x" + pairingTestVector[i].points[0].q1y_a1),
            )

            let pairingRes = pairing(p, q)
            let pairingRes2 = pairing(p.pointNegate(), q)
            expect(
                pairingRes.mul(pairingRes2).equalOne()
            ).to.equal(true)

            let coeff1 = 966572263166434944599183957482752531047038993953916430862595578899059824912156165297149403978420723932172123775406n;
            let coeff2 = 842321951799503469014964953496381065608123412078137658319961132736911642409943969612292629578043499296195717122533n;

            pairingRes = pairing(
                pointMul(coeff1, p), 
                pointMul(coeff2, q)
            )
            pairingRes2 = pairing(
                p, 
                pointMul(
                    (coeff1 * coeff2) % (groupOrder), 
                    q
                )
            )
            expect(
                pairingRes.eq(pairingRes2)
            ).to.equal(true)
        }

    }).timeout(20000)

    // it("double eval and add eval", function() {
    //     for (let i = 0; i < pairingTestVector.length; i++) {
    //         let p = createG1Point(
    //             BigInt("0x" + pairingTestVector[i].points[0].p1x),
    //             BigInt("0x" + pairingTestVector[i].points[0].p1y)
    //         )

    //         let q = createG2Point(
    //             BigInt("0x" + pairingTestVector[i].points[0].q1x_a0),
    //             BigInt("0x" + pairingTestVector[i].points[0].q1x_a1),
    //             BigInt("0x" + pairingTestVector[i].points[0].q1y_a0),
    //             BigInt("0x" + pairingTestVector[i].points[0].q1y_a1),
    //         )
        
    
    //         let doubleEvalRes = doubleEval(q, p)
    //         let addEvalRes = addEval(q, q, p)
    //         expect(
    //             doubleEvalRes.eq(addEvalRes)
    //         ).to.equal(true)
    //     }
    
    // }).timeout(20000)
})