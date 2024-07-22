import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import TextInput from '../components/TextInput';
import TextToImage from '../components/TextToImage';
import MintingProgress from '../components/MintingProgress';
import TransactionLink from '../components/TransactionLink';
import { uploadAndMintNFT } from '../utils/metaplex';
import { useSolana } from '../contexts/SolanaContext';
import { publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

export default function Home() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nftResult, setNftResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [mintingSteps, setMintingSteps] = useState([
    { name: 'Uploading image to Arweave', completed: false, inProgress: false },
    { name: 'Uploading metadata to Arweave', completed: false, inProgress: false },
    { name: 'Minting NFT', completed: false, inProgress: false },
    { name: 'Sending NFT', completed: false, inProgress: false },
  ]);
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

  const updateMintingStep = (stepIndex, status) => {
    setMintingSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === stepIndex 
          ? { ...step, completed: status === 'completed', inProgress: status === 'inProgress' }
          : step
      )
    );
  };

  const handleMintNFT = async () => {
    if (!wallet.connected || !umi) {
      alert("Please connect your wallet first.");
      return;
    }

    let isValidAddress = false;
    try {
      publicKey(recipientAddress);
      isValidAddress = true;
    } catch (error) {
      console.error("Invalid address:", error);
    }

    if (!isValidAddress) {
      alert("Please enter a valid Solana address for the recipient.");
      return;
    }

    setIsLoading(true);
    setNftResult(null);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      updateMintingStep(0, 'inProgress');
      const { result, uri } = await uploadAndMintNFT(
        umi,
        new Uint8Array(arrayBuffer),
        'Message',
        text,
        recipientAddress,
        (step) => {
          updateMintingStep(step, 'completed');
          updateMintingStep(step + 1, 'inProgress');
        }
      );
      
      console.log("Result signature:", result.signature);

      let transactionId;
      if (result.signature instanceof Uint8Array) {
        // Use bs58 to encode the Uint8Array directly
        transactionId = bs58.encode(result.signature);
      } else if (Array.isArray(result.signature)) {
        // If it's an array, convert to Uint8Array first
        transactionId = bs58.encode(new Uint8Array(result.signature));
      } else if (typeof result.signature === 'string') {
        // If it's already a string, assume it's the transaction ID
        transactionId = result.signature;
      } else {
        console.error("Unexpected signature format:", result.signature);
        throw new Error("Unable to process signature");
      }

      console.log("Transaction ID:", transactionId);
      
      setNftResult({ result, uri, transactionId });
      updateMintingStep(3, 'completed');
      
      console.log("NFT Result:", { result, uri, transactionId }); // Debug log
    } catch (error) {
      console.error("Error in handleMintNFT:", error);
      alert("Error minting and sending NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInfoPopup = () => {
    setShowInfoPopup(!showInfoPopup);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {/* GitHub logo */}
      <a 
        href="https://github.com/gillcheese/core-nft-messenger" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      </a>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="absolute top-2 right-2">
            <button 
              onClick={toggleInfoPopup}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {showInfoPopup && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={toggleInfoPopup}>
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                <div className="mt-3 text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Transactions</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      There are several transactions to approve:<br/>
                      <br/>
                      1. Upload image to Arweave<br/>
                      2. Upload metadata to Arweave<br/>
                      3. Mint and Send<br/>
                      Please note there is a 0.001 SOL fee
                    </p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      onClick={toggleInfoPopup}
                      className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-6xl font-josefin mb-0">Boop.</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
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
                {isLoading && <MintingProgress steps={mintingSteps} />}
              </div>
              {nftResult && (
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <p className="text-green-600">NFT minted and sent!</p>
                  <TransactionLink transactionId={nftResult.transactionId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}