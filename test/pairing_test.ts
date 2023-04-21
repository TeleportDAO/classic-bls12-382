import { untwist, pointDouble, pointMul, pointAdd, point } from "../src/points"
import { fp1FromBigInt, fp2FromBigInt, fp6FromBigInt, fp12FromBigInt } from "../src/fields"
import { BigNumber } from "@ethersproject/bignumber";
import { Fp, Fp1, Fp2, Fp6, Fp12 } from "../src/fields"

import { pairing, miller, doubleEval, addEval } from "../src/pairing"

const g1AddTestVector = require("./fixtures/g1_add.json")
const g2AddTestVector = require("./fixtures/g2_add.json")

function calcPairing() {
    let mew1 = new point (
        fp1FromBigInt(BigNumber.from("3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507")),
        fp1FromBigInt(BigNumber.from("1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569")),
        false 
    )


    let mew2 = new point (
        new Fp2(
            fp1FromBigInt(BigNumber.from("3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758")),
            fp1FromBigInt(BigNumber.from("352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160"))
        ),
        new Fp2(
            fp1FromBigInt(BigNumber.from("927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582")),
            fp1FromBigInt(BigNumber.from("1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905"))
        ),
        false
    )

    let pairingRes = pairing(pointMul(BigNumber.from(11), mew1), pointMul(BigNumber.from(13), mew2))
    let pairingRes2 = pairing(mew1, pointMul(BigNumber.from(143), mew2))

    pairingRes.displayInfo()
    pairingRes2.displayInfo()

    // let pairingRes = pairing(mew1, mew2)
    // console.log(pairingRes.displayInfo())
    // let pairingRes2 = pairing(mew1, pointMul(BigNumber.from(3), mew2))
    // pairingRes = pairingRes.mul(pairingRes).mul(pairingRes)
    // pairingRes2.displayInfo()
    
    // let pairingRes = pairing(mew1, mew2)
    // let pairingRes2 = pairing(mew1.pointNegate(), mew2)
    // pairingRes.inv().displayInfo()
    // pairingRes2.displayInfo()
    // console.log(pairingRes.mul(pairingRes2).eq(pairingRes.zero()))

    // console.log("result: ")
    // pairingRes.a1.displayInfo()
    // pairingRes.a0.displayInfo()

    // console.log("result: ")
    // pairingRes2.a1.displayInfo()
    // pairingRes2.a0.displayInfo()
    // // pairingRes.displayInfo()
    console.log(pairingRes.eq(pairingRes2))
}

function calcAddEvalDoubleEval() {
    let mew1 = new point (
        fp1FromBigInt(BigNumber.from(g1AddTestVector.g1_add[0].p1X)),
        fp1FromBigInt(BigNumber.from(g1AddTestVector.g1_add[0].p1Y)),
        false 
    )

    let mew2 = new point (
        new Fp2(
            fp1FromBigInt(BigNumber.from(g2AddTestVector.g2_add[0].p1X_a1)),
            fp1FromBigInt(BigNumber.from(g2AddTestVector.g2_add[0].p1X_a0))
        ),
        new Fp2(
            fp1FromBigInt(BigNumber.from(g2AddTestVector.g2_add[0].p1Y_a1)),
            fp1FromBigInt(BigNumber.from(g2AddTestVector.g2_add[0].p1Y_a0))
        ),
        false
    )

    let doubleEvalRes = doubleEval(mew2, mew1)
    // let addEvalRes = addEval(mew2, mew2, mew1)

    // console.log("result: ")

    // console.log(doubleEvalRes.eq(addEvalRes))

    // doubleEvalRes.displayInfo()
    // addEvalRes.displayInfo()

}

calcPairing()
// calcAddEvalDoubleEval()