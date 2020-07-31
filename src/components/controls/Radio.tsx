import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { useDisabled } from "../../hooks/disable"
import { useIndication } from "../../hooks/indications"
import { Label } from "./Label"

const Radio: FunctionComponent<{
  name: string
  label: string
  value: string
}> = ({ name, label, value }) => {
  const isDisabled = useDisabled()
  const { register } = useFormContext()

  return (
    <Label>
      <input
        type="radio"
        name={name}
        ref={register()}
        value={value}
        disabled={isDisabled}
      />{" "}
      {label}
    </Label>
  )
}

export const RadioSet: FunctionComponent<{
  name: string
  options: string[]
}> = ({ options, name }) => {
  const [isFocused, setIsFocused] = React.useState(false)
  useIndication("[up] and [down] to change options", isFocused)
  useIndication("[c] to clear", isFocused)

  const { setValue } = useFormContext()

  return (
    <div
      onKeyUp={(e) => {
        if (e.key == "c" || e.key == "C") setValue(name, undefined)
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <style jsx>{`
        div {
          display: contents;
        }
      `}</style>
      {options.map((option) => (
        <Radio key={option} label={option} value={option} name={name} />
      ))}
    </div>
  )
}
