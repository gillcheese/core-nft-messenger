import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, create, transferV1 } from '@metaplex-foundation/mpl-core';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { generateSigner, publicKey, createGenericFile, transactionBuilder, sol } from '@metaplex-foundation/umi';
import { transferSol } from '@metaplex-foundation/mpl-toolbox';

let rpcUrl = null;

async function getRpcUrl() {
  if (rpcUrl) return rpcUrl;
  
  try {
    const response = await fetch('/api/getRpcUrl');
    const data = await response.json();
    rpcUrl = data.rpcUrl;
  } catch (error) {
    console.error('Failed to fetch RPC URL, using fallback:', error);
    rpcUrl = clusterApiUrl('mainnet-beta');
  }
  
  return rpcUrl;
}

export const initializeUmi = async (wallet) => {
  if (!wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  
  const publicKeyString = wallet.publicKey.toString();
  console.log("Initializing Umi with wallet public key:", publicKeyString);

  const rpcUrl = await getRpcUrl();
  
  const umi = createUmi(rpcUrl)
    .use(mplCore())
    .use(walletAdapterIdentity(wallet))
    .use(irysUploader({ address: 'https://node1.irys.xyz' }));

  console.log("Umi instance created with wallet identity and Irys uploader for mainnet");
  return umi;
};

export const uploadAndMintNFT = async (umi, imageBuffer, name, description, recipientAddress, updateStep) => {
  if (!umi) {
    throw new Error("Umi not initialized. Please connect wallet first.");
  }
  
  console.log("uploadAndMintNFT called with:");
  console.log("umi:", umi);
  console.log("imageBuffer:", imageBuffer ? `[Buffer of length ${imageBuffer.length}]` : 'undefined');
  console.log("name:", name);
  console.log("description:", description);
  console.log("recipientAddress:", recipientAddress);
  
  if (!imageBuffer || !imageBuffer.length) {
    throw new Error("Invalid or empty imageBuffer");
  }

  try {
    console.log("Starting NFT upload and minting process");
    
    // Upload image
    let file;
    try {
      file = createGenericFile(imageBuffer, 'image.png', { contentType: 'image/png' });
      console.log("Generic file created successfully");
    } catch (error) {
      console.error("Error creating generic file:", error);
      throw error;
    }

    const [imageUri] = await umi.uploader.upload([file]);
    console.log("Image uploaded, URI:", imageUri);
    updateStep(0);

    // Upload metadata
    const uri = await umi.uploader.uploadJson({
      name: name,
      description: description,
      image: imageUri,
      attributes: [
        { trait_type: "App", value: "Boop Text Messenger" },
        { trait_type: "Type", value: "Text Message NFT" }
      ],
      properties: {
        files: [{ uri: imageUri, type: "image/png" }],
        category: "image",
        creators: [{ address: umi.identity.publicKey, share: 100 }]
      }
    });
    console.log("Metadata uploaded, URI:", uri);
    updateStep(1);

    // Check fee recipient address
    const feeRecipientAddress = process.env.NEXT_PUBLIC_FEE_RECIPIENT_ADDRESS;
    if (!feeRecipientAddress) {
      console.error("Fee recipient address is not set");
      throw new Error("Fee recipient address is not configured");
    }
    console.log("Fee recipient address:", feeRecipientAddress);

    try {
      // Generate a new signer for the asset
      const assetSigner = generateSigner(umi);
      console.log("Asset signer generated:", assetSigner.publicKey);

      // Create a transaction builder
      let tx = transactionBuilder();
      console.log("Transaction builder created");

      // Add create instruction
      tx = tx.add(
        create(umi, {
          asset: assetSigner,
          name: name,
          uri: uri,
          sellerFeeBasisPoints: 0, // 0% royalties
        })
      );
      console.log("Create instruction added to transaction");

      // Add transfer NFT instruction
      tx = tx.add(
        transferV1(umi, {
          asset: assetSigner.publicKey,
          newOwner: publicKey(recipientAddress),
        })
      );
      console.log("Transfer NFT instruction added to transaction");

      // Add fee transfer instruction
      const feeAmount = 0.001; // 0.001 SOL
      tx = tx.add(
        transferSol(umi, {
          source: umi.identity,
          destination: publicKey(feeRecipientAddress),
          amount: sol(feeAmount),
        })
      );
      console.log("Fee transfer instruction added to transaction");

      console.log("Transaction built successfully");

      // Send and confirm the bundled transaction
      console.log("Sending transaction...");
      const result = await tx.sendAndConfirm(umi);
      console.log("Transaction completed, result:", result);
      updateStep(2); // Complete step 2
      updateStep(3); // Complete step 3 (both are done in one transaction now)

      return { result, uri };
    } catch (error) {
      console.error("Error building or sending transaction:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in uploadAndMintNFT:", error);
    throw error;
  }
};