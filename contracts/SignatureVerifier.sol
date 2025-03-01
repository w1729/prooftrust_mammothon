// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SignatureVerifier {
    // Fixed allocator address
    address public constant ALLOCATOR_ADDRESS = 0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d;

    // Verify allocator signature
    function verifyAllocatorSignature(
        bytes32 taskId,
        bytes32 schemaId,
        address validatorAddress,
        bytes memory allocatorSignature
    ) public pure returns (bool) {
        // Encode the parameters
        bytes32 messageHash = keccak256(abi.encodePacked(taskId, schemaId, validatorAddress));

        // Recover the signer address from the signature
        address recoveredAddress = recoverSigner(messageHash, allocatorSignature);

        // Check if the recovered address matches the fixed allocator address
        return recoveredAddress == ALLOCATOR_ADDRESS;
    }

    // Verify validator signature
    function verifyValidatorSignature(
        bytes32 taskId,
        bytes32 schemaId,
        bytes32 uHash,
        bytes32 publicFieldsHash,
        address recipient,
        address validatorAddress,
        bytes memory validatorSignature
    ) public pure returns (bool) {
        // Encode the parameters
        bytes32 messageHash;
        if (recipient == address(0)) {
            messageHash = keccak256(abi.encodePacked(taskId, schemaId, uHash, publicFieldsHash));
        } else {
            messageHash = keccak256(abi.encodePacked(taskId, schemaId, uHash, publicFieldsHash, recipient));
        }

        // Recover the signer address from the signature
        address recoveredAddress = recoverSigner(messageHash, validatorSignature);

        // Check if the recovered address matches the validator address
        return recoveredAddress == validatorAddress;
    }

    // Helper function to recover the signer address from a signature
    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    // Helper function to split the signature into r, s, and v components
    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        if (v < 27) {
            v += 27;
        }
    }
}