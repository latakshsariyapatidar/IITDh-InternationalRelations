export const PAGE_KEYS = ["home", "about", "admission"] as const;

export type PageKey = (typeof PAGE_KEYS)[number];
