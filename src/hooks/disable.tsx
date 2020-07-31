import React, { FunctionComponent } from "react"

export type DisableState = boolean

const DisableContext = React.createContext<DisableState>(false)

export const DisableProvider: FunctionComponent<{ disable?: boolean }> = ({
  disable = false,
  children,
}) => {
  const parentDisable = useDisabled()
  return (
    <DisableContext.Provider value={disable || parentDisable}>
      <style jsx>{`
        div {
          display: flex;
          flex-flow: column nowrap;
        }
      `}</style>
      <div style={{ opacity: disable && !parentDisable ? "0.3" : "1" }}>
        {children}
      </div>
    </DisableContext.Provider>
  )
}

export const useDisabled = () => React.useContext(DisableContext)
