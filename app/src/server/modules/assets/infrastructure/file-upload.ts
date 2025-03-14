import { FileUploadError } from "../../../../schemas/assets/domain/error";

export class FileUploadService {
	// ファイルをアップロードしてURLを返す
	async uploadFile(file: File, type: string): Promise<string> {
		try {
			// const s3 = new AWS.S3();
			// const uploadResult = await s3.upload({
			//   Bucket: process.env.S3_BUCKET_NAME,
			//   Key: `${type}/${Date.now()}-${file.name}`,
			//   Body: await file.arrayBuffer(),
			//   ContentType: file.type,
			// }).promise();
			// return uploadResult.Location;

			const fileName = encodeURIComponent(file.name);
			const timestamp = Date.now();
			return `https://example.com/uploads/${type}/${timestamp}-${fileName}`;
		} catch (error) {
			console.error("File upload error:", error);
			throw new FileUploadError(
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	// ファイルを削除する
	async deleteFile(url: string): Promise<boolean> {
		try {
			// const s3 = new AWS.S3();
			// const urlParts = new URL(url);
			// const key = urlParts.pathname.substring(1); // 先頭の '/' を削除
			// await s3.deleteObject({
			//   Bucket: process.env.S3_BUCKET_NAME,
			//   Key: key,
			// }).promise();

			return true;
		} catch (error) {
			console.error("File deletion error:", error);
			return false;
		}
	}
}
