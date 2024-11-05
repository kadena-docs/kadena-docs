---
title: Specialized functions
description: "Reference information for Pact built-in functions that are intended for special usee cases."
id: special-use
---

# Specialized functions

Pact includes several built-in functions that are intended for very specific use cases, such as integrating with other tools and working with zero knowledge proofs.

## Commitments

- [decrypt-cc20p1305](/pact-5/Commitments/decrypt-cc20p1305) Decrypt using the CHACHA20-POLY1305 encryption algorithm.

- [hyperlane-decode-token-message](/pact-5/Commitments/hyperlane-decode-token-message) Decode a base-64-unpadded encoded Hyperlane Token Message into an object.

- [hyperlane-encode-token-message](/pact-5/Commitments/hyperlane-encode-token-message) Encode an object into base-64-unpadded encoded Hyperlane Token Message.

- [hyperlane-message-id](/pact-5/Commitments/hyperlane-message-id) Get the message identifier of a Hyperlane Message object.

- [validate-keypair](/pact-5/Commitments/validate-keypair) Verify that the public key and secret key are valid.

## Simple payment verification

- [verify-spv](/pact-5/SPV/verify-spv) Perform a platform-specific simplified payment verification (SPV) proof.


## Zero knowledge (ZK) built-in functions

- [pairing-check](/pact-5/ZK/pairing-check) Perform pairing and final exponentiation on points for a zero knowledge proof.

- [point-add](/pact-5/ZK/point-add) Add two points together for a zero knowledge proof.

- [scalar-mult](/pact-5/ZK/scalar-mult) Multiply a point by an integer value for a zero-knowledge proof.

