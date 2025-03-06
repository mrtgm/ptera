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

export class InitialSceneNotFoundError extends DomainError {
	constructor(gameId: number) {
		super(`Initial scene for game with id ${gameId} not found`);
	}
}

export class ScenesNotFoundError extends DomainError {
	constructor(gameId: number) {
		super(`Scenes for game with id ${gameId} not found`);
	}
}

export class UserNotFoundError extends DomainError {
	constructor(userId: number) {
		super(`User with id ${userId} not found`);
	}
}
