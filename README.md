# Contribu-Art

A web app for painting on your GitHub contribution graph by creating backdated commits.

<!-- TODO: Add screenshot or demo GIF here -->

## What it does

Select cells on a replica of your contribution graph, pick an intensity level, and the app creates commits with the appropriate dates to "paint" those cells green. Useful for pixel art, writing messages, or just making your profile look less empty.

## Features

- Interactive contribution graph with click-and-drag selection
- 5 intensity levels matching GitHub's color scheme
- View and paint any year since account creation
- Two commit modes:
  - **Transaction** – pushes all commits at once
  - **Incremental** – pushes after each cell (slower, but you can watch it happen)
- Accounts for existing contributions when calculating commits needed

## Setup

**Prerequisites:** Node.js 18+, a GitHub OAuth App

1. Clone and install:

   ```bash
   git clone https://github.com/yourusername/contribu-art.git
   cd contribu-art
   npm install
   ```

2. Create `.env.local`:

   ```env
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret
   AUTH_SECRET=any_random_string
   ```

3. Run:

   ```bash
   npm run dev
   ```

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for OAuth app configuration.

## How GitHub calculates colors

GitHub uses percentiles based on your personal max contributions, not fixed thresholds. The app targets these commit counts per intensity:

| Level | Target commits | Color        |
| ----- | -------------- | ------------ |
| 0     | 0              | Gray         |
| 1     | 1              | Light green  |
| 2     | 5              | Medium green |
| 3     | 10             | Green        |
| 4     | 15             | Dark green   |

If a cell already has contributions, the app calculates the delta needed.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- NextAuth v5
- Octokit (GitHub API)

## Notes

- Consider using a dedicated repo for this – it creates a lot of small commits
- Commits can take a few minutes to show up on your profile
- You can't remove existing contributions, only add to them

## Credits

Inspired by [goGreen](https://github.com/fenrir2608/goGreen) by [@fenrir2608](https://github.com/fenrir2608).

## License

MIT
