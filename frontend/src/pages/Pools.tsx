// @ts-nocheck
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect, SetStateAction } from "react";
import { ethers } from "ethers";

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
import { launchVerification } from "../utils/transgateConnector";
import { Social } from "../Components/social";
import pool from "../abis/pool.json";
import { Poolcom } from "../Components/poolcom";

const contractAddress = "0x32907936a8FA367E2BB402def678634E0FE3D859";

function Pools() {
  const { address } = useAccount();
  const [result, setResult] = useState<string | null>(null);
  const [poolbalance, setpoolbalance] = useState<number>(0);
  const [twitterverify, settwitterverify] = useState<bool>(false);
  const [courseraverify, setcourseraverify] = useState<bool>(false);

  async function get_pool_balance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const contract = new ethers.Contract(contractAddress, pool.abi, provider);
    const poolbalance = await contract.getPoolBalance();
    const twitterverify = await contract.twitterVerified(address);
    const courseraverify = await contract.courseVerified(address);
    setpoolbalance(poolbalance.toNumber());
    settwitterverify(twitterverify);
    setcourseraverify(courseraverify);

    console.log("pool balance", poolbalance, twitterverify, courseraverify);
    setTimeout(get_pool_balance, 5000);
  }

  useEffect(() => {
    if (address) {
      get_pool_balance();
    }
    return () => clearTimeout(get_pool_balance);
  }, []);

  const getVerificationReq = async () => {
    const schemaId: string = "7546de19e7f14958a54f48c41b33c8af"; // Example Schema ID
    const response = await launchVerification(schemaId);

    if (response.success) {
      setResult(JSON.stringify(response.data, null, 2));
    } else {
      setResult(`Verification failed: ${response.error}`);
    }
  };

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
          minHeight="10vh"
        >
          <VStack p="8" maxWidth="800px" spacing="6">
            {/* Heading */}
            <Heading size="2xl" mb="5" textAlign="center">
              Verify your proof and claim USDC 🚀
            </Heading>
            {address && (
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Pool balance: {poolbalance}
              </Text>
            )}

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
            {address && (
              <>
                {/* <Social socialdata={socials} /> */}
                <Poolcom socialData={[twitterverify, courseraverify]} />
                <button onClick={getVerificationReq}>
                  Test Verification Request
                </button>
              </>
            )}
          </VStack>
        </Flex>
      </Flex>
    </div>
  );
}

export default Pools;
