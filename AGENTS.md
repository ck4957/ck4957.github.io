# Agent Notes

- The canonical portfolio source is this repo: `ck4957/ck4957.github.io`.
- The canonical live URL is `https://ck4957.github.io/`.
- `ck4957/react-portfolio` and `ck4957/portfolio` are redirect-only compatibility repos. Do not add portfolio app code there.
- Preserve old portfolio history on archive branches; do not delete archive branches during routine updates.
- Update portfolio content in `public/portfolio_content.json`. Keep fallback data in `public/portfolio_shared_data.json` aligned when shared profile or skills data changes.
- Skills icons should use Devicon class names from the loaded Devicon library when available. Verify class names before adding new skills.
- Use Iconify only as a fallback for tools that Devicon does not provide, such as current AI coding tool logos.
- Before pushing site changes, run `npm run content:check`, `npm run build`, and `npm test -- --run`.
- GitHub Pages deploys from the Vite build artifact through `.github/workflows/github-pages.yml`.
