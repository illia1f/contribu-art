# GitHub OAuth Setup Guide

This guide walks you through setting up GitHub OAuth for Contribu-Art.

## Prerequisites

- A GitHub account
- Your application running locally or deployed

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on **OAuth Apps** in the left sidebar
3. Click the **New OAuth App** button

## Step 2: Configure the OAuth App

Fill in the following fields:

| Field                          | Value                                            |
| ------------------------------ | ------------------------------------------------ |
| **Application name**           | `Contribu-Art` (or your preferred name)          |
| **Homepage URL**               | `http://localhost:3000` (for development)        |
| **Application description**    | Optional - describe your app                     |
| **Authorization callback URL** | `http://localhost:3000/api/auth/callback/github` |

> **Important**: For production, replace `http://localhost:3000` with your actual domain.

Click **Register application**.

## Step 3: Get Your Credentials

After registering, you'll see your app's settings page:

1. **Client ID**: Copy this value - it's displayed on the page
2. **Client Secret**: Click **Generate a new client secret** and copy it immediately (you won't be able to see it again)

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

### Generating NEXTAUTH_SECRET

Run one of these commands to generate a secure secret:

**Using OpenSSL (Linux/Mac/Git Bash):**

```bash
openssl rand -base64 32
```

**Using PowerShell (Windows):**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Using Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 5: Required OAuth Scopes

The application requests the following scopes during authentication:

| Scope        | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| `read:user`  | Read your GitHub profile information                     |
| `user:email` | Access your email addresses                              |
| `repo`       | Full access to repositories (required to create commits) |

> **Note**: The `repo` scope is required because the app needs to create commits in your repositories to paint your contribution graph.

## Production Setup

When deploying to production:

1. Update the **Homepage URL** to your production domain
2. Update the **Authorization callback URL** to `https://yourdomain.com/api/auth/callback/github`
3. Update `NEXTAUTH_URL` in your environment variables to your production URL

## Contribution Graph Color Levels

GitHub's contribution graph uses **relative percentile-based coloring**. The intensity of each color is based on YOUR personal maximum daily contributions over the past year, divided into quartiles.

### How GitHub Calculates Colors

| Level | Color        | Percentile Range       | Description       |
| ----- | ------------ | ---------------------- | ----------------- |
| 0     | Gray         | 0 contributions        | No activity       |
| 1     | Light Green  | 1% - 25% of your max   | Low activity      |
| 2     | Medium Green | 25% - 50% of your max  | Moderate activity |
| 3     | High Green   | 50% - 75% of your max  | High activity     |
| 4     | Dark Green   | 75% - 100% of your max | Maximum activity  |

### Target Commits Used by Contribu-Art

Since the levels are relative, Contribu-Art uses target commit counts designed to reliably achieve each color level:

| Level | Target Commits | Effect                                            |
| ----- | -------------- | ------------------------------------------------- |
| 0     | 0              | Clear (cannot remove existing commits)            |
| 1     | 1              | Ensures at least light green                      |
| 2     | 5              | Pushes into 2nd quartile for most users           |
| 3     | 10             | Pushes into 3rd quartile for most users           |
| 4     | 15             | Pushes into 4th quartile (darkest) for most users |

### Smart Commit Calculation

Contribu-Art considers your **existing contributions** when painting:

| You Want | Existing Commits | Target | Commits Added |
| -------- | ---------------- | ------ | ------------- |
| Level 1  | 0                | 1      | 1             |
| Level 2  | 2                | 5      | 3             |
| Level 3  | 5                | 10     | 5             |
| Level 4  | 8                | 15     | 7             |
| Level 2  | 6                | 5      | 0 (skip)      |
| Level 3  | 12               | 10     | 0 (skip)      |

> **Note**: If your existing contributions already meet or exceed the target, no additional commits are created for that cell.

### Official GitHub Documentation

For authoritative information on how contributions are counted and displayed:

- [Viewing contributions on your profile](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile)
- [Why are my contributions not showing up?](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile)

## Troubleshooting

### "OAuth App access restrictions"

If you're part of an organization with OAuth app restrictions, you may need to request access or use a personal repository.

### "Bad credentials" error

- Verify your Client ID and Client Secret are correct
- Ensure there are no extra spaces in your environment variables
- Regenerate the client secret if needed

### Commits not appearing on contribution graph

For commits to count toward your contribution graph:

1. The repository must be on the default branch (usually `main` or `master`)
2. The email used for commits must be verified and associated with your GitHub account
3. The repository cannot be a fork (unless commits are made to the fork's default branch)

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Client Secret secure and private
- Rotate your Client Secret if you suspect it has been compromised
