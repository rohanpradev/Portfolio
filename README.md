# M Rohan Pradev Portfolio

Astro 7 portfolio site for M Rohan Pradev, tuned for static deployment on GitHub Pages.

## Stack

- Astro 7
- Tailwind CSS 4
- Astro image optimization
- GitHub Pages via GitHub Actions

## Local development

```bash
bun install
bun run dev
```

Useful commands:

- `bun run check`
- `bun run build`
- `bun run preview`

## Environment variables

Copy `.env.example` to `.env` for local testing.

- `PUBLIC_SITE_URL`: production site URL, for example `https://yourusername.github.io`
- `PUBLIC_BASE_PATH`: repository base path, for example `/portfolio`. Leave empty for `yourusername.github.io` repos or custom domains.
- `PUBLIC_RESUME_URL`: optional public URL for a downloadable resume, such as `/resume.pdf`

If `PUBLIC_RESUME_URL` is not set, the resume page falls back to a request-based CTA instead of a broken download link.

## GitHub Pages deployment

This project is configured to use the official Astro GitHub Action from the Astro deployment guide:

- workflow file: `.github/workflows/deploy.yml`
- deployment target: GitHub Pages
- site output: static `dist/`

### Repository setup

1. In GitHub, open your repository settings.
2. In `Settings -> Pages`, set `Source` to `GitHub Actions`.
3. In `Settings -> Secrets and variables -> Actions`, add these repository variables:
   - `PUBLIC_SITE_URL`
   - `PUBLIC_BASE_PATH`
   - `PUBLIC_RESUME_URL` if you want a public resume link

### How `PUBLIC_BASE_PATH` should be set

- Repository named `yourusername.github.io`: leave `PUBLIC_BASE_PATH` empty
- Repository named something else, such as `portfolio`: set `PUBLIC_BASE_PATH=/portfolio`
- Custom domain: leave `PUBLIC_BASE_PATH` empty after the custom domain is live

### Custom domain

If you later move from the default GitHub Pages URL to a custom domain:

1. Add `public/CNAME` with your domain on a single line
2. Update `PUBLIC_SITE_URL` to the custom domain
3. Clear `PUBLIC_BASE_PATH`

## Notes

- The contact page is static so the site remains compatible with GitHub Pages.
- All internal links and metadata are base-aware, so repository-path deployments work correctly.
