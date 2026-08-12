# Next.js + Strapi GitHub Pages Prototype

This repository verifies the first half of the publishing workflow:

1. Fetch published content from Strapi during a static build.
2. Run tests and type checking.
3. Build and deploy a staging GitHub Pages site.
4. Preserve a production-ready artifact generated during the same staging run.

## Local setup

Copy `.env.example` to `.env.local`, add a read-only Strapi token, then run:

```powershell
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

Never commit `.env.local` or an API token.

## GitHub repository settings

Configure these repository secrets:

- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`

Configure this repository variable:

- `PRODUCTION_REPOSITORY_NAME`

Under **Settings -> Pages**, choose **GitHub Actions** as the publishing source.

Run **Build and deploy staging** manually from the Actions tab. Record its run ID; the production repository uses that ID to promote `production-site-<run-id>`.
