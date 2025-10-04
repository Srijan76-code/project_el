import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { PublicKey, Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const tokenMint = new PublicKey("FVWUJ8Ut6kT2fSM6bHkGGTJ32FmjQ2VGvyLwSzBAknA8");


const EOS_PRICE_USD = 0.05; 

export const getTokenBalance = async (walletPublicKey) => {
  try {
    const tokenAccount = await getAssociatedTokenAddress(tokenMint, walletPublicKey);
    const accountInfo = await getAccount(connection, tokenAccount);

   
    const balanceBigInt = BigInt(accountInfo.amount.toString());
    const balance = Number(balanceBigInt) / 10 ** 6;

    const usdValue = balance * EOS_PRICE_USD;
    return { balance, usdValue };
  } catch (err) {
    console.log("Error fetching token balance:", err);
    return { balance: 0, usdValue: 0 };
  }
};

const metadataUri = "https://raw.githubusercontent.com/naveenkumar29052006/eos/main/metadata.json";

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
