import React, { FunctionComponent } from "react"

export type GlobalActionsRef = {}

type GlobalActionsContext = React.MutableRefObject<GlobalActionsRef>

const GlobalActionsContext = React.createContext<GlobalActionsContext>({
  current: {},
})

export const GlobalActionsProvider: FunctionComponent = ({ children }) => {
  const ref = React.useRef({})

  React.useEffect(() => {
    // @ts-expect-error
    window.actions = ref
  }, [])

  return (
    <GlobalActionsContext.Provider value={ref}>
      {children}
    </GlobalActionsContext.Provider>
  )
}

export const useGlobalActions = () => React.useContext(GlobalActionsContext)
