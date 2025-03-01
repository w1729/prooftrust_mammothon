// @ts-nocheck
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect, SetStateAction } from "react";
import { ethers } from "ethers";
import GmPortal from "../../GmPortal.json";
import { useAccount } from "wagmi";
import moment from "moment";
import {
  Heading,
  Flex,
  VStack,
  Button,
  HStack,
  Text,
  Link,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
} from "@chakra-ui/react";
import { Topbuttons } from "../Components/topbuttons";
import "../App.css";
import { Link as RouterLink } from "react-router-dom";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Home() {
  const { address } = useAccount();

  return (
    <div>
      <Flex direction="column" minHeight="100vh">
        {/* Top Buttons */}
        <Topbuttons />

        {/* Main Content */}
        <Flex
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
          minHeight="90vh"
        >
          <VStack p="8" maxWidth="800px" spacing="6">
            {/* Heading */}
            <Heading size="2xl" mb="5" textAlign="center">
              proof trust portal
            </Heading>

            {/* Description for Unconnected Users */}
            {!address && (
              <VStack spacing="3" textAlign="center">
                <Heading size="md">
                  A Proof-of-Trust Demo for EVM x Rollkit Integration
                </Heading>
                <Text>
                  Proof Trust Portal is a smart contract that enables users to
                  validate their identity and trustworthiness on-chain. This
                  demo showcases how verifiable credentials can be integrated
                  into the EVM, ensuring transparent and reliable interactions.
                </Text>
                <Heading size="sm" pt="3">
                  Connect your Ethereum wallet to begin verification 🔒
                </Heading>
              </VStack>
            )}

            {/* Connect Wallet Button */}
            {/* <ConnectButton /> */}

            {/* Actions for Connected Users */}
            {address && <HStack spacing="4"></HStack>}

            {/* Create Post Section */}
          </VStack>
        </Flex>
      </Flex>
    </div>
  );
}

export default Home;
