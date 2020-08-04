import { useId } from "@react-aria/utils"
import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { useDisabled } from "../../hooks/disable"
import { useIndication } from "../../hooks/indications"
import { useSelectedDocument } from "../../hooks/selected-document"
import { Label } from "./Label"

export const Checkbox: FunctionComponent<{
  label: string
  name: string
  value?: string
  refocus?: boolean
}> = ({ label, name, value, refocus = false }) => {
  const [isFocused, setIsFocused] = React.useState(false)
  useIndication("[space] to toggle", isFocused)
  useIndication("[c] to clear", isFocused)

  const isDisabled = useDisabled()
  const { register, setValue } = useFormContext()

  const elementId = useId()

  const { currentIndex } = useSelectedDocument()
  React.useEffect(() => {
    if (refocus && !isDisabled) document.getElementById(elementId)?.focus()
  }, [refocus, currentIndex, isDisabled])

  return (
    <Label>
      <input
        id={elementId}
        type="checkbox"
        name={name}
        ref={register()}
        value={value}
        disabled={isDisabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyUp={(e) => {
          if (e.key == "c" || e.key == "C") setValue(name, false)
        }}
      />{" "}
      {label}
    </Label>
  )
}

export const CheckboxSet: FunctionComponent<{
  options: string[]
  name: string
}> = ({ options, name }) => (
  <>
    {options.map((option) => (
      <Checkbox name={name} key={option} label={option} value={option} />
    ))}
  </>
)
