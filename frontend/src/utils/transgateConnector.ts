import TransgateConnect from "@zkpass/transgate-js-sdk";

interface VerificationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Launches the Transgate verification process.
 * @param schemaId - The schema ID for verification
 * @returns A promise resolving to a success or error response
 */
export const launchVerification = async (
  schemaId: string
): Promise<VerificationResponse> => {
  try {
    console.log("Starting verification...");

    const appid: string = "4a55b8cc-8318-4468-9b19-a80661f48478"; // Replace with your actual App ID
    const connector = new TransgateConnect(appid);

    // Launch the verification process
    const response = await connector.launch(schemaId);
    console.log("Verification response:", response);

    return { success: true, data: response };
  } catch (error) {
    console.error("TransGate error:", error);
    return { success: false, error: String(error) };
  }
};
