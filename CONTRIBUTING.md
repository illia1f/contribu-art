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

## Code Quality

Husky runs these automatically on commit (see [Git Hooks](#git-hooks-husky)); run them manually anytime:

| Command                      | What it does                                   |
| ---------------------------- | ---------------------------------------------- |
| `pnpm run lint` / `lint:fix` | ESLint with Next.js rules (check / auto-fix)   |
| `pnpm run format`            | Prettier formatting (+ Tailwind class sorting) |
| `pnpm run type-check`        | TypeScript check (`tsc --noEmit`)              |
| `pnpm run commit`            | Interactive prompt for a valid commit message  |

### Git Hooks (Husky)

[Husky](https://typicode.github.io/husky/) installs the hooks on `pnpm install` (via the `prepare` script) and enforces them automatically:

- **`pre-commit`** — `lint-staged` on staged files (`eslint --fix` + `prettier --write`), then `pnpm run type-check`. The commit aborts if either fails.
- **`commit-msg`** — validates the message with Commitlint ([Conventional Commits](#commit-message-guidelines)).

CI re-runs the same checks, so avoid `--no-verify`.

## Pull Request Process

1. Ensure your code follows the project's coding style
2. Update documentation if needed
3. Add tests for new features
4. Make sure all tests pass
5. Use a descriptive PR title following conventional commits format

## Questions

If you have questions or need clarification, please open an issue.
