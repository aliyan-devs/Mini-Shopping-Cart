# Mini Shopping Cart

A React storefront built with Vite.

## Run locally

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Pushing to `main` then runs the workflow in `.github/workflows/deploy.yml`, which builds the site and deploys the generated `dist` directory.

The Vite base path is derived from the GitHub repository name, and hash-based routing keeps store pages accessible when opened or refreshed on GitHub Pages.
