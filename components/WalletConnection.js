// components/WalletConnection.js
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const WalletConnection = () => (
  <div className="flex justify-center mb-4">
    <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600" />
  </div>
);

export default WalletConnection;