import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"

async function sendSplTokenReward(recipientAddress, amount, issueNumber) {
      // --- REAL SOLANA LOGIC GOES HERE ---
    // 1. Initialize connection to Solana cluster.
    // 2. Load your app's wallet from a secure environment variable.
    // 3. Construct and send the SPL token transfer transaction.
    // 4. Wait for confirmation.
    // 5. Return the transaction signature.
    // For now, we'll return a dummy signature.
    console.log(`Sending ${amount} tokens for issue #${issueNumber} to ${recipientAddress}`);

    const dummySignature = `dummy_tx_${Date.now()}`;
    return { signature: dummySignature };
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
      if (issue.tokenReward <= 0) return { error: 'Issue has no token reward set.' };
  
      // 3. Perform the on-chain Solana transaction
      const { signature, error } = await sendSplTokenReward(
        user.walletAddress,
        issue.tokenReward,
        issue.number
      );
  
      if (error) throw new Error(error);
  
      // 4. Update your database in a single transaction
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
  
      // 5. Revalidate paths to update the UI for users
      revalidatePath(`/profile/${user.githubUsername}`);
      revalidatePath("/leaderboard");
  
      return { success: true, contribution };
    } catch (error) {
      console.error("Failed to reward contributor:", error);
      return { error: error.message };
    }
  }