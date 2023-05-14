import { mod, groupOrder } from "./src/fields" 
import { point } from "./src/points"
import { pairing, finalExponentiate } from "./src/pairing"
import { g1PointCompress, uncompressG1Point, g2PointCompress, uncompressG2Point } from "./src/compress"
import {derviePublickey, sign, verify, G} from "./src/bls"
import {aggregatePublicKeys, aggregateSignatures, verifyBatch} from "./src/bls"

class blsSigner {
    // secret key in the range of [0, groupOrder)
    private sk: bigint;
    // public key as a point in G1
    public pk: point;
    // compressed public key in hex format
    public cpk: string;

    constructor(
        sk: bigint
    ){
        this.sk = mod(sk, groupOrder);
        this.pk = derviePublickey(sk);
        this.cpk = g1PointCompress(this.pk);
    }

    // display public key in both format of a point and compressed
    displayInfo() {
        console.log("pk: ", this.pk)
        console.log("cPk: ", this.cpk)
    }

    // sign a hashed message and return the compressed signature
    signHashedMsg(hashedMsg: point): string {
        let signature = sign(this.sk, hashedMsg)
        return g2PointCompress(signature)
    }

    // returns true if the compressed public key and compressed hashed message
    // match with the compressed signature
    verify(cPubKey: string, cSig: string, cHashedMsg: string): Boolean {
        let pubKey = uncompressG1Point(cPubKey)
        let sig = uncompressG2Point(cSig)
        let hashedMsg = uncompressG2Point(cHashedMsg)

        return verify(pubKey, sig, hashedMsg)
    }

    // get an array of compressed public keys and return the aggregate of them 
    aggregatePublicKeys(cPubKeys: string[]): string {
        let pubKeys: point[] = []

        for( let i = 0; i < cPubKeys.length; i++) {
            let pk = uncompressG1Point(cPubKeys[i])

            pubKeys.push(pk)
        }

        let aggrPubKeys = aggregatePublicKeys(pubKeys)
        return g1PointCompress(aggrPubKeys)
    }

    // get an array of compressed signatures and return the aggregate of them 
    aggregateSignatures(cSigs: string[]): string {
        let sigs: point[] = []

        for( let i = 0; i < cSigs.length; i++) {
            let sig = uncompressG2Point(cSigs[i])

            sigs.push(sig)
        }

        let aggrSigs = aggregateSignatures(sigs)
        return g2PointCompress(aggrSigs)
    }

    // returns true if the array of compressed public keys and the compressed hashed message
    // match with the array of compressed signatures
    verifyBatch(cPubKeys: string[], cSigs: string[], cHashedMsg: string): Boolean {
        let aggrPks = this.aggregatePublicKeys(cPubKeys)
        let aggrSigs = this.aggregateSignatures(cSigs)
        
        return this.verify(aggrPks, aggrSigs, cHashedMsg)
    }
}

// the underlying functions of blsSigner methods are exported as well, 
// so it's possible use them independently 
export {blsSigner}
export {derviePublickey, sign, verify, G}
export {aggregatePublicKeys, aggregateSignatures, verifyBatch}
export { point }
export { pairing, finalExponentiate }
export { g1PointCompress, uncompressG1Point, g2PointCompress, uncompressG2Point }