# Contribu-Art Project Overview

**Contribu-Art** is a web application that enables users to "paint" on their GitHub contribution graph by creating backdated commits. It provides a visual interface to select dates and intensity levels, then automates the process of generating commits to match the desired pattern.

## Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 4
*   **Authentication:** NextAuth.js v5 (GitHub Provider)
*   **GitHub Integration:** Octokit (REST API)
*   **Date Handling:** date-fns

## Key Features

1.  **Interactive Graph:** A visual replica of the GitHub contribution graph allows users to click and drag to select cells.
2.  **Intensity Levels:** Users can choose from 5 intensity levels (0-4) corresponding to GitHub's color scheme.
3.  **Smart Commit Calculation:** The app calculates the difference between existing contributions and the target intensity, only creating necessary commits.
4.  **Commit Modes:**
    *   **Transaction:** Pushes all commits in a single batch at the end (faster).
    *   **Incremental:** Pushes after each cell is processed (allows real-time updates).
5.  **Streaming Progress:** The backend uses Server-Sent Events (SSE) to stream progress updates to the frontend during the painting process.

## Architecture

### Directory Structure

*   `app/`: Next.js App Router directory.
    *   `api/`: Backend API routes.
        *   `paint/route.ts`: Core logic for creating backdated commits.
        *   `auth/[...nextauth]/route.ts`: NextAuth.js handler.
    *   `components/`: React UI components.
        *   `ContributionGraph.tsx`: Main grid component for selecting dates.
        *   `ColorPicker.tsx`: Component for selecting commit intensity.
    *   `lib/`: Utility functions and shared logic.
        *   `auth.ts`: NextAuth configuration and callbacks.
*   `types/`: TypeScript type definitions (e.g., custom session types).

### Authentication

Authentication is handled via **NextAuth.js** with the GitHub provider.
*   **Scopes:** `read:user`, `user:email`, `repo` (required for creating commits).
*   **Session:** The session is extended to include `accessToken`, `username`, and `accountCreatedYear`.

### Painting Logic (`app/api/paint/route.ts`)

1.  **Validation:** Checks for valid session and required parameters.
2.  **Calculation:** Determines the number of commits needed per cell based on target intensity and existing counts.
3.  **Execution:**
    *   Gets the latest commit SHA from the default branch (`main` or `master`).
    *   Loops through selected cells and creates blobs, trees, and commits using the GitHub Git Database API.
    *   Backdates commits to `12:00:00Z` on the target date.
    *   Updates the branch reference (ref) either incrementally or at the end.
4.  **Streaming:** Uses `ReadableStream` to send progress events (`data: ...`) to the client.

## Building and Running

### Prerequisites

*   Node.js 18+
*   GitHub OAuth App (Client ID and Secret)

### Environment Variables

Create a `.env.local` file:

```env
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_SECRET=any_random_string
```

### Scripts

*   `npm run dev`: Start the development server at `http://localhost:3000`.
*   `npm run build`: Build the application for production.
*   `npm start`: Start the production server.
*   `npm run lint`: Run ESLint.

## Development Conventions

*   **Styling:** Use Tailwind CSS utility classes.
*   **Components:** Functional components with TypeScript interfaces for props.
*   **API:** Use Next.js Route Handlers (`route.ts`) for backend logic.
*   **Type Safety:** Ensure all data structures, especially API requests/responses and Auth sessions, are typed.
