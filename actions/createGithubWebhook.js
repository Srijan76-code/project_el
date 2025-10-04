"use server"

import { Octokit } from "octokit";



// Creates a GitHub webhook for a newly registered repository.
export async function createGithubWebhook(repoOwner, repoName, userGithubToken) {
  if (!userGithubToken) return { error: "User does not have a GitHub token." };

  const octokit = new Octokit({ auth: userGithubToken });
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/github`;

  // A secret to secure your webhook endpoint.
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET; 
  if (!webhookSecret) return { error: "Webhook secret is not configured." };

  try {
    await octokit.rest.repos.createWebhook({
      owner: repoOwner,
      repo: repoName,
      events: ["pull_request"], // We only care about PR events
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: webhookSecret,
      },
      active: true,
    });
    console.log(`Webhook created successfully for ${repoOwner}/${repoName}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create webhook:", error);
    return { error: "Could not create the GitHub webhook." };
  }
}