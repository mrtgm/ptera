export const PAGINATION_CONFIG = {
	DEFAULT_PAGE_SIZE: 9,
	MAX_PAGES_SHOWN: 5,
};

export const SORT_OPTIONS = [
	{ value: "createdAt", label: "新着順" },
	{ value: "playCount", label: "人気順" },
	{ value: "likeCount", label: "いいね順" },
];

export const DEFAULT_STATES = {
	SORT_BY: "createdAt",
	CATEGORY_ID: "all",
} as const;
