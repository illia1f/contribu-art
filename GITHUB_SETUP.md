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

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

`.env.example` is the canonical list of every variable the app reads. For this OAuth setup:

- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` — from [Step 3](#step-3-get-your-credentials)
- `NEXTAUTH_SECRET` — generate using a command below
- `NEXTAUTH_URL` — your app URL (`http://localhost:3000` for development)

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
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` in your environment variables to your production URL

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
