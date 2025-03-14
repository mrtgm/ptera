export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class GameNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Game with id ${id} not found`);
	}
}

export class SceneNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Scene with id ${id} not found`);
	}
}

export class EventNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Event with id ${id} not found`);
	}
}

export class LastEventCannotBeDeletedError extends DomainError {
	constructor(id: number) {
		super(`Last event for scene with id ${id} cannot be deleted`);
	}
}

export class EventsNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Events for scene with id ${id} not found`);
	}
}

export class InitialSceneNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Initial scene for game with id ${id} not found`);
	}
}

export class InitialSceneCannotBeDeletedError extends DomainError {
	constructor(id: number) {
		super(`Initial scene for game with id ${id} cannot be deleted`);
	}
}

export class ScenesNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Scenes for game with id ${id} not found`);
	}
}

export class CommentNotFoundError extends DomainError {
	constructor(id: number) {
		super(`Comment with id ${id} not found`);
	}
}
