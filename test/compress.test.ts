import { expect } from "chai"
import { point } from "../src/points"
import { g1PointCompress, uncompressG1Point, g2PointCompress, uncompressG2Point } from "../src/compress"
import { createG1Point, createG2Point } from "./test_utils"
import { Fp2 } from "../src/fields"

const g1CompressTestVector = require("./fixtures/g1_compress.json")
const g2CompressTestVector = require("./fixtures/g2_compress.json")


describe("Compress/Uncompress", () => {


    it("g1", function() {
        for (let i = 0; i < g1CompressTestVector.length; i++) {
            let p = createG1Point(
                BigInt("0x" + g1CompressTestVector[i].x),
                BigInt("0x" + g1CompressTestVector[i].y)
            )

            let cp = g1CompressTestVector[i].compressed_public_key

            expect(
                g1PointCompress(p)
            ).to.equal(cp)

            expect(
                uncompressG1Point(cp).eq(p)
            ).to.equal(true)
        }

    }).timeout(200000)

    it("g2", function() {

        for (let i = 0; i < g2CompressTestVector.length; i++) {
            let p = createG2Point(
                BigInt("0x" + g2CompressTestVector[i].x_a0),
                BigInt("0x" + g2CompressTestVector[i].x_a1),
                BigInt("0x" + g2CompressTestVector[i].y_a0),
                BigInt("0x" + g2CompressTestVector[i].y_a1)
            )

            let cp = g2CompressTestVector[i].compressed_signature

            expect(
                g2PointCompress(p)
            ).to.equal(cp)

            expect(
                uncompressG2Point(cp).eq(p)
            ).to.equal(true)
        }
    }).timeout(200000)
})
