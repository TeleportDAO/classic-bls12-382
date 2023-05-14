import { mod, groupOrder } from "./src/fields" 
import { point } from "./src/points"
import { pairing, finalExponentiate } from "./src/pairing"
import { g1PointCompress, uncompressG1Point, g2PointCompress, uncompressG2Point } from "./src/compress"
import {derivePublicKey, sign, verify, G} from "./src/bls"
import {aggregatePublicKeys, aggregateSignatures, verifyBatch} from "./src/bls"


/**
 * BLS Signer class, implementing the core functionality of BLS signatures.
 * This includes generating public keys, signing messages, verifying signatures,
 * aggregating public keys and signatures, and batch verification.
 */
class blsSigner {
    // Secret key in the range of [0, groupOrder)
    private sk: bigint;
    // Public key as a point in G1
    public pk: point;
    // Compressed public key in hex format
    public cpk: string;

    /**
     * Constructor for the BLS Signer class.
     *
     * @param {bigint} sk - The secret key used for signing.
     */
    constructor(
        sk: bigint
    ){
        this.sk = mod(sk, groupOrder);
        this.pk = derivePublicKey(sk);
        this.cpk = g1PointCompress(this.pk);
    }

    /**
     * Display the public key in both point and compressed format.
     */
    displayInfo() {
        console.log("pk: ", this.pk)
        console.log("cPk: ", this.cpk)
    }

    /**
     * Sign a compressed hashed message and return the compressed signature.
     *
     * @param {point} hashedMsg - The hashed message to be signed.
     * @returns {string} Compressed signature of the hashed message.
     */
    signHashedMsg(cHashedMsg: string): string {
        let signature = sign(this.sk, uncompressG2Point(cHashedMsg))
        return g2PointCompress(signature)
    }

    /**
     * Verify if the compressed public key, compressed signature, and compressed hashed message
     * are a valid combination.
     *
     * @param {string} cPubKey - Compressed public key.
     * @param {string} cSig - Compressed signature.
     * @param {string} cHashedMsg - Compressed hashed message.
     * @returns {Boolean} True if the compressed signature is valid, otherwise false.
     */
    verify(cPubKey: string, cSig: string, cHashedMsg: string): Boolean {
        let pubKey = uncompressG1Point(cPubKey)
        let sig = uncompressG2Point(cSig)
        let hashedMsg = uncompressG2Point(cHashedMsg)

        return verify(pubKey, sig, hashedMsg)
    }

    /**
     * Aggregate an array of compressed public keys.
     *
     * @param {string[]} cPubKeys - An array of compressed public keys.
     * @returns {string} The compressed aggregate of the public keys.
     */
    aggregatePublicKeys(cPubKeys: string[]): string {
        let pubKeys: point[] = []

        for( let i = 0; i < cPubKeys.length; i++) {
            let pk = uncompressG1Point(cPubKeys[i])

            pubKeys.push(pk)
        }

        let aggrPubKeys = aggregatePublicKeys(pubKeys)
        return g1PointCompress(aggrPubKeys)
    }

    /**
     * Aggregate an array of compressed signatures.
     *
     * @param {string[]} cSigs - An array of compressed signatures.
     * @returns {string} The compressed aggregate of the signatures.
     */
    aggregateSignatures(cSigs: string[]): string {
        let sigs: point[] = []

        for( let i = 0; i < cSigs.length; i++) {
            let sig = uncompressG2Point(cSigs[i])

            sigs.push(sig)
        }

        let aggrSigs = aggregateSignatures(sigs)
        return g2PointCompress(aggrSigs)
    }

    /**
     * Verify an array of compressed public keys and
     * compressed signatures against a compressed hashed message.
     * It assumes that all signatures are for the same message.
     *
     * @param {string[]} cPubKeys - An array of compressed public keys.
     * @param {string[]} cSigs - An array of compressed signatures.
     * @param {string} cHashedMsg - Compressed hashed message.
     * @returns {Boolean} True if the arrays of compressed signatures is valid, otherwise false.
     */
    verifyBatch(cPubKeys: string[], cSigs: string[], cHashedMsg: string): Boolean {

        let pubKeys: point[] = []
        for( let i = 0; i < cPubKeys.length; i++) {
            let pk = uncompressG1Point(cPubKeys[i])

            pubKeys.push(pk)
        }

        let sigs: point[] = []
        for( let i = 0; i < cSigs.length; i++) {
            let sig = uncompressG2Point(cSigs[i])

            sigs.push(sig)
        }
        
        return verifyBatch(pubKeys, sigs, uncompressG2Point(cHashedMsg));
    }
}

// the underlying functions of blsSigner methods are exported as well, 
// so it's possible use them independently 
export {blsSigner}
export {derivePublicKey, sign, verify, G}
export {aggregatePublicKeys, aggregateSignatures, verifyBatch}
export { point }
export { pairing, finalExponentiate }
export { g1PointCompress, uncompressG1Point, g2PointCompress, uncompressG2Point }