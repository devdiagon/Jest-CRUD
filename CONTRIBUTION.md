# Saint Roche Microsystems Contribution Guide

## Commit Messages
- Use Commitizen (git-cz) to create standardized commit messages.
- Remember to keep commit messages clear and concise.
- Run one of the following commands:

```fish
# to add only what u git added
pnpm commit 

# to add all changes
pnpm commit:all

# if installed globally & comfortable with it
git cz
```

## Branch & PR Workflow
- Create a feature branch from `dev`.
- Name branches like: `feat/short-desc`
- Open a Pull Request targeting the `dev` branch when your work is ready.

## Before Opening a PR
- Keep PR descriptions short; mention related ticket/issue and what changed.

Thanks for contributing — small, well-scoped PRs get merged faster.