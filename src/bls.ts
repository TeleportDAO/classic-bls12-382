import { pointMul, point, pointAdd } from "./points"
import { fp1FromBigInt } from "./fields";
import { pairing, finalExponentiate } from "../src/pairing"

export const G = new point (
    fp1FromBigInt(3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507n),
    fp1FromBigInt(1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569n),
    false 
)

export function derviePublickey(privateKey: bigint): point {
    return pointMul(privateKey, G)
}

export function sign(privateKey: bigint, hashedMessage: point): point {
    return pointMul(privateKey, hashedMessage)
}

export function verify(publicKey: point, signature: point, hashedMessage: point): Boolean {
    let pairingRes1 = pairing(publicKey.pointNegate(), hashedMessage)
    let pairingRes2 = pairing(G, signature)
    return finalExponentiate(pairingRes1.mul(pairingRes2)).equalOne()
}

export function aggregatePublicKeys(pubKeys: point[]): point {

    let theType = typeof pubKeys[0].x
    let pointSum = pubKeys[0].pointAtInfinity()

    for( let i = 0; i < pubKeys.length; i++) {
        if( typeof pubKeys[i].x != theType) {
            throw "error: inconsistent types"
        }
        theType = typeof pubKeys[i].x
        pointSum = pointAdd(pointSum, pubKeys[i])
    }

    return pointSum
}

export function aggregateSignatures(signatures: point[]): point {

    let theType = typeof signatures[0].x
    let pointSum = signatures[0].pointAtInfinity()

    for( let i = 0; i < signatures.length; i++) {
        if( typeof signatures[i].x != theType) {
            throw "error: inconsistent types"
        }
        theType = typeof signatures[i].x
        pointSum = pointAdd(pointSum, signatures[i])
    }

    return pointSum
}


export function verifyBatch(publicKeys: point[], signatures: point[], hashedMessage: point): Boolean {
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