import React from 'react';

const TransactionLink = ({ transactionId }) => {
  if (!transactionId) {
    console.log("No transaction ID provided");
    return null;
  }

  console.log("Received transaction ID:", transactionId);

  const solscanUrl = `https://solscan.io/tx/${transactionId}`;

  return (
    <div className="mt-4 text-center">
      <a
        href={solscanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        View Transaction on Solscan
      </a>
    </div>
  );
};

export default TransactionLink;