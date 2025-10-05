export function generateDummyIssues(repoId) {
  const issueTypes = ['Bug Fix', 'Feature Request', 'Documentation', 'Enhancement', 'Performance'];
  const components = ['Frontend', 'Backend', 'Database', 'API', 'UI/UX', 'Authentication'];
  const tags = ['bug', 'feature', 'documentation', 'help wanted', 'good first issue'];

  const numIssues = Math.floor(Math.random() * 6) + 5; // 5-10 issues
  const issues = [];

  for (let i = 0; i < numIssues; i++) {
    const randomType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const randomComponent = components[Math.floor(Math.random() * components.length)];
    
    issues.push({
      id: `${repoId}-${i + 1}`,
      title: `[${randomComponent}] ${randomType}: ${randomComponent} implementation needs update`,
      description: `We need to improve the ${randomComponent.toLowerCase()} implementation to handle edge cases better.`,
      reward: Math.floor(Math.random() * 50) + 10, // 10-60 EOS tokens
      tags: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => tags[Math.floor(Math.random() * tags.length)]
      ),
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: 'OPEN',
      assignee: null,
    });
  }

  return issues;
}