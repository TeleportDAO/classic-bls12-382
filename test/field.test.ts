import { expect } from "chai"
import { fp1FromBigInt, fp12FromBigInt, fp6FromBigInt, fp2FromBigInt, powHelper } from "../dist/src/fields"
import { Fp2, Fp6, Fp12 } from "../dist/src/fields"

describe("Fields", () => {
    it("Fp mul and inv", function() {
        let fp = fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n)

        let mustTrue = fp.mul((fp.inv())).eq(fp1FromBigInt(1n))

        expect(
            mustTrue
        ).to.equal(true)
    })

    it("Fp pow", function() {
        let fp = fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n)

        let exp = 123n;
        let mulRes = fp1FromBigInt(1n)
        for (let i = 0; i < exp; i++)
            mulRes = mulRes.mul(fp)
        
        let powRes = powHelper(fp, exp)
        let mustTrue = powRes.eq(mulRes)

        expect(
            mustTrue
        ).to.equal(true)
    })

    it("Fp2 mul and inv", function() {
        let fp2 = new Fp2 (
            fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
            fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
        ) 

        let mustTrue = fp2.mul((fp2.inv())).eq(fp2FromBigInt(1n))

        expect(
            mustTrue
        ).to.equal(true)
    })

    it("Fp2 pow", function() {
        let fp2 = new Fp2 (
            fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
            fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
        ) 

        let exp = 123n;
        let mulRes = fp2FromBigInt(1n)
        for (let i = 0; i < exp; i++)
            mulRes = mulRes.mul(fp2)
        
        let powRes = powHelper(fp2, exp)
        let mustTrue = powRes.eq(mulRes)

        expect(
            mustTrue
        ).to.equal(true)
    })

    it("Fp6 mul and inv", function() {
        let fp2_0 = new Fp2 (
            fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
            fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
        )
    
        let fp2_1 = new Fp2(
            fp1FromBigInt(352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160n),
            fp1FromBigInt(3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758n),
        )
    
        let fp2_2 = new Fp2(
            fp1FromBigInt(1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905n),
            fp1FromBigInt(927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582n),
        )
    
        let fp6 = new Fp6(
            fp2_0,
            fp2_1,
            fp2_2
        )

        let mustTrue = fp6.mul((fp6.inv())).eq(fp6FromBigInt(1n))

        expect(
            mustTrue
        ).to.equal(true)
    })

    it("Fp6 pow", function() {
        let fp2_0 = new Fp2 (
            fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
            fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
        )
    
        let fp2_1 = new Fp2(
            fp1FromBigInt(352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160n),
            fp1FromBigInt(3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758n),
        )
    
        let fp2_2 = new Fp2(
            fp1FromBigInt(1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905n),
            fp1FromBigInt(927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582n),
        )
    
        let fp6 = new Fp6(
            fp2_0,
            fp2_1,
            fp2_2
        )

        let exp = 123n;
        let mulRes = fp6FromBigInt(1n)
        for (let i = 0; i < exp; i++)
            mulRes = mulRes.mul(fp6)
        
        let powRes = powHelper(fp6, exp)
        let mustTrue = powRes.eq(mulRes)

        expect(
            mustTrue
        ).to.equal(true)
    })


    it("Fp12 mul and inv", function() {
        let fp2_0 = new Fp2 (
            fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
            fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
        )
    
        let fp2_1 = new Fp2(
            fp1FromBigInt(352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160n),
            fp1FromBigInt(3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758n),
        )
    
        let fp2_2 = new Fp2(
            fp1FromBigInt(1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905n),
            fp1FromBigInt(927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582n),
        )
    
        let fp6_0 = new Fp6(
            fp2_0,
            fp2_1,
            fp2_2
        )

        let fp6_1 = new Fp6(
            fp2_2,
            fp2_1,
            fp2_0
        )
    
        let fp12 = new Fp12(
            fp6_0,
            fp6_1
        )
    
        let mustTrue = fp12.mul((fp12.inv())).eq(fp12FromBigInt(1n))

        expect(
            mustTrue
        ).to.equal(true)
    })

    it("Fp12 pow", function() {
        let fp2_0 = new Fp2 (
            fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
            fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
        )
    
        let fp2_1 = new Fp2(
            fp1FromBigInt(352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160n),
            fp1FromBigInt(3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758n),
        )
    
        let fp2_2 = new Fp2(
            fp1FromBigInt(1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905n),
            fp1FromBigInt(927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582n),
        )
    
        let fp6_0 = new Fp6(
            fp2_0,
            fp2_1,
            fp2_2
        )

        let fp6_1 = new Fp6(
            fp2_2,
            fp2_1,
            fp2_0
        )
    
        let fp12 = new Fp12(
            fp6_0,
            fp6_1
        )

        let exp = 123n;
        let mulRes = fp12FromBigInt(1n)
        for (let i = 0; i < exp; i++)
            mulRes = mulRes.mul(fp12)
        
        let powRes = powHelper(fp12, exp)
        let mustTrue = powRes.eq(mulRes)

        expect(
            mustTrue
        ).to.equal(true)
    })

})
