// filepath: /github-repo-monitor/src/bot.ts
import fetch from 'node-fetch';
import notifier from 'node-notifier';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_API_URL = 'https://api.github.com/repos/archgo57/github-repo-monitor/commits';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let previousCommitSha: string | null = null;

async function fetchLatestCommit() {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  const data = await response.json();
  return data[0].sha;
}

function checkForUpdates(currentCommitSha: string) {
  if (currentCommitSha !== previousCommitSha) {
    previousCommitSha = currentCommitSha;
    sendNotification();
  }
}

function sendNotification() {
  notifier.notify({
    title: 'GitHub Repository Updated',
    message: 'A new commit has been pushed to the repository.',
    icon: path.join(__dirname, 'assets/robot.gif'),
    sound: true,
  });
}

async function main() {
  setInterval(async () => {
    const currentCommitSha = await fetchLatestCommit();
    checkForUpdates(currentCommitSha);
  }, 60000); // Check every 60 seconds
}

main().catch(console.error);