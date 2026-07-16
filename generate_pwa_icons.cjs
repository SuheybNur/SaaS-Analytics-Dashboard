const fs = require('fs');
const zlib = require('zlib');

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c ^= byte;
    for (let i = 0; i < 8; i++) {
      c = (c & 1) ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), 0);
  return Buffer.concat([length, Buffer.from(type), data, crc]);
}

function makePng(path, size) {
  const width = size;
  const height = size;
  const borderColor = [255, 255, 255, 255];
  const fillColor = [37, 99, 235, 255];
  const rowData = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const isBorder = x < 8 || y < 8 || x >= width - 8 || y >= height - 8;
      const color = isBorder ? borderColor : fillColor;
      row.push(...color);
    }
    rowData.push(Buffer.from(row));
  }

  const imageData = Buffer.concat(rowData);
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', Buffer.concat([
      Buffer.from([0, 0, 0, 0]),
      Buffer.from([0, 0, 0, 0]),
      Buffer.from([8, 6, 0, 0, 0]),
    ])),
    chunk('IDAT', zlib.deflateSync(imageData)),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  fs.writeFileSync(path, png);
}

makePng('public/pwa-192x192.png', 192);
makePng('public/pwa-512x512.png', 512);
console.log('Created public/pwa-192x192.png and public/pwa-512x512.png');
