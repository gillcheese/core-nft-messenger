export default function handler(req, res) {
  res.status(200).json({ rpcUrl: process.env.RPC_URL });
}