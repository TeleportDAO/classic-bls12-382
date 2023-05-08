import { expect } from "chai"
import { point } from "../src/points"
import { g1PointCompress, uncompressG1Point } from "../src/compress"
import { createG1Point, createG2Point } from "./test_utils"

const g1CompressTestVector = require("./fixtures/g1_compress.json")


describe("Compress/Uncompress", () => {


    it.only("g1", function() {
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
                uncompressG1Point("0x" + cp).eq(p)
            ).to.equal(true)
        }

    }).timeout(200000)
})
