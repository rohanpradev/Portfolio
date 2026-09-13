import { afterEach, expect, spyOn, test } from "bun:test";
import { spawnSync } from "node:child_process";
import sharpService from "astro/assets/services/sharp";
import service from "../src/services/bun-image.mjs";

const config = { service: { config: {} } };
const logger = { info() {}, warn() {}, error() {} };
const source = await Bun.file(
  new URL("../src/assets/projects/reagent-architecture.png", import.meta.url),
).bytes();
let fallback;
afterEach(() => fallback?.mockRestore());

for (const format of ["webp", "jpeg", "png"]) {
  test(`native ${format} output preserves aspect ratio and has valid dimensions`, async () => {
    fallback = spyOn(sharpService, "transform");
    const result = await service.transform(
      source,
      {
        src: "architecture.png",
        width: 400,
        height: 400,
        fit: "contain",
        format,
        quality: "high",
      },
      config,
      logger,
    );
    const original = await new Bun.Image(source).metadata();
    const output = await new Bun.Image(result.data).metadata();
    expect(result.format).toBe(format);
    expect(output.format).toBe(format);
    expect(output.width).toBe(400);
    expect(output.height).toBe(
      Math.round((400 * original.height) / original.width),
    );
    expect(fallback).not.toHaveBeenCalled();
  });
}

test("native WebP input resizes without enlargement", async () => {
  const bytes = await new Bun.Image(source).resize(100).webp().bytes();
  const result = await service.transform(
    bytes,
    {
      src: "small.webp",
      width: 500,
      format: "webp",
    },
    config,
    logger,
  );
  expect((await new Bun.Image(result.data).metadata()).width).toBe(100);
});

test("cover cropping keeps Astro's Sharp behavior", async () => {
  fallback = spyOn(sharpService, "transform");
  const result = await service.transform(
    source,
    {
      src: "architecture.png",
      width: 80,
      height: 80,
      fit: "cover",
      format: "webp",
    },
    config,
    logger,
  );
  const metadata = await new Bun.Image(result.data).metadata();
  expect([metadata.width, metadata.height]).toEqual([80, 80]);
  expect(fallback).toHaveBeenCalledTimes(1);
});

test("SVG passthrough retains Astro's source policy", async () => {
  const svg = new TextEncoder().encode(
    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
  );
  const result = await service.transform(
    svg,
    { src: "icon.svg", format: "svg" },
    config,
    logger,
  );
  expect(result.format).toBe("svg");
  expect(result.data).toEqual(svg);
});

test("AVIF output and advanced settings use Sharp", async () => {
  fallback = spyOn(sharpService, "transform").mockResolvedValue({
    data: source,
    format: "avif",
  });
  await service.transform(
    source,
    { src: "image.png", format: "avif" },
    config,
    logger,
  );
  await service.transform(
    source,
    { src: "image.png", format: "webp" },
    { service: { config: { webp: { lossless: true } } } },
    logger,
  );
  expect(fallback).toHaveBeenCalledTimes(2);
});

test("animation containers bypass Bun so frames are not flattened", async () => {
  fallback = spyOn(sharpService, "transform").mockResolvedValue({
    data: source,
    format: "webp",
  });
  // Minimal container headers test routing; decoding remains Sharp's responsibility.
  const webp = Buffer.concat([
    Buffer.from("RIFF"),
    Buffer.alloc(4),
    Buffer.from("WEBPANIM"),
    Buffer.alloc(4),
  ]);
  const png = Buffer.concat([
    source.subarray(0, 8),
    Buffer.alloc(4),
    Buffer.from("acTL"),
    Buffer.alloc(4),
  ]);
  for (const bytes of [webp, png]) {
    await service.transform(
      bytes,
      { src: "animation", format: "webp" },
      config,
      logger,
    );
  }
  expect(fallback).toHaveBeenCalledTimes(2);
});

test("Node can still build and optimize with the same service", () => {
  const script = `
    import service from './src/services/bun-image.mjs';
    import { readFile } from 'node:fs/promises';
    const input = await readFile('src/assets/projects/reagent-architecture.png');
    const result = await service.transform(input, {src:'image.png',width:100,format:'webp'}, {service:{config:{}}}, console);
    if (result.format !== 'webp' || result.data.length === 0) process.exit(1);
  `;
  const result = spawnSync("node", ["--input-type=module", "-e", script], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  expect(result.stderr).toBe("");
  expect(result.status).toBe(0);
});
