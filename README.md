# Cludz API JavaScript SDK

A clean, modular, and high-performance JavaScript SDK for [Cludz API](https://docs.cludz.net/), built for **Bun**.

## Installation

This SDK is designed to be used directly in your Bun projects.

```bash
bunx jsr add @cludz/sdk
```

## Quick Start

```javascript
import { Cludz } from '@cludz/sdk';

const cludz = new Cludz({
  api: 'https://api.cludz.net/',
  key: 'your_api_key_here'
});

// Download a video
const video = await cludz.downloader.youtube.download('https://youtube.com/watch?v=...');
console.log(video.data.url);
```

## Modules

### Downloader
- `cludz.downloader.youtube.search(query, limit)`
- `cludz.downloader.youtube.searchDownload(query, format)`
- `cludz.downloader.youtube.download(url, format)`
- `cludz.downloader.tiktok.download(url, format)`
- `cludz.downloader.download(platform, url, format)` (Supports: instagram, facebook, pinterest, twitter, soundcloud, twitch)

### Tools
- `cludz.tools.webCheck(url)`
- `cludz.tools.dns(domain)`
- `cludz.tools.ssl(domain)`
- `cludz.tools.meta(url)`
- `cludz.tools.qr(text)`: Returns a Bun Response (Image).
- `cludz.tools.barcode(text, options)`: Returns a Bun Response (Image).

### Image
- `cludz.image.meme(source, topText, bottomText)`: Generate a meme. `source` can be a URL, local path, Buffer, or Blob.
- `cludz.image.compress(source, quality)`: Compress an image (quality 1-100).
- `cludz.image.convert(source, format)`: Convert image format (jpeg, png, webp, avif).
- `cludz.image.crop(source, { left, top, width, height })`: Crop an image.
- *Note: All image methods return a standard `Response` object containing the binary image data.*

### Account
- `cludz.account.me()`: Get current account info.
- `cludz.account.status()`: Get API health/monitoring.

## Error Handling

The SDK throws descriptive errors when a request fails:

```javascript
try {
  await cludz.tools.qr('Hello this is QR code');
} catch (error) {
  console.error('Error:', error.message);
}
```
