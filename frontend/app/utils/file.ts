export const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileExtension = (filename: string): string => {
	return filename.split(".").pop()?.toLowerCase() || "";
};

export const getAcceptAttributeValue = (
	assetType: "image" | "audio" | "any",
	allowedExtensions?: string[],
): string => {
	if (assetType === "image") return "image/*";
	if (assetType === "audio") return "audio/mp3";

	// 特定の拡張子が指定されている場合
	if (allowedExtensions && allowedExtensions.length > 0) {
		return allowedExtensions.map((ext) => `.${ext}`).join(",");
	}

	return "*/*";
};
