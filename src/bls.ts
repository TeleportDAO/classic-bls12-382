import { pointMul, point, pointAdd } from "./points"
import { fp1FromBigInt } from "./fields";
import { pairing, finalExponentiate } from "../src/pairing"

// generator point for G1 
export const G = new point (
    fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
    fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
    false 
)

// Derive the public key from a private key by multiplying the base point (g1) with the private key.
/**
 * Derives the public key from the given private key.
 *
 * @param {bigint} privateKey - The private key used for deriving the public key.
 * @returns {point} The derived public key.
 */
export function derivePublickey(privateKey: bigint): point {
    // publicKey = secretKey * g1
    return pointMul(privateKey, G)
}

// Sign a hashed message using the private key.
/**
 * Signs a hashed message using the given private key.
 *
 * @param {bigint} privateKey - The private key used for signing.
 * @param {point} hashedMessage - The hashed message to be signed.
 * @returns {point} The signature for the hashed message.
 */
export function sign(privateKey: bigint, hashedMessage: point): point {
    //  signature = secretKey * Hash(msg)
    return pointMul(privateKey, hashedMessage)
}

// Verify a signature using the public key, hashed message, and signature.
/**
 * Verifies a signature using the public key, hashed message, and signature.
 *
 * @param {point} publicKey - The public key used for verification.
 * @param {point} signature - The signature to be verified.
 * @param {point} hashedMessage - The hashed message used for verification.
 * @returns {Boolean} True if the signature is valid, otherwise false.
 */
export function verify(publicKey: point, signature: point, hashedMessage: point): Boolean {
    // e(pubKey, hash(msg)) == e(g1, signature) {e = pairing function}
    // 1 == e(g1, signature) / e(pubKey, hash(msg))
    // 1 == e(g1, signature) * e(-pubKey, hash(msg))
    let pairingRes1 = pairing(publicKey.pointNegate(), hashedMessage)
    let pairingRes2 = pairing(G, signature)
    return finalExponentiate(pairingRes1.mul(pairingRes2)).equalOne()
}

// Aggregate public keys.
/**
 * Aggregates an array of public keys.
 *
 * @param {point[]} pubKeys - An array of public keys to be aggregated.
 * @returns {point} The aggregated public key.
 * @throws {Error} Throws an error if the public keys have inconsistent types.
 */
export function aggregatePublicKeys(pubKeys: point[]): point {
    let theType = typeof pubKeys[0].x
    let pointSum = pubKeys[0].pointAtInfinity()

    // aggregatedPublicKey = publicKey1 + publicKey2 + ...
    for( let i = 0; i < pubKeys.length; i++) {
        if( typeof pubKeys[i].x != theType) {
            throw Error("error: inconsistent types")
        }
        theType = typeof pubKeys[i].x
        pointSum = pointAdd(pointSum, pubKeys[i])
    }
    return pointSum
}

// Aggregate signatures.
/**
 * Aggregates an array of signatures.
 *
 * @param {point[]} signatures - An array of signatures to be aggregated.
 * @returns {point} The aggregated signature.
 * @throws {Error} Throws an error if the signatures have inconsistent types.
 */
export function aggregateSignatures(signatures: point[]): point {
    let theType = typeof signatures[0].x
    let pointSum = signatures[0].pointAtInfinity()

    // aggregatedSignature = signature1 + signature2 + ...
    for( let i = 0; i < signatures.length; i++) {
        if( typeof signatures[i].x != theType) {
            throw Error("error: inconsistent types")
        }
        theType = typeof signatures[i].x
        pointSum = pointAdd(pointSum, signatures[i])
    }

    return pointSum
}

// Verify aggregated signatures with aggregated public keys for a given hashed message.
/**
 * Verifies aggregated signatures using aggregated public keys and a given hashed message.
 * This function assumes that the signatures are over the same message.
 *
 * @param {point[]} publicKeys - An array of public keys to be aggregated.
 * @param {point[]} signatures - An array of signatures to be aggregated.
 * @param {point} hashedMessage - The hashed message used for batch verification.
 * @returns {Boolean} True if the aggregated signatures are valid, otherwise false.
 */
export function verifyBatch(publicKeys: point[], signatures: point[], hashedMessage: point): Boolean {
    // e(aggregatedPublicKey, hash(msg)) == e(g1, aggregatedSignature) {e = pairing function}
    // it supposed that the signatures are over the same message    
    let pairingRes1 = pairing(
        aggregatePublicKeys(publicKeys).pointNegate(), 
        hashedMessage
    )
    let pairingRes2 = pairing(
        G, 
        aggregateSignatures(signatures)
    )
    
    return finalExponentiate(pairingRes1.mul(pairingRes2)).equalOne()
}