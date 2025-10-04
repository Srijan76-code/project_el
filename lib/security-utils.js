import { connection, verifyTransaction, getTransactionDetails } from "./solana-utils";
import { prisma } from "./prisma";

/**
 * Security utilities for Solana reward system
 */

// Rate limiting configuration
const RATE_LIMITS = {
  REWARD_REQUESTS_PER_HOUR: 10,
  MAX_REWARD_AMOUNT_SOL: 10, // Maximum reward per issue in SOL
  MIN_REWARD_AMOUNT_SOL: 0.001, // Minimum reward per issue in SOL
  MAX_REWARD_AMOUNT_EOS: 1000, // Maximum reward per issue in EOS
  MIN_REWARD_AMOUNT_EOS: 1, // Minimum reward per issue in EOS
};

// Suspicious activity patterns
const SECURITY_CHECKS = {
  MAX_FAILED_TRANSACTIONS: 5,
  TRANSACTION_TIMEOUT_MS: 30000, // 30 seconds
  MINIMUM_CONFIRMATION_TIME: 1000, // 1 second
};

/**
 * Verify that a user hasn't exceeded rate limits
 * @param {string} userId - User ID to check
 * @param {string} type - Type of action (e.g., 'reward_request')
 * @returns {Promise<{allowed: boolean, remaining: number}>}
 */
export async function checkRateLimit(userId, type = 'reward_request') {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentRequests = await prisma.contribution.count({
      where: {
        contributorId: userId,
        completedAt: {
          gte: oneHourAgo,
        },
      },
    });

    const allowed = recentRequests < RATE_LIMITS.REWARD_REQUESTS_PER_HOUR;
    const remaining = Math.max(0, RATE_LIMITS.REWARD_REQUESTS_PER_HOUR - recentRequests);

    return { allowed, remaining };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return { allowed: false, remaining: 0 };
  }
}

/**
 * Validate reward amount against security limits
 * @param {number} amount - Reward amount
 * @param {string} tokenType - Token type ("SOL" or "SPL")
 * @returns {Promise<{valid: boolean, reason?: string}>}
 */
export async function validateRewardAmount(amount, tokenType = "EOS") {
  try {
    if (tokenType === "SOL") {
      if (amount < RATE_LIMITS.MIN_REWARD_AMOUNT_SOL) {
        return { 
          valid: false, 
          reason: `Minimum reward amount is ${RATE_LIMITS.MIN_REWARD_AMOUNT_SOL} SOL` 
        };
      }
      
      if (amount > RATE_LIMITS.MAX_REWARD_AMOUNT_SOL) {
        return { 
          valid: false, 
          reason: `Maximum reward amount is ${RATE_LIMITS.MAX_REWARD_AMOUNT_SOL} SOL` 
        };
      }
    } else if (tokenType === "EOS") {
      if (amount < RATE_LIMITS.MIN_REWARD_AMOUNT_EOS) {
        return { 
          valid: false, 
          reason: `Minimum reward amount is ${RATE_LIMITS.MIN_REWARD_AMOUNT_EOS} EOS` 
        };
      }
      
      if (amount > RATE_LIMITS.MAX_REWARD_AMOUNT_EOS) {
        return { 
          valid: false, 
          reason: `Maximum reward amount is ${RATE_LIMITS.MAX_REWARD_AMOUNT_EOS} EOS` 
        };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Error validating reward amount:", error);
    return { valid: false, reason: "Validation error" };
  }
}

/**
 * Verify transaction integrity and detect potential fraud
 * @param {string} signature - Transaction signature
 * @param {string} expectedRecipient - Expected recipient address
 * @param {number} expectedAmount - Expected amount
 * @returns {Promise<{valid: boolean, reason?: string, details?: object}>}
 */
export async function verifyTransactionIntegrity(signature, expectedRecipient, expectedAmount) {
  try {
    // Basic transaction existence check
    const exists = await verifyTransaction(signature);
    if (!exists) {
      return { valid: false, reason: "Transaction not found or not confirmed" };
    }

    // Get detailed transaction information
    const details = await getTransactionDetails(signature);
    if (!details) {
      return { valid: false, reason: "Unable to retrieve transaction details" };
    }

    // Check transaction timing (prevent pre-computed transactions)
    const transactionTime = new Date(details.blockTime * 1000);
    const now = new Date();
    const timeDiff = now - transactionTime;

    if (timeDiff < SECURITY_CHECKS.MINIMUM_CONFIRMATION_TIME) {
      return { 
        valid: false, 
        reason: "Transaction confirmed too quickly - potential fraud" 
      };
    }

    if (timeDiff > SECURITY_CHECKS.TRANSACTION_TIMEOUT_MS) {
      return { 
        valid: false, 
        reason: "Transaction is too old" 
      };
    }

    // Additional checks can be added here:
    // - Verify the actual transfer amount matches expected
    // - Check for proper token program interactions
    // - Validate source and destination addresses

    return { 
      valid: true, 
      details: {
        blockTime: transactionTime,
        confirmations: details.meta?.confirmations || 0,
        fee: details.meta?.fee || 0,
      }
    };

  } catch (error) {
    console.error("Error verifying transaction integrity:", error);
    return { valid: false, reason: "Transaction verification failed" };
  }
}

/**
 * Real-time fund verification for treasury wallet
 * @param {string} tokenType - "SOL" or "SPL"
 * @param {string} tokenMintAddress - Token mint address (for SPL tokens)
 * @returns {Promise<{hasFunds: boolean, balance: number, reason?: string}>}
 */
export async function verifyTreasuryFunds(tokenType = "EOS", tokenMintAddress = null) {
  try {
    const { treasuryUtils } = await import("./solana-utils");
    
    let balance;
    
    if (tokenType === "SOL") {
      balance = await treasuryUtils.getSolBalance();
    } else if (tokenType === "EOS") {
      const balanceData = await treasuryUtils.getEosBalance();
      balance = balanceData.balance;
    } else if (tokenType === "SPL" && tokenMintAddress) {
      balance = await treasuryUtils.getTokenBalance(tokenMintAddress);
    } else {
      return { hasFunds: false, balance: 0, reason: "Invalid token configuration" };
    }

    // Minimum balance thresholds
    const minimumBalance = tokenType === "SOL" ? 0.1 : tokenType === "EOS" ? 10 : 100;
    const hasFunds = balance >= minimumBalance;

    return { 
      hasFunds, 
      balance, 
      reason: hasFunds ? null : `Insufficient treasury balance: ${balance} ${tokenType}` 
    };

  } catch (error) {
    console.error("Error verifying treasury funds:", error);
    return { hasFunds: false, balance: 0, reason: "Treasury verification failed" };
  }
}

/**
 * Log security events for monitoring
 * @param {string} event - Event type
 * @param {object} data - Event data
 * @param {string} severity - Severity level ("info", "warning", "error")
 */
export async function logSecurityEvent(event, data, severity = "info") {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      data,
    };

    console.log(`[SECURITY ${severity.toUpperCase()}] ${event}:`, data);
    
    // In production, you might want to send this to a monitoring service
    // await sendToMonitoringService(logEntry);
    
  } catch (error) {
    console.error("Error logging security event:", error);
  }
}

