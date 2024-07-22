// components/MintButton.js
const MintButton = ({ handleMintNFT, isDisabled, isLoading }) => (
  <div className="flex justify-center mt-6">
    <button 
      onClick={handleMintNFT} 
      disabled={isDisabled}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
    >
      {isLoading ? 'Minting and Sending...' : 'Mint and Send NFT'}
    </button>
  </div>
);

export default MintButton;