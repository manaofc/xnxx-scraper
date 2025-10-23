export const BASE_URL: string;
export const XNXX_PATTERN: RegExp;

export interface VideoInfo {
  url: string;
  dlink: string;
  title: string;
  thumbnail?: string;
  views: number;
  duration: string;
  likes: string;
  rating: string;
}

export interface SearchResult {
  title: string;
  url: string;
}

export function getVideoInfo(url: string): Promise<VideoInfo>;
export function searchVideos(query: string, page?: number): Promise<SearchResult[]>;