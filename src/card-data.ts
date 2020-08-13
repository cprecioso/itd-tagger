export enum CardDataStatus {
  None = "none",
  InProgress = "in_progress",
  Completed = "completed",
  Deleted = "deleted",
}

export type CardData = Record<string, any> & {
  url: string
  deleted?: boolean
  status?: { in_progress?: boolean; completed?: boolean; deleted?: boolean }
}

export type CardStatusQueryResponse = {
  key: CardDataStatus
  id: string
}
