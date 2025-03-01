// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SignatureVerifier.sol"; // Import the SignatureVerifier contract

contract SoulboundNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) public hasMinted;
    mapping(address => string[]) private userVerifiedSocials;
    mapping(address => mapping(string => bool)) private isSocialVerified;
    mapping(address => uint256) public reputationScore;

    // Instance of the SignatureVerifier contract
    SignatureVerifier public signatureVerifier;

    event SocialVerified(address indexed user, string platform, uint256 newScore);

    constructor(address _signatureVerifierAddress) ERC721("SoulboundNFT", "SBT") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start token IDs from 1
        signatureVerifier = SignatureVerifier(_signatureVerifierAddress); // Initialize the SignatureVerifier
    }

    function mint() external {
        require(!hasMinted[msg.sender], "SBT already minted");

        uint256 tokenId = _tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        _tokenIdCounter++; // Increment after successful minting
    }

    function verifySocial(
        string memory platform,
        bytes32 taskId,
        bytes32 schemaId,
        address validatorAddress,
        bytes memory allocatorSignature,
        bytes32 uHash,
        bytes32 publicFieldsHash,
        address recipient,
        bytes memory validatorSignature
    ) external {
        require(hasMinted[msg.sender], "Mint an SBT first");
        require(!isSocialVerified[msg.sender][platform], "Already verified");

        // Verify allocator signature using the SignatureVerifier contract
        require(
            signatureVerifier.verifyAllocatorSignature(taskId, schemaId, validatorAddress, allocatorSignature),
            "Invalid allocator signature"
        );

        // Verify validator signature using the SignatureVerifier contract
        require(
            signatureVerifier.verifyValidatorSignature(
                taskId,
                schemaId,
                uHash,
                publicFieldsHash,
                recipient,
                validatorAddress,
                validatorSignature
            ),
            "Invalid validator signature"
        );

        // If both signatures are valid, mark the social as verified
        userVerifiedSocials[msg.sender].push(platform);
        isSocialVerified[msg.sender][platform] = true;
        reputationScore[msg.sender] += getPlatformScore(platform);

        emit SocialVerified(msg.sender, platform, reputationScore[msg.sender]);
    }

    function getPlatformScore(string memory platform) public pure returns (uint256) {
        if (keccak256(abi.encodePacked(platform)) == keccak256(abi.encodePacked("x"))) {
            return 5;
        } else if (keccak256(abi.encodePacked(platform)) == keccak256(abi.encodePacked("github"))) {
            return 15;
        } else if (keccak256(abi.encodePacked(platform)) == keccak256(abi.encodePacked("aadhaar"))) {
            return 20;
        } else if (keccak256(abi.encodePacked(platform)) == keccak256(abi.encodePacked("reddit"))) {
            return 12;
        }
        return 5;
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        // Allow minting (when `from` is address(0))
        if (auth != address(0)) {
            revert("Soulbound: token is non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function getReputation(address user) external view returns (uint256) {
        return reputationScore[user];
    }

    function getVerifiedSocials(address user) external view returns (string[] memory) {
        return userVerifiedSocials[user];
    }
}