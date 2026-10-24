import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, join, extname } from "node:path";
import assert from "node:assert/strict";

const root = resolve("dist");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : join(directory, entry.name),
      ),
    )
  ).flat();
}
const files = await walk(root);
const pages = files.filter((file) => extname(file) === ".html");
const home = await readFile(join(root, "index.html"), "utf8");
const homeCanonical = home.match(
  /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/,
);
assert(homeCanonical, "Home canonical URL missing");
const homeUrl = new URL(homeCanonical[1]);
const base = homeUrl.pathname.replace(/\/$/, "");
const errors = [];
let checkedLinks = 0;
const pageContents = new Map(
  await Promise.all(
    pages.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);
for (const [file, html] of pageContents) {
  const label = relative(root, file);
  const fail = (message) => errors.push(`${label}: ${message}`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1)
    fail("Expected exactly one h1");
  if (!/<title>[^<]+<\/title>/.test(html)) fail("Missing page title");
  if (!/<meta[^>]*name="description"[^>]*content="[^"]+"/.test(html))
    fail("Missing description");
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(image[0])) fail("Image missing alt text");
    if (!/\bwidth=/.test(image[0]) || !/\bheight=/.test(image[0]))
      fail("Image missing intrinsic dimensions");
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) fail("Duplicate HTML id");
  for (const json of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(json[1]);
    } catch {
      fail("Invalid JSON-LD");
    }
  }
  const localPath = label.replaceAll("\\", "/").replace(/index\.html$/, "");
  const pageUrl = new URL(`${base}/${localPath}`, homeUrl.origin);
  for (const match of html.matchAll(
    /<(?:a|img|script|link|source)\b[^>]*?\b(?:href|src)="([^"]+)"/g,
  )) {
    const href = match[1].replaceAll("&amp;", "&");
    if (
      /^(?:mailto:|tel:|data:|https?:\/\/)/.test(href) &&
      !href.startsWith(homeUrl.origin)
    )
      continue;
    const url = new URL(href, pageUrl);
    if (url.origin !== homeUrl.origin) continue;
    if (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`)) {
      fail(`Link escapes deployment base: ${href}`);
      continue;
    }
    let target = resolve(
      root,
      `.${decodeURIComponent(url.pathname.slice(base.length) || "/")}`,
    );
    if (relative(root, target).startsWith("..")) {
      fail(`Link escapes output: ${href}`);
      continue;
    }
    try {
      if ((await stat(target)).isDirectory())
        target = join(target, "index.html");
      await stat(target);
    } catch {
      fail(`Missing link or asset: ${href}`);
      continue;
    }
    checkedLinks++;
    if (url.hash && extname(target) === ".html") {
      const targetHtml =
        pageContents.get(target) ?? (await readFile(target, "utf8"));
      const id = decodeURIComponent(url.hash.slice(1));
      if (!targetHtml.includes(`id="${id}"`)) fail(`Missing anchor: ${href}`);
    }
  }
}
const sitemap = await readFile(join(root, "sitemap-0.xml"), "utf8");
assert(
  sitemap.includes("reagent-optimization-agent"),
  "AI project missing from sitemap",
);
const aiPage = pageContents.get(
  join(root, "projects", "reagent-optimization-agent", "index.html"),
);
for (const term of [
  "Optum",
  "Strands",
  "AgentCore Runtime",
  "AgentCore Memory",
  "AWS Batch",
  "Amazon S3",
]) {
  assert(aiPage?.includes(term), `AI case study missing ${term}`);
}
assert.equal(errors.length, 0, errors.join("\n"));
console.log(
  `Verified ${pages.length} pages and ${checkedLinks} local links/assets: headings, metadata, image dimensions, JSON-LD, anchors, and ${base || "/"} deployment paths.`,
);
