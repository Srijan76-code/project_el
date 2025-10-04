import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const tokenMint = new PublicKey("FVWUJ8Ut6kT2fSM6bHkGGTJ32FmjQ2VGvyLwSzBAknA8");


const EOS_PRICE_USD = 0.05; 

export async function getTokenBalance(walletAddress, tokenMintAddress) {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const walletPublicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(tokenMintAddress);
    
    // Get the token account for this wallet and mint
    const tokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    );
    
    // Check if account exists first
    const accountInfo = await connection.getAccountInfo(tokenAccount);
    if (!accountInfo) {
      console.log('Token account does not exist, returning 0 balance');
      return 0;
    }
    
    // Get account info
    const account = await getAccount(connection, tokenAccount);
    
    return Number(account.amount) / Math.pow(10, 6); // 6 decimals
  } catch (error) {
    console.error('Error fetching token balance:', error);
    // If it's a TokenAccountNotFoundError, return 0
    if (error.name === 'TokenAccountNotFoundError' || error.message.includes('TokenAccountNotFoundError')) {
      console.log('Token account not found, returning 0 balance');
      return 0;
    }
    return 0;
  }
}const metadataUri = "https://raw.githubusercontent.com/naveenkumar29052006/eos/main/metadata.json";

export const fetchTokenMetadata = async () => {
  try {
    const res = await fetch(metadataUri);
    const metadata = await res.json();
    return metadata;
  } catch (err) {
    console.log("Error fetching metadata:", err);
    return null;
  }
};
