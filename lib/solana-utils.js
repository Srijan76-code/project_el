import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Solana connection configuration (Devnet for EOS token)
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY; // Base58 encoded private key
const TREASURY_PUBLIC_KEY = process.env.NEXT_PUBLIC_TREASURY_WALLET;

// EOS Token Configuration
const EOS_TOKEN_MINT = "FVWUJ8Ut6kT2fSM6bHkGGTJ32FmjQ2VGvyLwSzBAknA8";
const EOS_DECIMALS = 6;
const EOS_PRICE_USD = 0.05;

// Initialize Solana connection
export const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Create treasury wallet from private key
export function getTreasuryWallet() {
  if (!TREASURY_PRIVATE_KEY) {
    throw new Error("Treasury private key not found in environment variables");
  }
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(TREASURY_PRIVATE_KEY))
  );
}

/**
 * Get SOL balance of a wallet
 * @param {string} walletAddress - Wallet address to check balance
 * @returns {Promise<number>} Balance in SOL
 */
export async function getSolBalance(walletAddress) {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error getting SOL balance:", error);
    throw new Error("Failed to get SOL balance");
  }
}

/**
 * Get SPL token balance of a wallet
 * @param {string} walletAddress - Wallet address to check balance
 * @param {string} tokenMintAddress - Token mint address
 * @returns {Promise<number>} Token balance
 */
export async function getTokenBalance(walletAddress, tokenMintAddress) {
  try {
    const publicKey = new PublicKey(walletAddress);
    const mintKey = new PublicKey(tokenMintAddress);
    
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKey,
      publicKey
    );
    
    // Check if account exists first
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
    if (!accountInfo) {
      console.log(`Token account does not exist for wallet: ${walletAddress.slice(0, 8)}...`);
      return 0;
    }
    
    const account = await getAccount(connection, associatedTokenAddress);
    return Number(account.amount);
  } catch (error) {
    console.error("Error getting token balance:", error);
    // If it's a TokenAccountNotFoundError, return 0
    if (error.name === 'TokenAccountNotFoundError' || 
        error.message?.includes('TokenAccountNotFoundError') ||
        error.message?.includes('could not find account')) {
      console.log(`Token account not found, returning 0 balance for ${walletAddress.slice(0, 8)}...`);
      return 0;
    }
    return 0;
  }
}

/**
 * Create a transaction for SOL transfer approval
 * @param {string} fromAddress - Sender's wallet address
 * @param {string} toAddress - Recipient's wallet address (treasury)
 * @param {number} amount - Amount in SOL
 * @returns {Promise<Transaction>} Unsigned transaction
 */
export async function createSolTransferTransaction(fromAddress, toAddress, amount) {
  try {
    const fromPubkey = new PublicKey(fromAddress);
    const toPubkey = new PublicKey(toAddress);
    const lamports = amount * LAMPORTS_PER_SOL;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  } catch (error) {
    console.error("Error creating SOL transfer transaction:", error);
    throw new Error("Failed to create SOL transfer transaction");
  }
}

/**
 * Create a transaction for SPL token transfer approval
 * @param {string} fromAddress - Sender's wallet address
 * @param {string} toAddress - Recipient's wallet address (treasury)
 * @param {string} tokenMintAddress - Token mint address
 * @param {number} amount - Amount of tokens
 * @returns {Promise<Transaction>} Unsigned transaction
 */
export async function createTokenTransferTransaction(
  fromAddress,
  toAddress,
  tokenMintAddress,
  amount
) {
  try {
    const fromPubkey = new PublicKey(fromAddress);
    const toPubkey = new PublicKey(toAddress);
    const mintKey = new PublicKey(tokenMintAddress);

    // Get associated token addresses
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      fromPubkey
    );
    const toTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      toPubkey
    );

    const transaction = new Transaction();

    // Check if recipient's token account exists, if not create it
    try {
      await getAccount(connection, toTokenAccount);
    } catch (error) {
      // Account doesn't exist, add instruction to create it
      transaction.add(
        createAssociatedTokenAccountInstruction(
          fromPubkey, // payer
          toTokenAccount, // associated token account
          toPubkey, // owner
          mintKey // mint
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        fromTokenAccount, // source
        toTokenAccount, // destination
        fromPubkey, // owner
        amount // amount
      )
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  } catch (error) {
    console.error("Error creating token transfer transaction:", error);
    throw new Error("Failed to create token transfer transaction");
  }
}

/**
 * Send SOL from treasury to user wallet
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {number} amount - Amount in SOL
 * @returns {Promise<string>} Transaction signature
 */
export async function sendSolFromTreasury(recipientAddress, amount) {
  try {
    const treasuryWallet = getTreasuryWallet();
    const recipientPubkey = new PublicKey(recipientAddress);
    const lamports = amount * LAMPORTS_PER_SOL;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasuryWallet.publicKey,
        toPubkey: recipientPubkey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [treasuryWallet]
    );

    console.log(`SOL transfer successful: ${signature}`);
    return signature;
  } catch (error) {
    console.error("Error sending SOL from treasury:", error);
    throw new Error("Failed to send SOL from treasury");
  }
}

/**
 * Send SPL tokens from treasury to user wallet
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {string} tokenMintAddress - Token mint address
 * @param {number} amount - Amount of tokens
 * @returns {Promise<string>} Transaction signature
 */
