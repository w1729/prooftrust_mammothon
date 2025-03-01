// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SignatureVerifier.sol"; // Import the SignatureVerifier contract

contract USDCCommunityPool {
    IERC20 public usdcToken;
    address public reputationContract;
    SignatureVerifier public signatureVerifier;

    mapping(address => bool) public hasClaimed;
    mapping(address => bool) public twitterVerified;
    mapping(address => bool) public courseVerified;

    event USDCClaimed(address indexed user, uint256 amount);
    event TokensDeposited(address indexed user, uint256 amount);
    event TwitterVerified(address indexed user);
    event CourseVerified(address indexed user);

    constructor(address _usdcToken, address _reputationContract, address _signatureVerifier) {
        usdcToken = IERC20(_usdcToken);
        reputationContract = _reputationContract;
        signatureVerifier = SignatureVerifier(_signatureVerifier); // Initialize the SignatureVerifier
    }

    function getPoolBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    function verifyTwitter(
        bytes32 taskId,
        bytes32 schemaId,
        address validatorAddress,
        bytes memory allocatorSignature,
        bytes32 uHash,
        bytes32 publicFieldsHash,
        address recipient,
        bytes memory validatorSignature
    ) external {
        require(!twitterVerified[msg.sender], "Twitter already verified");

        // Verify allocator signature
        require(
            signatureVerifier.verifyAllocatorSignature(taskId, schemaId, validatorAddress, allocatorSignature),
            "Invalid allocator signature"
        );

        // Verify validator signature
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

        // Mark Twitter as verified
        twitterVerified[msg.sender] = true;
        emit TwitterVerified(msg.sender);
    }

    function verifyCourse(
        bytes32 taskId,
        bytes32 schemaId,
        address validatorAddress,
        bytes memory allocatorSignature,
        bytes32 uHash,
        bytes32 publicFieldsHash,
        address recipient,
        bytes memory validatorSignature
    ) external {
        require(!courseVerified[msg.sender], "Course already verified");

        // Verify allocator signature
        require(
            signatureVerifier.verifyAllocatorSignature(taskId, schemaId, validatorAddress, allocatorSignature),
            "Invalid allocator signature"
        );

        // Verify validator signature
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

        // Mark course as verified
        courseVerified[msg.sender] = true;
        emit CourseVerified(msg.sender);
    }

    function isEligible(address user) public view returns (bool) {
        if (hasClaimed[user]) {
            return false;
        }

        uint256 reputationScore = IReputation(reputationContract).getReputation(user);
        if (reputationScore == 0) {
            return false;
        }

        return twitterVerified[user] && courseVerified[user];
    }

    function claimUSDC() external {
        require(isEligible(msg.sender), "Not eligible to claim USDC");
        hasClaimed[msg.sender] = true;

        uint256 amount = 1 * 10 ** 6;
        require(usdcToken.transfer(msg.sender, amount), "USDC transfer failed");

        emit USDCClaimed(msg.sender, amount);
    }

    function depositTokens(uint256 amount) external {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Token deposit failed");
        emit TokensDeposited(msg.sender, amount);
    }
}

interface IReputation {
    function getReputation(address user) external view returns (uint256);
}