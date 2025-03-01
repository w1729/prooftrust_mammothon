// @ts-nocheck
import { Flex, Box, Text, HStack, Button } from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { MdFingerprint, MdVerified } from "react-icons/md";
import { launchVerification } from "../utils/transgateConnector";
import { useState } from "react";
import { ethers } from "ethers";
import nft from "../abis/nft.json";
import { useAccount } from "wagmi";

// Social media icons mapping
const socialIcons = {
  github: <FaGithub size={40} />,
  x: <FaTwitter size={40} />,
  coursera: <SiCoursera size={40} />,
  aadhaar: <MdFingerprint size={40} />,
};
const zkpassid = {
  github: "463f94650f7a4f248ae9eea8b149201a",
  x: "03e409ed9d5a4564bada85f154569370",
  coursera: "7546de19e7f14958a54f48c41b33c8af",
  aadhaar: "feb00b14ee4c40ce9c1358f286c98c14",
};

async function verify_social(platform: string, response) {
  const contractAddress = "0x49520Bc3544Cf1fACa4eDf80f45Ae0a2DEd0b4bb";
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, nft.abi, signer);
    const tx = await contract.verifySocial(platform, response);
    await tx.wait();
  } catch (error) {
    console.log("error", error);
  }
}

// Function to handle button clicks when social is NOT verified
const handleRequestVerification = async (platform: string) => {
  console.log(`Request verification for: ${platform}`);
  // Add API call or logic here
  const schemaId: string = zkpassid[platform];
  const response = await launchVerification(schemaId);

  if (response.success) {
    console.log(JSON.stringify(response.data, null, 2));
    verify_social(platform, response.data);
  } else {
    console.log(`Verification failed: ${response.error}`);
  }
};

export const Social = ({ socialdata }: { socialdata: string[] }) => {
  console.log("Component received:", socialdata);

  return (
    <Flex direction="column" gap={4} align="center">
      {Object.keys(socialIcons).map((platform) => {
        const isVerified = socialdata.includes(platform); // Check if in array

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
                {platform}
              </Text>

              {/* Show Verified Badge if the platform is in socialdata */}
              {isVerified && (
                <>
                  <MdVerified color="blue" size={24} />
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Verified
                  </span>
                </>
              )}
            </HStack>

            {/* If NOT verified, show button */}
            {!isVerified && (
              <Button
                colorScheme="blue"
                onClick={() => handleRequestVerification(platform)}
              >
                Verify {platform}
              </Button>
            )}
          </Box>
        );
      })}
    </Flex>
  );
};
