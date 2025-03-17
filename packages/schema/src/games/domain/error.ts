export class GameNotFoundError extends Error {
  constructor(id: number) {
    super(`Game with id ${id} not found`);
  }
}

export class SceneNotFoundError extends Error {
  constructor(id: number) {
    super(`Scene with id ${id} not found`);
  }
}

export class EventNotFoundError extends Error {
  constructor(id: number) {
    super(`Event with id ${id} not found`);
  }
}

export class LastEventCannotBeDeletedError extends Error {
  constructor(id: number) {
    super(`Last event for scene with id ${id} cannot be deleted`);
  }
}

export class EventsNotFoundError extends Error {
  constructor(id: number) {
    super(`Events for scene with id ${id} not found`);
  }
}

export class InitialSceneNotFoundError extends Error {
  constructor(id: number) {
    super(`Initial scene for game with id ${id} not found`);
  }
}

export class InitialSceneCannotBeDeletedError extends Error {
  constructor(id: number) {
    super(`Initial scene for game with id ${id} cannot be deleted`);
  }
}

export class ScenesNotFoundError extends Error {
  constructor(id: number) {
    super(`Scenes for game with id ${id} not found`);
  }
}

export class CommentNotFoundError extends Error {
  constructor(id: number) {
    super(`Comment with id ${id} not found`);
  }
}
