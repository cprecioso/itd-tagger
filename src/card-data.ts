export enum CardDataStatus {
  None = "none",
  InProgress = "in_progress",
  Completed = "completed",
}

export type CardData = Record<string, any> & {
  url: string
  status?: { in_progress?: boolean; completed?: boolean }
}

export type CardStatusQueryResponse = {
  key: CardDataStatus
  id: string
}
