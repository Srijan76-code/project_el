
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createGithubWebhook } from "./createGithubWebhook";




// Creates or updates a user from Clerk webhook data.
export async function upsertUser(data) {
  try {
    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        githubUsername: data.username,
        githubAvatarUrl: data.avatarUrl,
      },
      create: {
        id: data.id,
        email: data.email,
        githubUsername: data.username,
        githubAvatarUrl: data.avatarUrl,
      },
    });
    return { user };
  } catch (error) {
    console.error("Failed to upsert user:", error);
    return { error: "Could not create or update user." };
  }
}

// Updates the wallet address for the current user.
export async function updateUserWallet(walletAddress) {
  const { userId } = auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { walletAddress },
    });
    revalidatePath("/profile");
    return { user: updatedUser };
  } catch (error) {
    console.error("Failed to update wallet:", error);
    return { error: "Could not update wallet address." };
  }
}

// Gets all profile data for the current user.


export async function getUserProfileData() {
  const { userId } = auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found." };

    // 1. Fetch all contributions with related issue and repository data
    const contributions = await prisma.contribution.findMany({
      where: { contributorId: userId },
      include: {
        issue: {
          include: {
            repository: {
              select: {
                name: true, // Select the repository name
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: 'desc', // Show the most recent contributions first
      },
    });

    // 2. Transform the data to match the 'allHistory' structure
    const contributedRepos = contributions.map(contribution => ({
      repo: contribution.issue.repository.name,
      issue: contribution.issue.title,
      reward: `${Number(contribution.issue.tokenReward)}x`,
      date: new Date(contribution.completedAt).toLocaleDateString('en-GB'), // Formats date as DD/MM/YYYY
      status: 'Success', // Assuming all logged contributions were successful
    }));

    // 3. Calculate total earned tokens from the same data
    const totalEarned = contributions.reduce((sum, c) => sum + Number(c.issue.tokenReward), 0);

    return {
      user,
      stats: {
        totalEarned,
        contributedRepos,
        contributionCount: contributions.length,
      },
    };
  } catch (error) {
    console.error("Failed to get user profile data:", error);
    return { error: "Could not fetch user profile." };
  }
}
// --- EXPLORE & LEADERBOARD ACTIONS ---

// Fetches all repos for the Explore page.
export async function getExplorePageRepos() {
  try {
    const repos = await prisma.repository.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        organization: { select: { name: true, avatarUrl: true } },
        _count: {
          select: { issues: { where: { status: "OPEN" } } },
        },
      },
    });
    return { repos };
  } catch (error) {
    console.error("Failed to get repos:", error);
    return { error: "Could not fetch repositories." };
  }
}

// Fetches the top 20 ranked users.
export async function getLeaderboard() {
  try {
    // This single query gets all the data you need.
    const rawData = await prisma.$queryRaw`
      SELECT
        u."githubUsername" AS "name",
        u."githubAvatarUrl" AS "photo",
        SUM(i."tokenReward") AS "points",
        COUNT(c.id) AS "issuesSolved"
      FROM "users" u
      JOIN "contributions" c ON u.id = c."contributorId"
      JOIN "issues" i ON c."issueId" = i.id
      GROUP BY u.id
      ORDER BY "points" DESC
      LIMIT 10;
    `;

    // Format the data to match your structure and handle number conversions.
    const leaderboard = rawData.map(user => ({
      name: user.name,
      issues: Number(user.issuesSolved), // Convert from BigInt
      issuesSolved: Number(user.issuesSolved), // Convert from BigInt
      points: Number(user.points), // Convert from Decimal/BigInt
      photo: user.photo,
    }));

    return { leaderboard };

  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return { error: "Could not fetch leaderboard." };
  }
}

// --- ORGANIZATION & REPO ACTIONS ---

// Creates an org and sets the current user as admin.
export async function createOrganization(data) {
  const { userId } = auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const newOrg = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.name,
          githubId: data.githubId,
          avatarUrl: data.avatarUrl,
        },
      });
      await tx.orgMember.create({
        data: { orgId: org.id, userId: userId, role: "ADMIN" },
      });
      return org;
    });
    revalidatePath("/dashboard");
    return { organization: newOrg };
  } catch (error) {
    console.error("Failed to create organization:", error);
    return { error: "Could not create organization." };
  }
}

// Registers a new repository for an organization.
export async function registerRepo(data, repoOwner, userGithubToken) { 
    const { userId } = auth();
    if (!userId) return { error: "Not authenticated" };
  
    try {
      // First, save the repo to your database
      const repo = await prisma.repository.create({ data });
  
      // Immediately after, create the webhook on GitHub
      const webhookResult = await createGithubWebhook(
        repoOwner,
        repo.name,
        userGithubToken
      );
  
      if (webhookResult.error) {
        console.error("Webhook setup failed:", webhookResult.error);
      }
      
      revalidatePath("/explore");
      revalidatePath(`/organization/${data.orgId}`);
      return { repo };
    } catch (error) {
      console.error("Failed to register repo:", error);
      return { error: "Could not register repository." };
    }
  }

  
// Sets or updates the token bounty for an issue.
export async function setIssueBounty(data) {
  const { userId } = auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const issue = await prisma.issue.upsert({
      where: { githubIssueId: data.githubIssueId },
      update: { rewardAmount: data.rewardAmount },
      create: {
        repoId: data.repoId,
        githubIssueId: data.githubIssueId,
        number: data.number,
        title: data.title,
        rewardAmount: data.rewardAmount,
      },
    });
    revalidatePath(`/repo/${data.repoId}`);
    return { issue };
  } catch (error) {
    console.error("Failed to set issue bounty:", error);
    return { error: "Could not set bounty on issue." };
  }
}




