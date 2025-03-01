// @ts-nocheck
import {
  IconButton,
  Flex,
  HStack,
  Link,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaGithub, FaFaucet } from "react-icons/fa";
import { useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link as RouterLink } from "react-router-dom";
import { useAccount } from "wagmi";

export const Topbuttons = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { address } = useAccount();

  // Dynamic colors based on the theme
  const buttonBg = useColorModeValue("gray.100", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Flex align="center" justify="end" p={4}>
      <HStack spacing={4}>
        {address && (
          <>
            <Link
              as={RouterLink}
              to="/pool"
              px={4}
              py={2}
              borderRadius="md"
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg, textDecoration: "none" }}
              color={iconColor}
              transition="background 0.2s ease"
            >
              Crypto Pool
            </Link>

            <Link
              as={RouterLink}
              to="/profile"
              px={4}
              py={2}
              borderRadius="md"
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg, textDecoration: "none" }}
              color={iconColor}
              transition="background 0.2s ease"
            >
              Profile
            </Link>
          </>
        )}

        <Box>
          <ConnectButton />
        </Box>

        <IconButton
          onClick={toggleColorMode}
          aria-label={`Switch from ${colorMode} mode`}
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          bg={buttonBg}
          _hover={{ bg: buttonHoverBg }}
          color={iconColor}
          transition="background 0.2s ease"
        />
      </HStack>
    </Flex>
  );
};
