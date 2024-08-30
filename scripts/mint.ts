import fs from "fs";
import abi from "../abi/abi.json";
import { ethers } from "hardhat";
import PinataSDK, { PinataPinOptions } from "@pinata/sdk";
import { vars } from "hardhat/config";

const PINATA_API_KEY = vars.get("PINATA_API_KEY");
const PINATA_API_SECRET = vars.get("PINATA_API_SECRET");
const INFURA_PROJECT_SECRET = vars.get("INFURA_PROJECT_SECRET");
const INFURA_PROJECT_ID = vars.get("INFURA_PROJECT_ID");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");

async function main() {
  const pinata = new PinataSDK(PINATA_API_KEY, PINATA_API_SECRET);
  const provider = new ethers.InfuraProvider("sepolia", INFURA_PROJECT_ID, INFURA_PROJECT_SECRET);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract("0x00DbFbe73F819A2843C060130bAcd3a0aBc28691", abi, signer);

  const filename = "assets/Evidence669.pdf";

  const readableStreamForFile = fs.createReadStream(filename);
  const options: PinataPinOptions = {
    pinataMetadata: {
      name: filename,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    const hash = result.IpfsHash;
    console.log("IPFS Hash:", hash);

    const tx = await contract.mintTo("0x0E622ab189C996D3AE3C8a5A0023CdE9A9F0c8A1", 0, `https://ipfs.io/ipfs/${hash}`, 1);
    await tx.wait();

    console.log("Transaction Hash:", tx.hash);
  } catch (error) {
    console.error("Erro", error);
  }
}

main().catch(console.error);
