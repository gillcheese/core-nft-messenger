This is the open sourced code for Boop, a Metaplex Core NFT Messenger.
Please note there is a tx built in for fee collection. Collection address can be specified in environmental variable

```bash
FEE_RECIPIENT_ADDRESS=youraddressgoeshere

```
If you do not want to charge fee, omit from the transactionBuilder, like so:

```js
let tx = transactionBuilder();

    // Add create instruction
    tx = tx.add(
      create(umi, {
        asset: assetSigner,
        name: name,
        uri: uri,
        sellerFeeBasisPoints: 0, // 0% royalties
      })
    );

    // Add transfer NFT instruction
    tx = tx.add(
      transferV1(umi, {
        asset: assetSigner.publicKey,
        newOwner: publicKey(recipientAddress),
      })
    );
````

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
"# core-nft-messenger" 
