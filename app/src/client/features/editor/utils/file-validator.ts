import { formatFileSize } from "@/client/utils/file";

export interface ValidationOptions {
	maxFileSize?: number; // バイト単位でのファイルサイズ上限
	allowedExtensions?: string[]; // 許可される拡張子リスト
	maxFiles?: number; // 最大ファイル数
	assetType?: "image" | "audio" | "any"; // アセットタイプ制限
}

export interface ValidationResult {
	validFiles: File[];
	error: string | null;
}

export const validateFiles = (
	files: FileList | File[],
	options: ValidationOptions = {},
): ValidationResult => {
	const { maxFileSize, allowedExtensions, maxFiles, assetType } = options;

	const fileArray = Array.from(files);
	let error: string | null = null;

	if (maxFiles && fileArray.length > maxFiles) {
		return {
			validFiles: [],
			error: `ファイル数が最大値（${maxFiles}個）を超えています`,
		};
	}

	const filteredFiles = fileArray.filter((file) => {
		if (assetType === "image" && !file.type.startsWith("image/")) {
			return false;
		}
		if (assetType === "audio" && !file.type.startsWith("audio/")) {
			return false;
		}

		if (maxFileSize && file.size > maxFileSize) {
			error = `ファイルサイズが上限（${formatFileSize(maxFileSize)}）を超えています: ${file.name}`;
			return false;
		}

		// 拡張子チェック
		if (allowedExtensions && allowedExtensions.length > 0) {
			const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
			if (!allowedExtensions.includes(fileExt)) {
				error = `サポートされていないファイル形式です: ${file.name}. 許可される形式: ${allowedExtensions.join(", ")}`;
				return false;
			}
		}

		return true;
	});

	if (filteredFiles.length !== fileArray.length && !error) {
		error = "一部のファイルが無効なため除外されました";
	}

	return { validFiles: filteredFiles, error };
};
