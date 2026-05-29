# GITHUB WORKFLOW

## Core policy
- GitHub is the central source of truth.
- Do not rely on local machine state.
- Work from office/home/VPS by cloning or pulling from GitHub.
- Always commit and push completed changes.
- Never commit `.env`, logs, or SQLite runtime DB files unless intentionally designed for versioning.
- Use branches for risky changes.
- `main` should stay deployable.

## Recommended daily workflow
```bash
git pull origin main
npm install
npm run check:env
npm run test
npm run build
```

## After making changes
```bash
git status
git add .
git commit -m "clear message"
git push origin main
```
