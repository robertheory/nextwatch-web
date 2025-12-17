export enum ShowStatus {
  NOT_STARTED,
  WATCHING,
  FINISHED,
  UNTRACKED,
}

export type Statuses = keyof typeof ShowStatus;