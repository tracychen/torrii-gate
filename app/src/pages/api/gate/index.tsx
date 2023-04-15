import { Gate } from "@/types/gate";
import { getGaaSContract } from "@/utils/provider";
import { NextApiRequest, NextApiResponse } from "next";

// TODO: allow switching between mumbai/scrollalpha
const gaasContract = getGaaSContract("mumbai");

type RequestBody = {
  gate: Gate;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Create gate on-chain
    const { gate } = req.body as RequestBody;
    if (!gate) {
      return res
        .status(400)
        .json({ error: "'gate' is required in request body" });
    }
    const gateString = JSON.stringify(gate);
    const configHash = Buffer.from(gateString).toString("base64");

    const tx = await gaasContract.createGate(configHash);
    const receipt = await tx.wait(3);
    console.debug("Tx receipt", receipt);
    return res.status(201);
  } else {
    return res.status(405).json({ error: "Only POST requests are supported" })
  }
}
