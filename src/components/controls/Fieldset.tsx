import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { DisableProvider } from "../../hooks/disable"
import { Checkbox } from "./Checkbox"

export const Fieldset: FunctionComponent<{
  legend: string
  togglable?: boolean

  name?: string
}> = ({ legend, children, togglable = true, name }) => {
  const { watch } = useFormContext()

  return (
    <fieldset>
      <style jsx>{`
        fieldset {
          display: flex;
          flex-flow: column nowrap;
          max-width: 400px;
          width: 100%;
          margin-bottom: 1.5em;

          border: 1px solid black;
        }
      `}</style>
      <legend>
        {togglable ? <Checkbox name={name} label={legend} /> : legend}
      </legend>
      <DisableProvider disable={name ? !watch(name) : false}>
        {children}
      </DisableProvider>
    </fieldset>
  )
}
