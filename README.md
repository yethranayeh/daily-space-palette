# Daily Space Palette

<p align="center"><img width="120" height="120" src="public/favicon.svg" /></p>

This is a web app that fetches the Astronomy Picture of the Day from [NASA's APOD page](https://science.nasa.gov/apod/), then generates a color palette from that picture.

With this project, I hope to offer designers and developers an automatically generated color palette that contains colors from the Astronomy Picture of the Day.

## Stack

- Vite 8 + React 19 + React Router 7 + Tailwind CSS 4
- `node-vibrant` in the browser for on-demand palettes
- A daily GitHub Actions build that prerenders the latest 25 dates and their social cards with Satori
- Static hosting on Cloudflare Workers (no Functions, no server runtime)

## Development

```bash
npm install
npm run dev
```

```bash
npm run build      # static build + prerender, calls NASA
npm run preview    # serve dist
npm run lint
npm run typecheck
npm test
```

Deployment steps, including the Cloudflare token and the GitHub secrets, are in [DEPLOY.md](./DEPLOY.md).
