# XNXX-SCRAPER

A simple Node.js library to search and extract video information from [xnxx.com](https://www.xnxx.com).

> **Disclaimer:** This library is for educational and personal use only. The author is not responsible for misuse.

## 📦 Installation

```bash
npm install xnxx-scraper
```

## 🚀 Usage

```js
const { getVideoInfo, searchVideos } = require("xnxx-scraper");

// Get video info
getVideoInfo("https://www.xnxx.com/video-abc123").then(console.log);

// Search videos
searchVideos("mia khalifa").then(console.log);
```

### Example Output

```js
{
  url: '',
  dlink: '',
  title: '',
  thumbnail: '',
  views: ,
  duration: '',
  likes: '',
  rating: ''
}
```

## 📚 API

### `search(query: string, page?: number): Promise<{ title: string, url: string }[]>`

- **query** — Video search term.
- **page** _(optional, default 0)_ — Page number for search results.
- **returns** — Array of objects containing:
  - `title` — Video title.
  - `url` — Video page URL.

### `getInfo(url: string): Promise<VideoInfo>`

- **url** — Video page URL.
- **returns** — Object containing:

  - `url` _(string)_ — Video page URL.
  - `dlink` _(string | undefined)_ — Direct video link if available.
  - `title` _(string)_ — Video title.
  - `thumbnail` _(string | undefined)_ — Thumbnail URL.
  - `views` _(number)_ — Number of views.
  - `duration` _(string)_ — Video duration in HH\:MM\:SS.
  - `likes` _(string | undefined)_ — Number of likes.
  - `rating` _(string | undefined)_ — Video rating or score.