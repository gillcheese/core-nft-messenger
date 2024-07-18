import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import TextInput from '../components/TextInput';
import TextToImage from '../components/TextToImage';
import { uploadAndMintNFT } from '../utils/metaplex';
import { useSolana } from '../contexts/SolanaContext';

export default function Home() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nftResult, setNftResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { wallet, umi } = useSolana();

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleImageGenerated = (url) => {
    setImageUrl(url);
  };

  const handleRecipientChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleMintNFT = async () => {
    if (!wallet.connected || !umi) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!recipientAddress) {
      alert("Please enter a recipient address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const { mintResult, transferResult, uri } = await uploadAndMintNFT(
        umi,
        new Uint8Array(arrayBuffer),
        'My Text NFT',
        text,
        recipientAddress
      );
      setNftResult({ mintResult, transferResult, uri });
    } catch (error) {
      console.error("Error in handleMintNFT:", error);
      alert("Error minting and sending NFT. Please try again.");
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

      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={handleRecipientChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleMintNFT} 
          disabled={!imageUrl || isLoading || !wallet.connected || !recipientAddress}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Minting and Sending...' : 'Mint and Send NFT'}
        </button>
      </div>

      {nftResult && (
        <div className="mt-4 text-center">
          <p className="text-green-600">NFT minted and sent!</p>
          <p>Mint Transaction ID: {nftResult.mintResult.signature}</p>
          <p>Transfer Transaction ID: {nftResult.transferResult.signature}</p>
          <p>Metadata URI: {nftResult.uri}</p>
        </div>
      )}
    </div>
  );
}