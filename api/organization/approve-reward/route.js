import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/solana-utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      issueId,
      rewardAmount,
      tokenType,
      tokenMintAddress,
      transactionSignature,
      organizationWallet,
      treasuryWallet,
      issueTitle,
      githubIssueUrl,
    } = body;

    // Validate required fields
    if (!rewardAmount || !tokenType || !transactionSignature || !organizationWallet) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the transaction on Solana blockchain
    const isTransactionValid = await verifyTransaction(transactionSignature);
    if (!isTransactionValid) {
      return NextResponse.json(
        { error: "Transaction verification failed" },
        { status: 400 }
      );
    }

    // Update or create the issue with reward information
    let issue;
    if (issueId) {
      // Update existing issue
      issue = await prisma.issue.update({
        where: { id: parseInt(issueId) },
        data: {
          tokenReward: rewardAmount,
          // Add additional fields to store reward metadata
        },
      });
    } else {
      // Create new issue (if coming from direct approval flow)
      issue = await prisma.issue.create({
        data: {
          title: issueTitle,
          githubIssueId: BigInt(Date.now()), // Temporary - should be actual GitHub issue ID
          number: Math.floor(Math.random() * 10000), // Temporary - should be actual issue number
          tokenReward: rewardAmount,
          status: "OPEN",
          repository: {
            // This would need to be connected to actual repository
            // For now, this is a placeholder
            connect: { id: 1 } // You'll need to adjust this based on your repository logic
          }
        },
      });
    }

    // Store the approval transaction details
    // You might want to create a separate table for tracking these approvals
    const approvalRecord = {
      issueId: issue.id,
      organizationWallet,
      treasuryWallet,
      transactionSignature,
      tokenType,
      tokenMintAddress,
      rewardAmount: parseFloat(rewardAmount),
      approvedAt: new Date(),
      githubIssueUrl,
    };

    // Log the approval for audit purposes
    console.log("Reward approval recorded:", approvalRecord);

    return NextResponse.json({
      success: true,
      issueId: issue.id,
      transactionSignature,
      message: "Reward approved and funds transferred to treasury",
    });

  } catch (error) {
    console.error("Error processing organization approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}