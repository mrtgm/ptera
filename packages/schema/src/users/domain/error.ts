export class UserNotFoundError extends Error {
  constructor(id: number) {
    super(`User with id ${id} not found`);
  }
}

export class UserUnauthorizedError extends Error {
  constructor() {
    super("User is not authorized to perform this action");
  }
}
