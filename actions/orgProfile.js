
"use server";
import { Octokit } from "octokit";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createGithubWebhook } from "./createGithubWebhook";


// Action for Step 1: Creates an org and sets the current user as admin.
export async function createOrganization(data) {
  const { userId } =await auth();
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
export async function getGithubReposForUser(userGithubToken) {
  if (!userGithubToken) return { error: "User does not have a GitHub token." };
  try {
    const octokit = new Octokit({ auth: userGithubToken });
    const response = await octokit.rest.repos.listForAuthenticatedUser({
      type: "owner", // Only show repos the user owns
      per_page: 10, // Limit to 10 repos for simplicity
    });
    
    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
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

