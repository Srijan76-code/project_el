"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { 
  sendSolFromTreasury, 
  sendTokenFromTreasury, 
  sendEosFromTreasury,
  verifyTransaction,
  isValidWalletAddress,
  eosUtils 
} from "@/lib/solana-utils";
import { performSecurityChecks, detectSuspiciousActivity } from "@/lib/security-utils";
import { performSecurityChecks, detectSuspiciousActivity } from "@/lib/security-utils";

/**
 * Send reward from treasury to contributor using EOS tokens
 * @param {string} recipientAddress - Contributor's wallet address
 * @param {number} amount - Reward amount in EOS
 * @param {string} tokenType - "EOS", "SOL" or "SPL"
 * @param {string} tokenMintAddress - Token mint address (for SPL tokens)
 * @param {number} issueNumber - Issue number for logging
 * @returns {Promise<{signature?: string, error?: string}>}
 */
async function sendRewardFromTreasury(recipientAddress, amount, tokenType = "EOS", tokenMintAddress = null, issueNumber) {
  try {
    console.log(`Sending ${eosUtils.formatAmount(amount)} for issue #${issueNumber} to ${recipientAddress}`);
    
    // Validate recipient address
    if (!isValidWalletAddress(recipientAddress)) {
      return { error: "Invalid recipient wallet address" };
    }

    let signature;
    
    if (tokenType === "EOS") {
      signature = await sendEosFromTreasury(recipientAddress, amount);
    } else if (tokenType === "SOL") {
      signature = await sendSolFromTreasury(recipientAddress, amount);
    } else if (tokenType === "SPL") {
      if (!tokenMintAddress) {
        return { error: "Token mint address required for SPL token transfers" };
      }
      signature = await sendTokenFromTreasury(recipientAddress, tokenMintAddress, amount);
    } else {
      return { error: "Unsupported token type" };
    }

    // Verify the transaction was successful
    const isVerified = await verifyTransaction(signature);
    if (!isVerified) {
      return { error: "Transaction verification failed" };
    }

    return { signature };
  } catch (error) {
    console.error("Error sending reward from treasury:", error);
    return { error: error.message || "Failed to send reward" };
  }
}

  
  // This action is called when a PR is merged, closing an issue.
  export async function rewardContributorForIssue(githubIssueId, githubUsername) {
    try {
      // 1. Find the issue and the user in your database
      const issue = await prisma.issue.findUnique({
        where: { githubIssueId },
      });
      
      const user = await prisma.user.findFirst({
        where: { githubUsername },
      });

      // 2. Validate everything before proceeding
      if (!issue) return { error: `Issue #${githubIssueId} not found in our database.` };
      if (!user) return { error: `User '${githubUsername}' is not registered in our app.` };
      if (issue.status !== 'OPEN') return { error: 'Issue is not open for rewards.' };
      if (!user.walletAddress) return { error: `User ${githubUsername} has no wallet address.` };
      if (issue.rewardAmount <= 0) return { error: 'Issue has no token reward set.' };

      // 3. Security checks
      const securityResult = await performSecurityChecks({
        userId: user.id,
        walletAddress: user.walletAddress,
        rewardAmount: parseFloat(issue.rewardAmount),
        tokenType: "EOS", // Using EOS token
        tokenMintAddress: null,
        transactionSignature: null, // No incoming transaction to verify
      });

      if (!securityResult.passed) {
        return { error: `Security checks failed: ${securityResult.failures.join(', ')}` };
      }

      // 4. Check for suspicious activity
      const suspiciousActivity = await detectSuspiciousActivity(user.id);
      if (suspiciousActivity.suspicious) {
        return { 
          error: `Suspicious activity detected: ${suspiciousActivity.patterns.join(', ')}. Please contact support.` 
        };
      }
  
      // 5. Get reward configuration - using EOS token
      const tokenType = "EOS"; // Using your custom EOS token
      const tokenMintAddress = eosUtils.getMintAddress(); // EOS token mint address
      
      // 6. Perform the on-chain Solana transaction
      const { signature, error } = await sendRewardFromTreasury(
        user.walletAddress,
        parseFloat(issue.rewardAmount),
        tokenType,
        tokenMintAddress,
        issue.number
      );
  
      if (error) throw new Error(error);

      // 7. Update your database in a single transaction
      const contribution = await prisma.$transaction(async (tx) => {
        // Create the contribution record as a log
        const newContribution = await tx.contribution.create({
          data: {
            issueId: issue.id,
            contributorId: user.id,
            transactionSignature: signature,
          },
        });
  
        // Update the issue status to REWARDED
        await tx.issue.update({
          where: { id: issue.id },
          data: { status: 'REWARDED' },
        });
  
        return newContribution;
      });

      // 8. Revalidate paths to update the UI for users
      revalidatePath(`/profile/${user.githubUsername}`);
      revalidatePath("/leaderboard");
  
      return { success: true, contribution };
    } catch (error) {
      console.error("Failed to reward contributor:", error);
      return { error: error.message };
    }
  }