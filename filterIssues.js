const axios = require('axios')

// List of repositories to check
const repos = [
  { owner: 'owner1', repo: 'repo1' },
  { owner: 'owner2', repo: 'repo2' },
  // Add more repositories as needed
]

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function checkIssues() {
  for (const { owner, repo } of repos) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        params: {
          labels: 'good first issue',
          state: 'open',
        },
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      const issues = response.data
      if (issues.length > 0) {
        console.log(`Found ${issues.length} issues with label "good first issue" in ${owner}/${repo}:`)
        issues.forEach((issue) => {
          console.log(`- ${issue.title}: ${issue.html_url}`)
        })
      } else {
        console.log(`No issues found with label "good first issue" in ${owner}/${repo}.`)
      }
    } catch (error) {
      console.error(`Error fetching issues for ${owner}/${repo}:`, error)
    }
  }
}

// Run the check periodically (e.g., every hour)
setInterval(checkIssues, 3600000) // 3600000 ms = 1 hour
checkIssues()
