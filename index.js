const he = require("he");
const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://www.xnxx.com";

const XNXX_PATTERN = /^https?:\/\/(www\.)?xnxx\.[a-z]{2,}(\/.*)?$/i;

const selectors = {
  COMMENTS: '.tab-buttons a[title="Comentarios"] .value',
  JSON_LD: 'head script[type="application/ld+json"]',
  LIKES: "#video-votes .vote-action-good .value",
  RATING: "#video-votes .rating-box.value",
};

const headers = {
  Accept: "*/*",
  Referer: BASE_URL,
  "Cache-Control": "max-age=0",
  "upgrade-insecure-requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
};

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const isoToTime = (duration) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex) || [];
  const hours = Number(matches[1] || 0);
  const minutes = Number(matches[2] || 0);
  const seconds = Number(matches[3] || 0);
  const pad = (v) => String(v).padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Get video info by URL
 * @param {string} url XNXX video URL
 * @returns {Promise<object>}
 */
async function getVideoInfo(url) {
  if (!url || typeof url !== "string") {
    throw new TypeError("A valid URL string must be provided.");
  }
  if (!XNXX_PATTERN.test(url)) {
    throw new TypeError("The provided URL does not match a valid XNXX video.");
  }

  const { data: content } = await axios.get(url, { headers });

  const $ = cheerio.load(content);
  const rating = $(selectors.RATING).text();
  const likes = $(selectors.LIKES).text();
  const data = parseJson($(selectors.JSON_LD).first().text());

  return {
    url,
    dlink: data.contentUrl,
    title: he.decode(data.name || ""),
    thumbnail: data.thumbnailUrl?.[0],
    views: data.interactionStatistic?.userInteractionCount || 0,
    duration: isoToTime(data.duration),
    likes,
    rating,
  };
}

/**
 * Search videos by query
 * @param {string} query Search keyword
 * @param {number} page Page number (default 0)
 * @returns {Promise<Array<{title: string, url: string}>>}
 */
async function searchVideos(query, page = 0) {
  if (!query || typeof query !== "string") {
    throw new TypeError("'query' is missing or not a string");
  }
  const url = `${BASE_URL}/search/${encodeURIComponent(query)}/${page}`;
  const { data } = await axios.get(url, { headers });
  const $ = cheerio.load(data);
  const allLinks = $(".thumb-inside .thumb a").toArray();
  if (!allLinks.length) return [];

  return allLinks.map((el) => {
    const item = $(el);
    const title = item.closest(".thumb-block").find(".thumb-under a[title]");
    return {
      title: title.attr("title"),
      url: `${BASE_URL}${item.attr("href")}`,
    };
  });
}

module.exports = {
  BASE_URL,
  XNXX_PATTERN,
  getVideoInfo,
  searchVideos,
};