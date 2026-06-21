# Contributing to Contribu-Art

Thank you for contributing to Contribu-Art. This guide describes the commit conventions, development setup, and pull request process for the project.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification to maintain a clean and readable commit history.

### Commit Message Format

Each commit message consists of a **header**, an optional **body**, and an optional **footer**:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                               |
| ---------- | --------------------------------------------------------- |
| `feat`     | A new feature                                             |
| `fix`      | A bug fix                                                 |
| `docs`     | Documentation only changes                                |
| `style`    | Changes that don't affect code meaning (formatting, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature   |
| `perf`     | A code change that improves performance                   |
| `test`     | Adding missing tests or correcting existing tests         |
| `build`    | Changes that affect the build system or dependencies      |
| `ci`       | Changes to CI configuration files and scripts             |
| `chore`    | Other changes that don't modify src or test files         |
| `revert`   | Reverts a previous commit                                 |

### Examples

#### Good Commit Messages

```
feat(graph): add color picker for contribution cells

fix(auth): resolve GitHub OAuth token refresh issue

docs: update README with installation instructions

style(components): format Dashboard component with Prettier

refactor(api): simplify contribution fetching logic

perf(graph): optimize rendering of large contribution grids

test(utils): add unit tests for date helpers

build: upgrade Next.js to version 15

ci: add GitHub Actions workflow for testing

chore: update .gitignore to exclude build artifacts
```

#### With Body and Footer

```
feat(graph): add multi-color painting mode

Users can now select multiple colors and paint with gradients.
This feature includes a new color palette component.

Closes #42
```

#### Breaking Changes

```
feat(api)!: change contribution endpoint response format

BREAKING CHANGE: The API now returns contributions as an array
instead of an object. Update your client code accordingly.
```

### Scope (Optional)

The scope provides additional context about what part of the codebase is affected:

- `graph` - Contribution graph component
- `auth` - Authentication related
- `api` - API routes and handlers
- `components` - UI components
- `utils` - Utility functions
- `config` - Configuration files

### Rules

1. **Use lowercase** for the type and scope
2. **Use imperative mood** in the description ("add" not "added" or "adds")
3. **Don't end** the description with a period
4. **Keep the header** under 100 characters
5. **Separate** the body from the header with a blank line
6. **Body line length** is not enforced (no maximum limit)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Make your changes
5. Commit using conventional commits
6. Push to your fork and submit a pull request

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Run tests
pnpm test
```

## Code Quality Tools

This project uses **ESLint** and **Prettier** to ensure consistent code style across the codebase. These run automatically on commit via [Git hooks](#git-hooks-husky), but you can also run them manually.

### ESLint

ESLint is configured with Next.js recommended rules and Prettier integration to catch common issues and enforce best practices.

```bash
# Check for linting errors
pnpm run lint

# Automatically fix linting errors
pnpm run lint:fix
```

### Prettier

Prettier is used for consistent code formatting. The project includes `prettier-plugin-tailwindcss` for automatic Tailwind CSS class sorting.

```bash
# Format all files
pnpm run format

# Check formatting without making changes
pnpm run format:check
```

### TypeScript

TypeScript type checking is separate from ESLint. Use the following command to check for type errors:

```bash
# Check for type errors
pnpm run type-check
```

### Commitlint

Commit messages are validated using Commitlint to ensure they follow the [Conventional Commits](#commit-message-guidelines) format. If your commit message doesn't follow the guidelines, the commit will be rejected.

You can use the interactive commit prompt to help write valid commit messages:

```bash
pnpm run commit
```

### Git Hooks (Husky)

[Husky](https://typicode.github.io/husky/) enforces these checks automatically — no manual step required. The hooks install on `pnpm install` via the `prepare` script.

- **`pre-commit`** — runs `lint-staged` on staged files (`eslint --fix` then `prettier --write`), followed by `pnpm run type-check` across the project. Auto-fixes are re-staged; the commit aborts if linting or type checks fail.
- **`commit-msg`** — validates the message with Commitlint. A message that doesn't follow [Conventional Commits](#commit-message-guidelines) aborts the commit.

Hooks run only what's relevant: `lint-staged` touches staged files, while `type-check` covers the whole project. Bypassing hooks (`--no-verify`) is discouraged — CI enforces the same checks.

### Before Submitting a Pull Request

Ensure the following before submitting your pull request:

1. Run `pnpm run format` to format your code.
2. Run `pnpm run lint:fix` to resolve linting issues.
3. Confirm `pnpm run lint` passes without errors.
4. Confirm `pnpm run format:check` passes without errors.
5. Confirm `pnpm run type-check` passes without errors.

## Pull Request Process

1. Ensure your code follows the project's coding style
2. Update documentation if needed
3. Add tests for new features
4. Make sure all tests pass
5. Use a descriptive PR title following conventional commits format

## Questions

If you have questions or need clarification, please open an issue.
