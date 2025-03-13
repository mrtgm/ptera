export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class GameNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Game with publicId ${publicId} not found`);
	}
}

export class SceneNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Scene with publicId ${publicId} not found`);
	}
}

export class EventNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Event with publicId ${publicId} not found`);
	}
}

export class LastEventCannotBeDeletedError extends DomainError {
	constructor(publicId: string) {
		super(`Last event for scene with publicId ${publicId} cannot be deleted`);
	}
}

export class EventsNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Events for scene with publicId ${publicId} not found`);
	}
}

export class InitialSceneNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Initial scene for game with id ${publicId} not found`);
	}
}

export class InitialSceneCannotBeDeletedError extends DomainError {
	constructor(publicId: string) {
		super(`Initial scene for game with id ${publicId} cannot be deleted`);
	}
}

export class ScenesNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Scenes for game with id ${publicId} not found`);
	}
}

export class CommentNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`Comment with publicId ${publicId} not found`);
	}
}
