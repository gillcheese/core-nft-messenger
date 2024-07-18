import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export const uploadToArweave = async (imageData) => {
  const transaction = await arweave.createTransaction({ data: imageData });
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);
  return `https://arweave.net/${transaction.id}`;
};