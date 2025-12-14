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

| Level | Color        | Description       | Target Commits |
| ----- | ------------ | ----------------- | -------------- |
| 0     | Gray         | No contributions  | 0              |
| 1     | Light Green  | Low activity      | 1              |
| 2     | Medium Green | Moderate activity | 5              |
| 3     | High Green   | High activity     | 10             |
| 4     | Max Green    | Maximum activity  | 15             |

If a cell already has contributions, the app calculates the delta needed.

> **Important**: GitHub uses a **relative percentile-based system** to determine colors, which means the colors you see in the app may not be a 100% accurate reflection of what appears on your GitHub profile. Colors are calculated based on your personal maximum daily contributions, so the same number of commits might appear differently depending on your overall activity level. The tool targets specific commit counts to achieve each color level, but slight variations may occur.

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
