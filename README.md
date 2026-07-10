# [Chirag Kular - Portfolio](https://ck4957.github.io/react-portfolio)

## Content Updates

Most portfolio copy now lives in one file:

    public/portfolio_content.json

Use that file for personal details, titles, AI positioning, skills, projects, and experience. The older JSON files are still present as a fallback, but the app reads the unified content file first.

Validate content before publishing:

    npm run content:check

## Resume Updates

Add a new resume version from the file system:

    npm run resume:add -- /path/to/Chirag-Kular-Resume.pdf

The script copies the file into `public/resumes/`, prepends it to `public/resumes/manifest.json`, keeps older versions, and points the site to the latest resume automatically.
When a current resume exists in the manifest, the navbar shows a direct Resume link that opens the latest file.

## Deployment Steps:

    npm run predeploy
    npm run deploy    
