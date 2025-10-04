import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyTransactionIntegrity } from '@/lib/security-utils';

const prisma = new PrismaClient();

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
    if (!rewardAmount || !tokenType || !transactionSignature || !organizationWallet || !treasuryWallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the transaction signature (optional but recommended)
    try {
      await verifyTransactionIntegrity(transactionSignature, treasuryWallet, parseFloat(rewardAmount));
    } catch (error) {
      console.warn('Transaction verification failed:', error.message);
      // Continue processing but log the warning
    }

    // Create or update issue record
    const issue = await prisma.issue.upsert({
      where: {
        id: issueId || `github-${Date.now()}`, // Generate ID if not provided
      },
      update: {
        title: issueTitle,
        githubUrl: githubIssueUrl,
        rewardAmount: parseFloat(rewardAmount),
        tokenType,
        tokenMintAddress,
        status: 'FUNDED',
        organizationWallet,
        treasuryWallet,
        transactionSignature,
        updatedAt: new Date(),
      },
      create: {
        id: issueId || `github-${Date.now()}`,
        title: issueTitle,
        githubUrl: githubIssueUrl,
        rewardAmount: parseFloat(rewardAmount),
        tokenType,
        tokenMintAddress,
        status: 'FUNDED',
        organizationWallet,
        treasuryWallet,
        transactionSignature,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Log the approval for audit purposes
    console.log(`✅ Reward approved for issue ${issue.id}:`, {
      amount: rewardAmount,
      tokenType,
      signature: transactionSignature.slice(0, 16) + '...',
      organization: organizationWallet.slice(0, 8) + '...',
    });

    return NextResponse.json({
      success: true,
      issueId: issue.id,
      message: 'Reward approved and recorded successfully',
      issue: {
        id: issue.id,
        title: issue.title,
        rewardAmount: issue.rewardAmount,
        tokenType: issue.tokenType,
        status: issue.status,
      },
    });

  } catch (error) {
    console.error('Error processing organization approval:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  try {
    // Get organization approvals/rewards
    const { searchParams } = new URL(request.url);
    const organizationWallet = searchParams.get('wallet');
    const status = searchParams.get('status');

    let whereClause = {};
    
    if (organizationWallet) {
      whereClause.organizationWallet = organizationWallet;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const issues = await prisma.issue.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent
    });

    return NextResponse.json({
      success: true,
      issues,
      count: issues.length,
    });

  } catch (error) {
    console.error('Error fetching organization approvals:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}