export async function sendTokenFromTreasury(
  recipientAddress,
  tokenMintAddress,
  amount
) {
  try {
    const treasuryWallet = getTreasuryWallet();
    const recipientPubkey = new PublicKey(recipientAddress);
    const mintKey = new PublicKey(tokenMintAddress);

    // Get associated token addresses
    const treasuryTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      treasuryWallet.publicKey
    );
    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      recipientPubkey
    );

    const transaction = new Transaction();

    // Check if recipient's token account exists, if not create it
    try {
      await getAccount(connection, recipientTokenAccount);
    } catch (error) {
      // Account doesn't exist, add instruction to create it
      transaction.add(
        createAssociatedTokenAccountInstruction(
          treasuryWallet.publicKey, // payer
          recipientTokenAccount, // associated token account
          recipientPubkey, // owner
          mintKey // mint
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        treasuryTokenAccount, // source
        recipientTokenAccount, // destination
        treasuryWallet.publicKey, // owner
        amount // amount
      )
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [treasuryWallet]
    );

    console.log(`Token transfer successful: ${signature}`);
    return signature;
  } catch (error) {
    console.error("Error sending tokens from treasury:", error);
    throw new Error("Failed to send tokens from treasury");
  }
}

/**
 * Verify if a transaction exists and is confirmed
 * @param {string} signature - Transaction signature
 * @returns {Promise<boolean>} Whether transaction is confirmed
 */
export async function verifyTransaction(signature) {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed",
    });
    return transaction !== null;
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return false;
  }
}

/**
 * Validate if a wallet address is valid
 * @param {string} address - Wallet address to validate
 * @returns {boolean} Whether address is valid
 */
export function isValidWalletAddress(address) {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get transaction details
 * @param {string} signature - Transaction signature
 * @returns {Promise<object|null>} Transaction details or null
 */
export async function getTransactionDetails(signature) {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    return transaction;
  } catch (error) {
    console.error("Error getting transaction details:", error);
    return null;
  }
}

/**
 * Get EOS token balance of a wallet
 * @param {string} walletAddress - Wallet address to check balance
 * @returns {Promise<{balance: number, usdValue: number}>} EOS balance and USD value
 */
export async function getEosBalance(walletAddress) {
  try {
    if (!walletAddress) {
      return 0;
    }
    const balance = await getTokenBalance(walletAddress, eosUtils.getMintAddress());
    return balance || 0;
  } catch (error) {
    console.error('Error getting EOS balance:', error);
    // If it's a token account not found error, return 0
    if (error.name === 'TokenAccountNotFoundError' || error.message.includes('TokenAccountNotFoundError')) {
      return 0;
    }
    return 0;
  }
}

/**
 * Send EOS tokens from treasury to user wallet
 * @param {string} recipientAddress - Recipient's wallet address
 * @param {number} amount - Amount of EOS tokens
 * @returns {Promise<string>} Transaction signature
 */
export async function sendEosFromTreasury(recipientAddress, amount) {
  try {
    const treasuryWallet = getTreasuryWallet();
    const recipientPubkey = new PublicKey(recipientAddress);
    const mintKey = new PublicKey(EOS_TOKEN_MINT);
    
    // Convert amount to token units (multiply by decimals)
    const tokenAmount = Math.floor(amount * (10 ** EOS_DECIMALS));

    // Get associated token addresses
    const treasuryTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      treasuryWallet.publicKey
    );
    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintKey,
      recipientPubkey
    );

    const transaction = new Transaction();

    // Check if recipient's token account exists, if not create it
    try {
      await getAccount(connection, recipientTokenAccount);
    } catch (error) {
      // Account doesn't exist, add instruction to create it
      transaction.add(
        createAssociatedTokenAccountInstruction(
          treasuryWallet.publicKey, // payer
          recipientTokenAccount, // associated token account
          recipientPubkey, // owner
          mintKey // mint
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        treasuryTokenAccount, // source
        recipientTokenAccount, // destination
        treasuryWallet.publicKey, // owner
        tokenAmount // amount in token units
      )
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [treasuryWallet]
    );

    console.log(`EOS transfer successful: ${signature}`);
    return signature;
  } catch (error) {
    console.error("Error sending EOS from treasury:", error);
    throw new Error("Failed to send EOS from treasury");
  }
}

// Treasury wallet utilities
export const treasuryUtils = {
  getPublicKey: () => {
    if (!TREASURY_PUBLIC_KEY) {
      throw new Error("Treasury public key not found in environment variables");
    }
    return new PublicKey(TREASURY_PUBLIC_KEY);
  },
  
  getSolBalance: async () => {
    return await getSolBalance(TREASURY_PUBLIC_KEY);
  },
  
  getTokenBalance: async (tokenMintAddress) => {
    return await getTokenBalance(TREASURY_PUBLIC_KEY, tokenMintAddress);
  },
  
  getEosBalance: async () => {
    const balance = await getEosBalance(TREASURY_PUBLIC_KEY);
    return {
      balance: balance || 0,
      usdValue: (balance || 0) * EOS_PRICE_USD,
    };
  },
};

// EOS Token utilities
export const eosUtils = {
  getMintAddress: () => EOS_TOKEN_MINT,
  getDecimals: () => EOS_DECIMALS,
  getPrice: () => EOS_PRICE_USD,
  
  formatAmount: (amount) => {
    return `${amount} EOS ($${(amount * EOS_PRICE_USD).toFixed(2)})`;
  },
  
  parseAmount: (tokenUnits) => {
    return tokenUnits / (10 ** EOS_DECIMALS);
  },
};
