export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class UserNotFoundError extends DomainError {
	constructor(publicId: string) {
		super(`User with publicId ${publicId} not found`);
	}
}

export class UserUnauthorizedError extends DomainError {
	constructor() {
		super("User is not authorized to perform this action");
	}
}
