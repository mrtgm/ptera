export class AssetNotFoundError extends Error {
	constructor(id: number) {
		super(`Asset not found: ${id}`);
		this.name = "AssetNotFoundError";
	}
}

export class CharacterNotFoundError extends Error {
	constructor(id: number) {
		super(`Character not found: ${id}`);
		this.name = "CharacterNotFoundError";
	}
}

export class FileUploadError extends Error {
	constructor(message: string) {
		super(`File upload error: ${message}`);
		this.name = "FileUploadError";
	}
}
