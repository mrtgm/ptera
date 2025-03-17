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

export class CannotDeletePublicAssetError extends Error {
	constructor(id: number) {
		super(`Cannot delete public asset: ${id}`);
		this.name = "CannotDeletePublicAssetError";
	}
}

export class CannotDeletePublicCharacterError extends Error {
	constructor(id: number) {
		super(`Cannot delete public character: ${id}`);
		this.name = "CannotDeletePublicCharacterError";
	}
}

export class CannotUpdatePublicAssetError extends Error {
	constructor(id: number) {
		super(`Cannot update public asset: ${id}`);
		this.name = "CannotUpdatePublicAssetError";
	}
}

export class StillInUseError extends Error {
	constructor(id: number) {
		super(`Still in use: ${id}`);
		this.name = "StillInUseError";
	}
}
