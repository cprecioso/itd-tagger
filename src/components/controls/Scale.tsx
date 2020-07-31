import { useId } from "@react-aria/utils"
import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { useDisabled } from "../../hooks/disable"
import { useIndication } from "../../hooks/indications"
import { Label } from "./Label"

export const Scale: FunctionComponent<{
  label: [string, string]
  name?: string
}> = ({ label, name }) => {
  const [isFocused, setIsFocused] = React.useState(false)
  useIndication("[left] and [right] to change value", isFocused)

  const elementId = useId()

  const isDisabled = useDisabled()

  const { register } = useFormContext()

  return (
    <Label>
      <style jsx>{`
        input {
          width: 100%;
        }
        .sep {
          width: 100%;
          flex: auto 0 1;
        }
        span {
          display: block;
          flex: auto 0 0;
        }
        div {
          display: flex;
          flex-flow: row nowrap;
        }
      `}</style>
      <div>
        <span>{label[0]}</span>
        <span className="sep" />
        <span>{label[1]}</span>
      </div>

      <input
        disabled={isDisabled}
        type="range"
        min="1"
        max="5"
        step="1"
        defaultValue="3"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        list={elementId}
        ref={register()}
        name={name}
      />
      <datalist id={elementId}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n}>{n}</option>
        ))}
      </datalist>
    </Label>
  )
}
