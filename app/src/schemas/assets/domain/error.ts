export class AssetNotFoundError extends Error {
	constructor(publicId: string) {
		super(`Asset not found: ${publicId}`);
		this.name = "AssetNotFoundError";
	}
}

export class CharacterNotFoundError extends Error {
	constructor(publicId: string) {
		super(`Character not found: ${publicId}`);
		this.name = "CharacterNotFoundError";
	}
}

export class FileUploadError extends Error {
	constructor(message: string) {
		super(`File upload error: ${message}`);
		this.name = "FileUploadError";
	}
}
