import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, create, transferV1 } from '@metaplex-foundation/mpl-core';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { generateSigner, publicKey, createGenericFile } from '@metaplex-foundation/umi';

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
  try {
    console.log("Starting NFT upload and minting process");
    // Create a GenericFile from the image buffer
    const file = createGenericFile(imageBuffer, 'image.png', { contentType: 'image/png' });
    // Upload the image
    const [imageUri] = await umi.uploader.upload([file]);
    console.log("Image uploaded, URI:", imageUri);
    updateStep(0);  // Complete step 0
    // Upload the metadata
    const uri = await umi.uploader.uploadJson({
      name: name,
      description: description,
      image: imageUri,
      attributes: [
        {
          trait_type: "App",
          value: "Boop Text Messenger"
        },
        {
          trait_type: "Type",
          value: "Text Message NFT"
        }
      ],
      properties: {
        files: [
          {
            uri: imageUri,
            type: "image/png"
          }
        ],
        category: "image",
        creators: [{ address: umi.identity.publicKey, share: 100 }]
      }
    });
    console.log("Metadata uploaded, URI:", uri);
    updateStep(1);  // Complete step 1
    // Generate a new signer for the asset
    const assetSigner = generateSigner(umi);
    // Create the asset
    const mintResult = await create(umi, {
      asset: assetSigner,
      name: name,
      uri: uri,
      sellerFeeBasisPoints: 0, // 0% royalties
    }).sendAndConfirm(umi);
    console.log("NFT minted, result:", mintResult);
    updateStep(2);  // Complete step 2
    // Transfer the NFT to the recipient
    const transferResult = await transferV1(umi, {
      asset: assetSigner.publicKey,
      newOwner: publicKey(recipientAddress),
    }).sendAndConfirm(umi);
    console.log("NFT transferred, result:", transferResult);
    updateStep(3);  // Complete step 3
    return { mintResult, transferResult, uri };
  } catch (error) {
    console.error("Error in uploadAndMintNFT:", error);
    throw error;
  }
};