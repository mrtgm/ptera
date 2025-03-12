export const formatDate = (timestamp: number | string) => {
	return new Date(timestamp).toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};
