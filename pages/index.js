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

    if (!recipientAddress || recipientAddress.length !== 44) {
      alert("Please enter a valid Solana address for the recipient.");
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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center mb-2">BOOP!</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-2 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-center mb-4">
                  <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600" />
                </div>
                <div className="mb-4">
                  <TextInput onTextChange={handleTextChange} />
                </div>
                <TextToImage text={text} onImageGenerated={handleImageGenerated} />
                {imageUrl && (
                  <div className="mt-4">
                    <img src={imageUrl} alt="Generated PNG" className="mx-auto border rounded-lg shadow-md w-full max-w-xs h-auto" />
                  </div>
                )}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={handleRecipientChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={handleMintNFT} 
                    disabled={!imageUrl || isLoading || !wallet.connected || !recipientAddress}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                  >
                    {isLoading ? 'Minting and Sending...' : 'Mint and Send NFT'}
                  </button>
                </div>
              </div>
              {nftResult && (
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <p className="text-green-600">NFT minted and sent!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}