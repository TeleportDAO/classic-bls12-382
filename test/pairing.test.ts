import { expect } from "chai"
import { pointMul, point } from "../src/points"
import { groupOrder } from "../src/fields"
import { Fp1, Fp2 } from "../src/fields"
import { pairing, finalExponentiate } from "../src/pairing"
import { createG1Point, createG2Point } from "./test_utils"

const pairingTestVector = require("./fixtures/pairing2.json")

describe("Pairing", () => {
    it("pairing properties checks", function() {
        for (let i = 0; i < pairingTestVector.length; i++) {
            if (pairingTestVector[i].points.length == 1) {
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

                let coeff1 = 966572263166434944599183957482752531047038993953916430862595578899059824912156165297149403978420723932172123775406n;
                let coeff2 = 842321951799503469014964953496381065608123412078137658319961132736911642409943969612292629578043499296195717122533n;

                let pairingRes = pairing(
                    pointMul(coeff1, p).pointNegate(), 
                    pointMul(coeff2, q)
                )
                let pairingRes2 = pairing(
                    p, 
                    pointMul(
                        (coeff1 * coeff2) % (groupOrder), 
                        q
                    )
                )
                expect(
                    finalExponentiate(pairingRes.mul(pairingRes2)).equalOne()
                ).to.equal(true)
            }
        }

    }).timeout(200000)

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