/**
 * Comprehensive security check before processing rewards
 * @param {object} params - Check parameters
 * @returns {Promise<{passed: boolean, failures: string[]}>}
 */
export async function performSecurityChecks({
  userId,
  walletAddress,
  rewardAmount,
  tokenType,
  tokenMintAddress,
  transactionSignature,
}) {
  const failures = [];

  try {
    // Rate limiting check
    const rateLimitCheck = await checkRateLimit(userId);
    if (!rateLimitCheck.allowed) {
      failures.push(`Rate limit exceeded. Remaining: ${rateLimitCheck.remaining}`);
    }

    // Reward amount validation
    const amountCheck = await validateRewardAmount(rewardAmount, tokenType);
    if (!amountCheck.valid) {
      failures.push(amountCheck.reason);
    }

    // Transaction integrity check
    if (transactionSignature) {
      const integrityCheck = await verifyTransactionIntegrity(
        transactionSignature,
        walletAddress,
        rewardAmount
      );
      if (!integrityCheck.valid) {
        failures.push(`Transaction integrity: ${integrityCheck.reason}`);
      }
    }

    // Treasury funds verification
    const fundsCheck = await verifyTreasuryFunds(tokenType, tokenMintAddress);
    if (!fundsCheck.hasFunds) {
      failures.push(fundsCheck.reason);
    }

    // Log security check result
    await logSecurityEvent("security_check", {
      userId,
      walletAddress,
      rewardAmount,
      tokenType,
      passed: failures.length === 0,
      failures,
    }, failures.length > 0 ? "warning" : "info");

    return { passed: failures.length === 0, failures };

  } catch (error) {
    console.error("Error performing security checks:", error);
    failures.push("Security check system error");
    
    await logSecurityEvent("security_check_error", {
      userId,
      error: error.message,
    }, "error");

    return { passed: false, failures };
  }
}

/**
 * Monitor for suspicious patterns in real-time
 * @param {string} userId - User ID to monitor
 * @returns {Promise<{suspicious: boolean, patterns: string[]}>}
 */
export async function detectSuspiciousActivity(userId) {
  const patterns = [];

  try {
    // Check for rapid successive reward claims
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentClaims = await prisma.contribution.count({
      where: {
        contributorId: userId,
        completedAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    if (recentClaims > 3) {
      patterns.push("Rapid successive reward claims");
    }

    // Check for failed transactions pattern
    // This would require additional tracking of failed attempts
    
    // Check for unusual wallet patterns
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true, createdAt: true },
    });

    if (user) {
      const accountAge = Date.now() - user.createdAt.getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (accountAge < oneDay && recentClaims > 0) {
        patterns.push("New account with immediate reward claims");
      }
    }

    return { suspicious: patterns.length > 0, patterns };

  } catch (error) {
    console.error("Error detecting suspicious activity:", error);
    return { suspicious: false, patterns: [] };
  }
}

export default {
  checkRateLimit,
  validateRewardAmount,
  verifyTransactionIntegrity,
  verifyTreasuryFunds,
  logSecurityEvent,
  performSecurityChecks,
  detectSuspiciousActivity,
};