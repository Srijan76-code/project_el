

import { rewardContributorForIssue } from "@/actions/rewardContributorForIssue";

// Helper function to find "closes #123" in a PR body
function getClosingIssueId(body) {
  if (!body) return null;
  const match = body.match(/(?:closes|fixes|resolves)\s#(\d+)/i);
  return match ? BigInt(match[1]) : null;
}

export default async function handler(req, res) {
  
  // IMPORTANT: You must verify the webhook signature in a real app!
  // This ensures the request is actually from GitHub.
  // For the hackathon, we might skip this, but it's critical for production.

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;
    
    // We only care about merged Pull Requests
    if (event === 'pull_request' && payload.action === 'closed' && payload.pull_request?.merged) {
      const pr = payload.pull_request;
      
      const githubUsername = pr.user.login;
      const githubIssueId = getClosingIssueId(pr.body);

      if (githubIssueId && githubUsername) {
        console.log(`PR merged. Rewarding ${githubUsername} for closing issue #${githubIssueId}`);
        
        // Call the server action to handle the logic
        const result = await rewardContributorForIssue(githubIssueId, githubUsername);
        
        if (result.error) {
          return res.status(400).json({ message: result.error });
        }
        
        return res.status(200).json({ message: 'Contributor rewarded!', data: result });
      }
    }

    res.status(200).json({ message: 'Event received, but no action taken.' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}








