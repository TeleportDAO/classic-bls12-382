# BLS12-381 signing schema

This repo is an implementation of bls12-381 signature schema based on [this paper](https://crypto.stanford.edu/pbc/thesis.pdf) (section 3).

To install the package run:



    yarn add @teleportdao/bls12-381

    // or

    npm install @teleportdao/bls12-381

This package is zero-dependency and bls12-381 signature schema is implemented as simple as possible for developers wanted to understand it better, and this has reduced the efficiency. 


## How to use

    import {derivePublickey, g1PointCompress, uncompressG2Point, g2PointCompress, sign, verify} from "@teleportdao/bls12-381"

    function signAndVerify() {
        let privateKey = BigInt("0x12345678901234567890")
        let pubKey = derivePublickey(privateKey)

        let compressedPubKey = g1PointCompress(pubKey)

        console.log("the compressed public key in hex format: ", compressedPubKey)

        let hashedMessage = "8273ecc619a16d8d34d71afdf701254a3a30f282ad505af908ecccf2c6e6b32d95fedfda1d331df12edd3a5d9485ade006d40654fa9de7336e478b207afe75575e663cc8c18df7ac6c659cc01249a726e4a67fe19dffcf06f6af5cf4e2523a1a"

        let unCompressedHashedMsg =  uncompressG2Point(hashedMessage)

        let signature = sign(privateKey, unCompressedHashedMsg)

        let compressedSignature = g2PointCompress(signature)

        console.log("the compressed signature in hex format: ", compressedSignature)

        let isVerified = verify(pubKey, signature, unCompressedHashedMsg)

        console.log("the verification result: ", isVerified)

    }

    signAndVerify()

### functions

#### `derivePublickey`
    function derivePublickey(privateKey: bigint): point

#### `sign`
    function sign(privateKey: bigint, hashedMessage: point): point

#### `verify`
    function verify(publicKey: point, signature: point, hashedMessage: point): Boolean

#### `aggregatePublicKeys`
    function aggregatePublicKeys(pubKeys: point[]): point

#### `aggregateSignatures`
    function aggregateSignatures(signatures: point[]): point

#### `verifyBatch`
    function verifyBatch(publicKeys: point[], signatures: point[], hashedMessage: point): Boolean