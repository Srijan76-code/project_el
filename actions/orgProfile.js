"use server";
import { Octokit } from "octokit";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createGithubWebhook } from "./createGithubWebhook";


// Action for Step 1: Creates an org and sets the current user as admin.
export async function createOrganization(data) {
  const { userId } = await auth();
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

// Action for Step 2: Fetches a user's repositories from GitHub.
export async function getGithubReposForUser() {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    // Get user from database to get their GitHub token
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.githubUsername) {
      return { error: "No GitHub account connected" };
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const response = await octokit.rest.repos.listForUser({
      username: user.githubUsername,
      type: "owner",
      per_page: 10
    });

    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      owner: {
        id: repo.owner.id,
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      }
    }));

    return { repos };
  } catch (error) {
    console.error("Failed to get GitHub repos:", error);
    return { error: "Could not fetch GitHub repositories." };
  }
}

// Action for Step 3: Registers a new repository for an organization.
export async function registerRepo(data, repoOwner, userGithubToken) {
  const { userId } = auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    // Save the repo to your database
    const repo = await prisma.repository.create({ data });

    // After saving, create the GitHub webhook for automation

    await createGithubWebhook(repoOwner, repo.name, userGithubToken);

    revalidatePath("/explore");
    revalidatePath(`/organization/${data.orgId}`);
    return { repo };
  } catch (error) {
    console.error("Failed to register repo:", error);
    return { error: "Could not register repository." };
  }
}

// Action for Step 4: Fetches issues from GitHub for the repo management page.
export async function getIssuesFromGithub(repoOwner, repoName, userGithubToken) {
  if (!userGithubToken) return { error: "User does not have a GitHub token." };
  try {
    const octokit = new Octokit({ auth: userGithubToken });
    const response = await octokit.rest.issues.listForRepo({
      owner: repoOwner,
      repo: repoName,
      state: "open",
    });
    // Simplify the response for the frontend
    const issues = response.data.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      creatorName: issue.user.login,
      creatorAvatarUrl: issue.user.avatar_url,
      tags: issue.labels.map(label => label.name),
      assigneeName: issue.assignee?.login || null,
      assigneeAvatarUrl: issue.assignee?.avatar_url || null,
    }));
    return { issues };
  } catch (error) {
    console.error("Failed to get issues from GitHub:", error);
    return { error: "Could not fetch issues from GitHub." };
  }
}

// Action for Step 4: Sets a token bounty for an issue.
export async function setIssueBounty(data) {
  const { userId } = auth();
  if (!userId) return { error: "Not authenticated" };
  try {
    const issue = await prisma.issue.upsert({
      where: { githubIssueId: data.githubIssueId },
      update: { tokenReward: data.tokenReward },
      create: {
        repoId: data.repoId,
        githubIssueId: data.githubIssueId,
        number: data.number,
        title: data.title,
        tokenReward: data.tokenReward,
        // Also save the extra details from GitHub
        tags: data.tags,
        creatorName: data.creatorName,
        creatorAvatarUrl: data.creatorAvatarUrl,
        assigneeName: data.assigneeName,
        assigneeAvatarUrl: data.assigneeAvatarUrl,
      },
    });
    revalidatePath(`/repo/${data.repoId}`);
    return { issue };
  } catch (error) {
    console.error("Failed to set issue bounty:", error);
    return { error: "Could not set bounty on issue." };
  }
}

// Action to get all registered repositories for an organization
export async function getRegisteredRepos(orgId) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    // First, verify the user has access to this organization
    const org = await prisma.organization.findFirst({
      where: {
        id: orgId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!org) {
      return { error: "Organization not found or access denied" };
    }

    // Get all repositories for this organization
    const repos = await prisma.repository.findMany({
      where: {
        organizationId: orgId
      },
      include: {
        issues: {
          select: {
            id: true,
            title: true,
            status: true,
            bountyAmount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { repos };
  } catch (error) {
    console.error("Failed to fetch organization repositories:", error);
    return { error: "Could not fetch organization repositories" };
  }
}

// Action to add a repository to an organization
export async function addRepositoryToOrg(repoData) {
  const { userId } = await auth();
  if (!userId) return { error: "Not authenticated" };

  try {
    // First check if user is org admin
    const orgMember = await prisma.orgMember.findFirst({
      where: {
        userId,
        orgId: repoData.orgId,
        role: "ADMIN"
      }
    });

    if (!orgMember) {
      return { error: "Not authorized to add repositories" };
    }

    const repository = await prisma.repository.create({
      data: {
        name: repoData.name,
        description: repoData.description || "",
        githubRepoId: BigInt(repoData.id),
        url: `https://github.com/${repoData.fullName}`,
        orgId: repoData.orgId
      }
    });

    // Create webhook for the repository
    await createGithubWebhook(
      repoData.owner.login,
      repoData.name,
      process.env.GITHUB_TOKEN
    );

    revalidatePath('/org');
    return { repository };

  } catch (error) {
    console.error("Failed to add repository:", error);
    return { error: "Could not add repository" };
  }
}