import { pointMul, point } from "./points"
import { fp1FromBigInt } from "./fields";
import { pairing } from "../src/pairing"

let G = new point (
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
    return pairingRes1.mul(pairingRes2).equalOne()
}
