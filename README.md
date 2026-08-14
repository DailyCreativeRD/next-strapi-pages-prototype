# next-strapi-pages-prototype

**Orchestration + staging host** for the Strapi publishing pipeline.

Frontend code does **not** live here — it lives in
[`ssg-nextjs-page`](https://github.com/DailyCreativeRD/ssg-nextjs-page).
This repository holds:

- the **staging workflow** (`.github/workflows/deploy-staging.yml`) — checks out
  `ssg-nextjs-page`, builds it twice against published Strapi content (staging
  base path + production base path), verifies both builds used identical content
  (SHA-256 hash diff), deploys the staging GitHub Pages site, and publishes the
  production-ready counterpart as a release (`staging-<run_id>`) with a checksum
  and a `release-manifest.txt` (source_sha / frontend_sha / run_id / content_sha256);
- the repository **secrets** (`STRAPI_API_URL`, `STRAPI_API_TOKEN`) and the
  variable `PRODUCTION_REPOSITORY_NAME`;
- the **staging Pages site**: <https://dailycreativerd.github.io/next-strapi-pages-prototype/>;
- the **candidate releases** that
  [`next-strapi-pages-production`](https://github.com/DailyCreativeRD/next-strapi-pages-production)
  verifies and promotes.

## Operating it

1. Publish content in Strapi.
2. Run **Actions → Build and deploy staging** (or send a `repository_dispatch`
   with event type `publish-stage`).
3. Review the staging site; note the workflow **run ID**.
4. In the production repository, run **Promote approved staging build** with that run ID.

Frontend code changes are made in `ssg-nextjs-page`; they take effect on the
next staging run (its `main` HEAD is checked out at build time and recorded as
`frontend_sha` in the candidate manifest).
