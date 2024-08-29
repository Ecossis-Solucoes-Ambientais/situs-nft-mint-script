exports.nftMint = async (req, res) => {
  const PinataSDK = require("@pinata/sdk");
  const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
  const filename = "evidences/evidence_669d56b83c5c2ec00cd5682c.pdf";

  const readableStreamForFile = fs.createReadStream(filename);
  const options = {
    pinataMetadata: {
      name: filename,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log("IPFS Hash:", result.IpfsHash);

    const provider = new ethers.providers.InfuraProvider("https://sepolia.infura.io/v3/5971694705114282831f37049324898d");

    // ABI e Endereço do Contrato
    const contractABI = JSON.parse(fs.readFileSync("0x00DbFbe73F819A2843C060130bAcd3a0aBc28691.json", "utf8"));
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Chave Privada
    const privateKey = process.env.METAMASK_PRIVATE_KEY;

    // Função para mintar um NFT

    const recipientAddress = process.env.RECIPIENT_ADDRESS;
    const hash = result.IpfsHash; // Substituir pelo hash recebido do Situs

    try {
      const tx = await contract.mintNFT(recipientAddress, hash);
      await tx.wait(); // Esperar a transação ser minerada
      console.log("Transaction Hash:", tx.hash); // Log do hash da transação
    } catch (error) {
      console.error("Erro ao mintar o NFT:", error);
    }

    return res.status(200).send({ message: "Carregado no IPFS com sucesso", result });
  } catch (err) {
    console.error("Erro ao carregar no IPFS:", err);
    return res.status(500).send({ error: "Erro ao carregar no IPFS", err });
  }
};
22;
