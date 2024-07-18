import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import TextInput from '../components/TextInput';
import TextToImage from '../components/TextToImage';
import { uploadAndMintNFT } from '../utils/metaplex';
import { useSolana } from '../contexts/SolanaContext';

export default function Home() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [nftResult, setNftResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { wallet, umi } = useSolana();

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleImageGenerated = (url) => {
    setImageUrl(url);
  };

  const handleMintNFT = async () => {
    if (!wallet.connected || !umi) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    try {
      // Convert the data URL to an ArrayBuffer
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const { result, uri } = await uploadAndMintNFT(umi, new Uint8Array(arrayBuffer), 'My Text NFT', text);
      setNftResult({ result, uri });
    } catch (error) {
      console.error("Error in handleMintNFT:", error);
      alert("Error minting NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center">Text to NFT</h1>
      
      <div className="flex justify-center">
        <WalletMultiButton />
      </div>

      <div className="max-w-md mx-auto">
        <TextInput onTextChange={handleTextChange} />
      </div>

      <TextToImage text={text} onImageGenerated={handleImageGenerated} />

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated PNG" className="mx-auto border rounded-lg shadow-md" />
        </div>
      )}

      <div className="flex justify-center">
        <button 
          onClick={handleMintNFT} 
          disabled={!imageUrl || isLoading || !wallet.connected}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>

      {nftResult && (
        <div className="mt-4 text-center">
          <p className="text-green-600">NFT minted!</p>
          <p>Transaction ID: {nftResult.result.signature}</p>
          <p>Metadata URI: {nftResult.uri}</p>
        </div>
      )}
    </div>
  );
}