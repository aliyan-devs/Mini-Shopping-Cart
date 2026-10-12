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

Pushing to `main` runs the GitHub Actions workflow in `.github/workflows/deploy.yml`. It builds the site and deploys the generated `dist` directory to GitHub Pages.

The Vite base path is derived from the GitHub repository name, and hash-based routing keeps store pages accessible when opened or refreshed on GitHub Pages.
