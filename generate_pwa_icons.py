import struct
import zlib
from pathlib import Path


def chunk(chunk_type: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + chunk_type
        + data
        + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xFFFFFFFF)
    )


def make_png(path: str, size: int) -> None:
    width = height = size
    color = (37, 99, 235, 255)
    border = (255, 255, 255, 255)

    raw = bytearray()
    for y in range(height):
        raw.append(0)
        for x in range(width):
            is_border = x < 8 or y < 8 or x >= width - 8 or y >= height - 8
            pixel = border if is_border else color
            raw.extend(pixel)

    compressed = zlib.compress(raw)
    png = bytearray(b"\x89PNG\r\n\x1a\n")
    png.extend(chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)))
    png.extend(chunk(b"IDAT", compressed))
    png.extend(chunk(b"IEND", b""))
    Path(path).write_bytes(png)


make_png("public/pwa-192x192.png", 192)
make_png("public/pwa-512x512.png", 512)
print("Generated public/pwa-192x192.png and public/pwa-512x512.png")
