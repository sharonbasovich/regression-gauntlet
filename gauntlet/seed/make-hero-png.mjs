// Writes an uncompressed (deflate level 0) 1440x900 PNG: a moody gradient with film grain.
// Used by bug 15 to simulate an oversized hero asset (~3.9 MB).
import { writeFileSync } from "node:fs";
import zlib from "node:zlib";

const W = 1440, H = 900;
const raw = Buffer.alloc((W * 3 + 1) * H);
let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0;
  for (let x = 0; x < W; x++) {
    const t = y / H, u = x / W;
    const grain = (rnd() - 0.5) * 28;
    const r = 27 + 40 * t + 10 * Math.sin(u * 6) + grain;
    const g = 42 + 45 * t + grain;
    const b = 65 + 50 * t + 12 * Math.cos(u * 4) + grain;
    const o = y * (W * 3 + 1) + 1 + x * 3;
    raw[o] = Math.max(0, Math.min(255, r | 0));
    raw[o + 1] = Math.max(0, Math.min(255, g | 0));
    raw[o + 2] = Math.max(0, Math.min(255, b | 0));
  }
}
const crcTable = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc = (buf) => { let c = -1; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 0 })),
  chunk("IEND", Buffer.alloc(0)),
]);
writeFileSync(process.argv[2] ?? "hero.png", png);
console.log(`wrote ${process.argv[2]} (${(png.length / 1e6).toFixed(2)} MB)`);
