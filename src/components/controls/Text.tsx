import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { useDisabled } from "../../hooks/disable"
import { Label } from "./Label"

export const Text: FunctionComponent<{ label: string; name?: string }> = ({
  label,
  name,
}) => {
  const isDisabled = useDisabled()
  const { register } = useFormContext()

  return (
    <Label>
      {label}
      <br />
      <input ref={register()} name={name} disabled={isDisabled} type="text" />
    </Label>
  )
}
