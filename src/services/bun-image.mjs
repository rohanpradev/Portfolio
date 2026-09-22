import sharpService from "astro/assets/services/sharp";

// Limit the native path to portable, still-image codecs. Preserve animation by
// handing animated PNG/WebP and other formats to Astro's existing Sharp service.
function isPortableStill(bytes) {
  const input = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff) return true;
  const png = input
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp =
    input.toString("ascii", 0, 4) === "RIFF" &&
    input.toString("ascii", 8, 12) === "WEBP";
  if (!png && !webp) return false;
  for (let offset = png ? 8 : 12; offset + 8 <= input.length;) {
    const type = input.toString(
      "ascii",
      offset + (png ? 4 : 0),
      offset + (png ? 8 : 4),
    );
    if (type === "acTL" || type === "ANIM") return false;
    const size = png
      ? input.readUInt32BE(offset)
      : input.readUInt32LE(offset + 4);
    offset += png ? size + 12 : size + 8 + (size % 2);
  }
  return true;
}

const qualityPresets = { low: 25, mid: 50, high: 80, max: 100 };

/** @type {import('astro').LocalImageService} */
const service = {
  ...sharpService,
  async transform(input, options, config, logger) {
    const native = globalThis.Bun?.Image;
    const format = options.format === "jpg" ? "jpeg" : options.format;
    const bothDimensions = options.width && options.height;
    const fit = {
      contain: "inside",
      "scale-down": "inside",
      inside: "inside",
      fill: "fill",
    }[options.fit];

    // Bun currently has no cover crop/position/background API. Keep those
    // semantics, custom Sharp settings, SVG policy, and Node usage intact.
    if (
      !native ||
      !["jpeg", "png", "webp"].includes(format) ||
      !isPortableStill(input) ||
      (bothDimensions && !fit) ||
      (!options.width && options.height) ||
      options.position ||
      options.background ||
      Object.keys(config.service.config ?? {}).length
    ) {
      return sharpService.transform(input, options, config, logger);
    }

    let pipeline = new native(input, { autoOrient: true });
    if (options.width) {
      pipeline = pipeline.resize(
        Math.round(options.width),
        options.height ? Math.round(options.height) : undefined,
        {
          fit: fit ?? "inside",
          withoutEnlargement: true,
        },
      );
    }
    const parsed = Number.parseInt(options.quality);
    const quality = Number.isNaN(parsed)
      ? (qualityPresets[options.quality] ?? 80)
      : parsed;
    pipeline =
      format === "png" ? pipeline.png() : pipeline[format]({ quality });
    const data = await pipeline.bytes();
    return { data, format };
  },
};

export default service;
