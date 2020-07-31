import React from "react"

export enum PromiseState {
  Waiting = "waiting",
  Fulfilled = "fulfilled",
  Rejected = "rejected",
}

export type UsedPromise<T, E = unknown> =
  | { state: PromiseState.Waiting }
  | { state: PromiseState.Fulfilled; value: T }
  | { state: PromiseState.Rejected; error: E }

export const usePromise = <T>(
  fn: () => Promise<T>,
  deps?: React.DependencyList
) => {
  const [state, setState] = React.useState<UsedPromise<T>>({
    state: PromiseState.Waiting,
  })

  React.useEffect(() => {
    setState({ state: PromiseState.Waiting })
    fn().then(
      (value) => setState({ state: PromiseState.Fulfilled, value }),
      (error) => setState({ state: PromiseState.Rejected, error })
    )
  }, deps)

  return state
}

export const useSimplePromise = <T>(
  fn: () => Promise<T>,
  deps?: React.DependencyList
): { value?: T; error?: any } => {
  const promise = usePromise(fn, deps)
  switch (promise.state) {
    case PromiseState.Fulfilled:
      return { value: promise.value }
    case PromiseState.Rejected:
      return { error: promise.error }
    case PromiseState.Waiting:
      return {}
  }
}
