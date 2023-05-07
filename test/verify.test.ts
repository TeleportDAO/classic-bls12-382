import { expect } from "chai"
import { point } from "../src/points"
import { Fp1, Fp2 } from "../src/fields"

import { pairing } from "../src/pairing"

const pairingTestVector = require("./fixtures/pairing2.json")
// const bls = require('@noble/bls12-381');

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

describe("Verification", () => {

    it("check pairing tests", function() {

        let P = createG1Point(
            BigInt(0x00000000000000000000000000000000043c4ff154778330b4d5457b7811b551dbbf9701b402230411c527282fb5d2ba12cb445709718d5999e79fdd74c0a670n),
            BigInt(0x00000000000000000000000000000000013a80ede40df002b72f6b33b1f0e3862d505efbe0721dce495d18920d542c98cdd2daf5164dbd1a2fee917ba943deben),
        )
    
        let Q = createG2Point(
            BigInt(0x0000000000000000000000000000000001c2d8d353d5983f22a5313ddd58fdc0d9c994b2915dbc87a9b65b7b98ff00b62e140a27dc322d42b3ad190c1b3728ddn),
            BigInt(0x0000000000000000000000000000000010412f3625947b38bb380a6ed059f1677b7a7afcb91517837c563dadd0e285b95740a200ddff6570d4d92bb636b625bbn),
            BigInt(0x0000000000000000000000000000000015f4f9a480a57bd1b2388532ab045a1ba93d2f6589a3022c585fe06a1d611165c99d70be06251812405c9c37d6e9f773n),
            BigInt(0x0000000000000000000000000000000001a78e6c5062a6634a56e9853ff5afacb2e7cf31fd0ea5f0d8c8ac6174c88133cf2f63450ec4590544c9a0e37daac1f9n),
        )
    
        expect(
            P.isOnCurve()
        ).to.equal(true)

        expect(
            Q.isOnCurve()
        ).to.equal(true)
    
        expect(
            P.isInSubGroup()
        ).to.equal(true)

        expect(
            Q.isInSubGroup()
        ).to.equal(true)


        let R = createG1Point(
            BigInt(0x00000000000000000000000000000000043c4ff154778330b4d5457b7811b551dbbf9701b402230411c527282fb5d2ba12cb445709718d5999e79fdd74c0a670n),
            BigInt(0x0000000000000000000000000000000018c690fc5571f69793ec3c82915ac9513726ec891312f4f11dd3ba0ee95cc98b50d925099b0642e58a106e8456bbcbedn),
        )
    
        let S = createG2Point(
            BigInt(0x0000000000000000000000000000000001c2d8d353d5983f22a5313ddd58fdc0d9c994b2915dbc87a9b65b7b98ff00b62e140a27dc322d42b3ad190c1b3728ddn),
            BigInt(0x0000000000000000000000000000000010412f3625947b38bb380a6ed059f1677b7a7afcb91517837c563dadd0e285b95740a200ddff6570d4d92bb636b625bbn),
            BigInt(0x0000000000000000000000000000000015f4f9a480a57bd1b2388532ab045a1ba93d2f6589a3022c585fe06a1d611165c99d70be06251812405c9c37d6e9f773n),
            BigInt(0x0000000000000000000000000000000001a78e6c5062a6634a56e9853ff5afacb2e7cf31fd0ea5f0d8c8ac6174c88133cf2f63450ec4590544c9a0e37daac1f9n),
        )

        expect(
            R.isOnCurve()
        ).to.equal(true)

        expect(
            S.isOnCurve()
        ).to.equal(true)
    
        expect(
            R.isInSubGroup()
        ).to.equal(true)

        expect(
            S.isInSubGroup()
        ).to.equal(true)
        

        let pairingRes = pairing(P, Q)
        // let pairingRes = pairing(P, Hm)
        // console.log("pairingRes1: ")
        // pairingRes.displayInfo()

        let pairingRes2 = pairing(R, S)
        // console.log("pairingRes2: ")
        // pairingRes2.displayInfo()
    
        // expect(
        //     pairingRes.mul(pairingRes2).equalOne()
        // ).to.equal(true)

        expect(
            pairingRes.mul(pairingRes2).equalOne()
        ).to.equal(true)

    }).timeout(20000)


    it.only("verify test", function() {
        for (let i = 0; i < pairingTestVector.length; i++) {
            if (pairingTestVector[i].points.length == 2) {
                console.log(i)
                let p1 = createG1Point(
                    BigInt("0x" + pairingTestVector[i].points[0].p1x),
                    BigInt("0x" + pairingTestVector[i].points[0].p1y)
                )
    
                let q1 = createG2Point(
                    BigInt("0x" + pairingTestVector[i].points[0].q1x_a0),
                    BigInt("0x" + pairingTestVector[i].points[0].q1x_a1),
                    BigInt("0x" + pairingTestVector[i].points[0].q1y_a0),
                    BigInt("0x" + pairingTestVector[i].points[0].q1y_a1),
                )
    
                let p2 = createG1Point(
                    BigInt("0x" + pairingTestVector[i].points[1].p1x),
                    BigInt("0x" + pairingTestVector[i].points[1].p1y)
                )
    
                let q2 = createG2Point(
                    BigInt("0x" + pairingTestVector[i].points[1].q1x_a0),
                    BigInt("0x" + pairingTestVector[i].points[1].q1x_a1),
                    BigInt("0x" + pairingTestVector[i].points[1].q1y_a0),
                    BigInt("0x" + pairingTestVector[i].points[1].q1y_a1),
                    
                )

                let pairingRes = pairing(p1, q1)
                let pairingRes2 = pairing(p2, q2)

                expect(
                    pairingRes.mul(pairingRes2).equalOne()
                ).to.equal(true)
            }
        }

    }).timeout(20000000)

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
