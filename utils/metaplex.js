import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, create } from '@metaplex-foundation/mpl-core';
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

export const uploadAndMintNFT = async (umi, imageBuffer, name, description) => {
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

    // Upload the metadata
    const uri = await umi.uploader.uploadJson({
      name: name,
      description: description,
      image: imageUri,
    });
    console.log("Metadata uploaded, URI:", uri);

    // Generate a new signer for the asset
    const assetSigner = generateSigner(umi);

    // Create the asset
    const result = await create(umi, {
      asset: assetSigner,
      name: name,
      uri: uri,
    }).sendAndConfirm(umi);

    console.log("NFT minted, result:", result);
    return { result, uri };
  } catch (error) {
    console.error("Error in uploadAndMintNFT:", error);
    throw error;
  }
};