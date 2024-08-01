require('dotenv').config()
const axios = require('axios')

const repos = [
  { owner: 'vercel', repo: 'next.js' },
  { owner: 'FortAwesome', repo: 'Font-Awesome' },
  { owner: 'duckduckgo', repo: 'duckduckgo-privacy-extension' },
  { owner: 'brave', repo: 'brave-browser' },
  { owner: 'gorhill', repo: 'uBlock' },
  { owner: 'adblockplus', repo: 'adblockpluschrome' },
  { owner: 'AdguardTeam', repo: 'AdguardBrowserExtension' },
  { owner: 'pi-hole', repo: 'pi-hole' },
  { owner: 'ghostery', repo: 'ghostery-extension' },
  { owner: 'EFForg', repo: 'privacybadger' },
  { owner: 'gorhill', repo: 'uBlock' },
  { owner: 'hackademix', repo: 'noscript' },
]

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function checkIssues() {
  const monthAgo = new Date()
  monthAgo.setMonth(monthAgo.getMonth() - 1)

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

      const issues = response.data.filter((issue) => {
        const createdAt = new Date(issue.created_at)
        return createdAt >= monthAgo
      })
      if (issues.length > 0) {
        console.log(`Found ${issues.length} issues with label "good first issue" in ${owner}/${repo}:`)
        issues.forEach((issue) => {
          console.log(`- ${issue.title}: ${issue.html_url}`)
        })
      }
    } catch (error) {
      console.error(`Error fetching issues for ${owner}/${repo}:`, error)
    }
  }
}

setInterval(checkIssues, 3600000)
checkIssues()
