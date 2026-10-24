# M Rohan Pradev — Portfolio

An Astro-native engineering portfolio with an editorial layout, warm ivory and cobalt palette, light/dark themes, responsive project previews, and a keyboard-accessible agent workflow walkthrough.

## Develop and verify

Use Node 24.22.1 (`.node-version`) and Bun 1.4.4. This project requires Node 22.23.4 or newer, matching Astro 7.4.2.

```sh
bun ci
bun run dev
bun run format
bun run ci
bun run preview
```

`bun run ci` checks formatting, runs the image-service integration tests, Astro diagnostics and Bun's native type checker, builds the site, and runs `scripts/verify-build.mjs`. The verifier checks every generated HTML page for headings, descriptions, image dimensions and alt attributes, duplicate IDs, valid JSON-LD, internal links, assets, anchor targets, deployment base paths, and the AI case study. `bun audit` checks dependencies against the advisory database.

The pull-request workflow checks the site at both `/` and `/portfolio` to catch domain-root and GitHub Pages subpath regressions; it can also be run manually. Both workflows use frozen installs, pinned action versions, Node from `.node-version`, and Bun from `package.json`. Dependency installation sets `BUN_CONFIG_HTTP_RETRY_BACKOFF=250` to give Bun 1.4.4's exponential retries more time to recover from transient registry failures. Build jobs time out after 15 minutes. Deployment is restricted to `main`, has a 10-minute timeout, and scopes publishing permissions to the deploy job.

`bun run format` uses Bun 1.4.4's built-in formatter; `bun run format:check` checks without writing and is the first step in CI. Bun formats supported files natively and delegates `.astro` files to the installed Prettier 3.9.10 and `prettier-plugin-astro` 1.1.2 through `.prettierrc.json`. The configuration uses LF line endings across Windows and Linux. `bun fmt --doctor` shows which files use the fallback.

`bun run check` runs `astro check` for Astro components and generated types, then `bun --check` for the TypeScript project. The explicit flag invokes Bun's native checker even though a package script is also named `check`. TypeScript 6.0.3 remains installed because `@astrojs/check` 0.9.12 supports TypeScript 5 and 6 and needs its programmatic API; Bun's checker does not replace Astro component diagnostics.

References: [Bun 1.4.4 release notes](https://bun.com/blog/bun-v1.4.4), [Bun formatter and Astro fallback](https://bun.com/docs/format).

## Content and design

- `src/content/projects/`: validated content collections for the Optum reagent optimization agent and the manufacturing/workplace platform.
- `src/data/experiences.ts`: career history, including Optum's Strands implementation with AgentCore Runtime and Memory, AWS Batch, and S3.
- `src/data/skills.ts`: skills shared by the about page.
- `src/styles/globals.css`: central color, typography, spacing, and motion tokens. Component-specific layouts live with their components.
- `src/components/AgentWorkflow.astro`: client-side architecture walkthrough; it illustrates the work and never invokes AWS services.
- `src/components/CopyEmail.astro`: clipboard action with live feedback and an email-link fallback.
- `src/assets/projects/reagent-architecture.svg`: editable source of the architecture illustration; the adjacent PNG is its raster export for Astro image optimization.

The site uses static HTML, Astro content loaders, optimized responsive images, a locally hosted font, small bundled scripts, and native cross-document view transitions where supported. It has no client framework. Content remains readable without animation or JavaScript; reduced-motion settings disable entrance and transition effects. The AWS walkthrough plays only when requested.

The contact flow uses direct email. A server-side Astro Action would require a server adapter and would not run on GitHub Pages.

## Build-time image optimization

The build runs Astro with Bun's runtime (`bun --bun astro build`) so `src/services/bun-image.mjs` can use native `Bun.Image`. Astro still owns responsive `srcset`, image URLs, dimensions, and its build cache. Still JPEG, PNG, and WebP inputs use Bun for portable JPEG/PNG/WebP output and supported resizing.

The service extends Astro's built-in Sharp service. Sharp handles cover cropping, positioning, backgrounds, animation, SVG policy, AVIF and other formats, custom encoder settings, and development when Astro runs under Node. AVIF in Bun depends on OS codecs and is unavailable on Linux, so it is deliberately routed to Sharp. Sharp remains installed as Astro's dependency.

`bun run test:images` checks actual image encoding and dimensions, aspect ratio, no upscaling, crop fallback, SVG passthrough, animation routing, advanced options, and Node compatibility. This integration uses Bun's native API without adding an image package; it does not claim a measured speed advantage over Sharp. Public brand icons and social artwork are prebuilt assets; content images pass through Astro's service.

References: [Bun.Image API and platform support](https://bun.com/docs/runtime/image), [Astro Image Service API](https://docs.astro.build/en/reference/image-service-reference/).

## Deployment configuration

Set these in repository Settings → Secrets and variables → Actions → Variables, or use `.env` locally:

| Variable            | Purpose                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`   | Public origin, such as `https://rohanpradev.github.io` or a custom domain.                                                         |
| `PUBLIC_BASE_PATH`  | `/portfolio` for a repository site; `/` explicitly forces the domain root. When unset in Actions, the repository name is inferred. |
| `PUBLIC_RESUME_URL` | Optional real PDF URL. Leave unset to offer a résumé request instead of a broken download.                                         |

For a custom domain, add `public/CNAME`, set `PUBLIC_SITE_URL` to that origin, and set `PUBLIC_BASE_PATH=/`. Set the repository's Pages source to **GitHub Actions**.

To test repository deployment locally in PowerShell:

```powershell
$env:PUBLIC_BASE_PATH = '/portfolio'
bun run ci
Remove-Item Env:PUBLIC_BASE_PATH
```

Rebuild without that variable before previewing at the root.

## Version review

Package and runtime selections reviewed October 24, 2026:

| Package/tool            | Selected | Notes                                                  |
| ----------------------- | -------- | ------------------------------------------------------ |
| Astro                   | 7.4.2    | Updated framework release; Node minimum is 22.23.4.    |
| `@astrojs/sitemap`      | 3.7.4    | Sitemap integration.                                   |
| Tailwind / Vite plugin  | 4.3.3    | Matching CSS framework and build plugin.               |
| `@astrojs/check`        | 0.9.12   | Declares TypeScript 5 or 6 support.                    |
| TypeScript              | 6.0.3    | Retained for Astro checker compatibility.              |
| Geist Variable          | 5.3.0    | Locally hosted variable font.                          |
| Prettier                | 3.9.10   | Fallback formatter for Astro components.               |
| `prettier-plugin-astro` | 1.1.2    | Provides Astro parsing and formatting.                 |
| Bun                     | 1.4.4    | Pinned in `package.json` for local development and CI. |
| Node                    | 24.22.1  | Pinned in `.node-version` for CI.                      |

Run `bun audit` to check the installed dependency graph against the current advisory database.

References: [Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/), [Astro images](https://docs.astro.build/en/guides/images/), [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/), [AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html), [AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-get-started.html).

Design references: [Linear](https://linear.app/) for product presentation and [Paco Coursey](https://paco.me/) for restrained personal-site hierarchy. The portfolio's typography, layout, artwork, and interactions were built specifically for this project.
