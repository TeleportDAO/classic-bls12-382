# BLS12-381

[![npm version](https://img.shields.io/badge/npm%20package-0.1.0-brightgreen)](https://www.npmjs.com/package/@teleportdao/bls12-381)

BLS12-381 is a simple and easy-to-use [NPM](https://www.npmjs.com/) package that implements bls12-381 signing schema base on [this thesis](https://crypto.stanford.edu/pbc/thesis.pdf) and provides derive public key, signing, verification and batch verification. The codes of the package is easy to understand for those who want to know details of implementation of pairing crypto-system and bls12-381.

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [License](#license)

## Features

- Derive public key: having secret key of type bigint, you can derive public key in point format or compressed format
- Sign: having a secret key of type bigint, you can sign any hashed message
- Verify: having public key, signature and the hashed message, you can verify if the combination matchs or not
- Aggregate public key: by having a list of public keys, you can aggregate them into one public key
- Aggregate signature: by having a list of signatures, you can aggregate them into one signature
- verify batch: having a list of public keys, a list of signatures and the hashed message, you can verify if the combination matchs or not
## Installation

To install the package, run the following command:

```bash
yarn add @teleportdao/bls12-381

// or

npm install @teleportdao/bls12-381
```

## Usage

Here's a basic example of how to use the package:

```javascript

import {derivePublicKey, g1PointCompress, uncompressG2Point, g2PointCompress, sign, verify, blsSigner} from "@teleportdao/bls12-381"

```

## API

### `function derivePublicKey(privateKey: bigint): point`

Derive the public key from a private key by multiplying the base point (g1) with the private key.

**Arguments**

- `privateKey` (bigint): The private key used for deriving the public key


**Returns**

- (point): The derived public key in point format
### ...

### `function sign(privateKey: bigint, hashedMessage: point): point`

Sign a hashed message using the private key.

**Arguments**

- `privateKey` (bigint): The private key used for signing
- `hashedMessage` (point): The hashed message to be signed


**Returns**

- (point): The signature in point format
### ...

### `function verify(publicKey: point, signature: point, hashedMessage: point): Boolean`

Verify a signature using the public key, hashed message, and signature.

**Arguments**

- `publicKey` (point): The public key used for verification
- `signature` (point): The signature to be verified
- `hashedMessage` (point): The hashed message to be signed


**Returns**

- (Boolean): True if the signature is valid, otherwise false
### ...

### `function aggregatePublicKeys(pubKeys: point[]): point`

Aggregate public keys.

**Arguments**

- `pubKeys` (point[]): An array of public keys to be aggregated


**Returns**

- (point): The aggregated public key
### ...

### `function aggregateSignatures(signatures: point[]): point`

Aggregate signatures.

**Arguments**

- `signatures` (point[]): An array of signatures to be aggregated


**Returns**

- (point): The aggregated signature
### ...

### `function verifyBatch(publicKeys: point[], signatures: point[], hashedMessage: point): Boolean`

Aggregate signatures.

**Arguments**

- `publicKeys` (point[]): An array of public keys for verification
- `signatures` (point[]): An array of signatures for verification
- `hashedMessage` (point): The hashed message used for batch verification


**Returns**

- (Boolean): True if the aggregated signatures are valid, otherwise false
### ...

For ease of use, above functions aggregated in blsSigner class with some additional consideration like working with compressed version of public key and signatures, instead of point format. 

### blsSigner methods: 
### `signHashedMsg(cHashedMsg: string): string`

Sign a compressed hashed message and return the compressed signature.

**Arguments**

- `cHashedMsg` (string): The hashed message to be signed


**Returns**

- (string): Compressed signature of the hashed message
### ...

### `verify(cPubKey: string, cSig: string, cHashedMsg: string): Boolean`

Verify if the compressed public key, compressed signature, and compressed hashed message are a valid combination.

**Arguments**

- `cPubKey` (string): Compressed public key
- `cSig` (string): Compressed signature
- `cHashedMsg` (string): Compressed hashed message


**Returns**

- (Boolean): True if the compressed signature is valid, otherwise false
### ...

### `aggregatePublicKeys(cPubKeys: string[]): string`

Aggregate an array of compressed public keys.

**Arguments**

- `cPubKeys` (string[]): An array of compressed public keys


**Returns**

- (string): The compressed aggregate of the public keys
### ...

### `aggregateSignatures(cSigs: string[]): string`

Aggregate an array of compressed signatures.

**Arguments**

- `cSigs` (string[]): An array of compressed signatures


**Returns**

- (string): The compressed aggregate of the signatures
### ...

### `verifyBatch(cPubKeys: string[], cSigs: string[], cHashedMsg: string): Boolean`

Verify an array of compressed public keys and compressed signatures against a compressed hashed message.

**Arguments**

- `cPubKeys` (string[]): An array of compressed public keys
- `cSigs` (string[]): An array of compressed signatures
- `cHashedMsg` (string): Compressed hashed message


**Returns**

- (Boolean): True if the arrays of compressed signatures is valid, otherwise false
### ...

## Examples

Below are a few examples demonstrating how to use the package in various scenarios:

### Example 1: deriving public key
```javascript
// functional usage

import {derivePublicKey, g1PointCompress, uncompressG2Point, g2PointCompress, sign, verify} from "@teleportdao/bls12-381"

    function signAndVerify() {
        let privateKey = BigInt("0x12345678901234567890")
        let pubKey = derivePublicKey(privateKey)

        let compressedPubKey = g1PointCompress(pubKey)

        console.log("the compressed public key in hex format: ", compressedPubKey)

```

### Example 2: signing a hashed message

```javascript
        let hashedMessage = "8273ecc619a16d8d34d71afdf701254a3a30f282ad505af908ecccf2c6e6b32d95fedfda1d331df12edd3a5d9485ade006d40654fa9de7336e478b207afe75575e663cc8c18df7ac6c659cc01249a726e4a67fe19dffcf06f6af5cf4e2523a1a"

        let unCompressedHashedMsg =  uncompressG2Point(hashedMessage)

        let signature = sign(privateKey, unCompressedHashedMsg)

        let compressedSignature = g2PointCompress(signature)

        console.log("the compressed signature in hex format: ", compressedSignature)
```

### Example 2: verify the signature

```javascript
        let isVerified = verify(pubKey, signature, unCompressedHashedMsg)

        console.log("the verification result: ", isVerified)

    }

    // it's possible to do implement the above functionality using blsSigner class and its methods
```

### ...

## License

BLS12-381 is [MIT licensed](LICENSE).