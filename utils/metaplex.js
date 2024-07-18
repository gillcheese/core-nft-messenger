import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, create, transferV1 } from '@metaplex-foundation/mpl-core';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { generateSigner, publicKey, createGenericFile } from '@metaplex-foundation/umi';

export const initializeUmi = (wallet) => {
  if (!wallet.publicKey) {
    throw new Error("Wallet is not connected");
  }
  
  const publicKeyString = wallet.publicKey.toString();
  console.log("Initializing Umi with wallet public key:", publicKeyString);

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(walletAdapterIdentity(wallet))
    .use(irysUploader());

  console.log("Umi instance created with wallet identity and Irys uploader");
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