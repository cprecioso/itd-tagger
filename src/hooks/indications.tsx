import React, { FunctionComponent } from "react"

type IndicationsState = Record<string, number>
type IndicationsContext = {
  state: IndicationsState
  setState: React.Dispatch<React.SetStateAction<IndicationsState>>
}

const IndicationsContext = React.createContext<IndicationsContext | null>(null)
IndicationsContext.displayName = "IndicationsContext"

export const IndicationsProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = React.useState<IndicationsState>({})
  return (
    <IndicationsContext.Provider value={{ state, setState }}>
      {children}
    </IndicationsContext.Provider>
  )
}

export const useIndication = (text: string, when = true) => {
  const ctx = React.useContext(IndicationsContext)

  React.useEffect(() => {
    ctx?.setState((old) => ({ ...old, [text]: old[text] ?? 0 }))
  }, [])

  React.useEffect(() => {
    if (when) {
      ctx?.setState((old) => ({ ...old, [text]: (old[text] || 0) + 1 }))
      return () =>
        ctx?.setState((old) => ({
          ...old,
          [text]: Math.max(0, (old[text] || 0) - 1),
        }))
    }
  }, [text, when])
}

export const Indications: FunctionComponent = () => {
  const ctx = React.useContext(IndicationsContext)
  return (
    <p>
      {Object.entries(ctx?.state ?? {})
        .filter(([, count]) => count > 0)
        .map(([text], i) => (
          <React.Fragment key={text}>
            {i === 0 ? null : <br />}
            {text}
          </React.Fragment>
        ))}
    </p>
  )
}
