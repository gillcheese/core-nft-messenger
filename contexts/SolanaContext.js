import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { initializeUmi } from '../utils/metaplex';

const SolanaContext = createContext(null);

export function SolanaProvider({ children }) {
  const wallet = useWallet();
  const [umi, setUmi] = useState(null);

useEffect(() => {
  if (wallet.connected && wallet.publicKey) {
    (async () => {
      try {
        console.log("Attempting to initialize Umi");
        const umiInstance = await initializeUmi(wallet);
        console.log("Umi initialized successfully");
        setUmi(umiInstance);
      } catch (error) {
        console.error("Error initializing Umi:", error);
      }
    })();
  } else {
    console.log("Resetting Umi to null");
    setUmi(null);
  }
}, [wallet.connected, wallet.publicKey]);

  return (
    <SolanaContext.Provider value={{ wallet, umi }}>
      {children}
    </SolanaContext.Provider>
  );
}

export function useSolana() {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
}