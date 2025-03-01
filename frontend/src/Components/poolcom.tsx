// @ts-nocheck
import { Flex, Box, Text, HStack, Button } from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { MdVerified } from "react-icons/md";
import { launchVerification } from "../utils/transgateConnector";
import { useState } from "react";
import { ethers } from "ethers";
import pool from "../abis/pool.json";
import { useAccount } from "wagmi";

const socialIcons = {
  twitter: <FaTwitter size={40} />, // Renamed from 'x' to 'twitter' for clarity
  coursera: <SiCoursera size={40} />,
};

const content = {
  twitter: "verify twitter count", // Renamed from 'x' to 'twitter' for clarity
  coursera: "verify course cryptography I",
};

const zkpassid = {
  twitter: "463f94650f7a4f248ae9eea8b149201a",
  coursera: "feb00b14ee4c40ce9c1358f286c98c14",
};

async function verify_social(platform: string, address: string, response) {
  const contractAddress = "0x32907936a8FA367E2BB402def678634E0FE3D859";
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, pool.abi, signer);
    if (platform === "twitter") {
      const tx = await contract.setTwitterVerified(address, response);
      await tx.wait();
    } else {
      const tx = await contract.setCourseVerified(address, response);
      await tx.wait();
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function claim_usdc(platform: string, address: string) {
  const contractAddress = "0x32907936a8FA367E2BB402def678634E0FE3D859";
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, pool.abi, signer);
    const tx = await contract.claimUSDC();
    await tx.wait();
  } catch (error) {
    console.log("error", error);
  }
}

const handleRequestVerification = async (platform: string, address: string) => {
  console.log(`Request verification for: ${platform}`);
  const schemaId: string = zkpassid[platform];
  const response = await launchVerification(schemaId);

  if (response.success) {
    console.log(JSON.stringify(response.data, null, 2));
    verify_social(platform, address, response.data);
  } else {
    console.log(`Verification failed: ${response.error}`);
  }
};

export const Poolcom = ({ socialData }: { socialData: boolean[] }) => {
  console.log("Component received:", socialData);
  const [twitterVerified, courseraVerified] = socialData;
  const { address } = useAccount();
  return (
    <Flex direction="column" gap={4} align="center">
      {Object.keys(socialIcons).map((platform, index) => {
        const isVerified = socialData[index];
        return (
          <Box
            key={platform}
            w="400px"
            h="100px"
            border="2px solid black"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={4}
          >
            <HStack spacing={3} align="center">
              {socialIcons[platform]}
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {content[platform]}
              </Text>
              {isVerified && (
                <>
                  <MdVerified color="blue" size={24} />
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Verified
                  </span>
                </>
              )}
            </HStack>
            {!isVerified && (
              <Button
                colorScheme="blue"
                onClick={() => handleRequestVerification(platform, address)}
              >
                Verify {platform}
              </Button>
            )}
          </Box>
        );
      })}

      {twitterVerified && courseraVerified && (
        <Button colorScheme="green" size="lg" onClick={claim_usdc}>
          Claim Usdc
        </Button>
      )}
    </Flex>
  );
};
