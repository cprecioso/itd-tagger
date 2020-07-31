import { useCheckbox } from "@react-aria/checkbox"
import { RadioAriaProps, useRadio, useRadioGroup } from "@react-aria/radio"
import { RadioGroupState, useRadioGroupState } from "@react-stately/radio"
import { useToggleState } from "@react-stately/toggle"
import React, { FunctionComponent } from "react"
import { DisableProvider, useDisabled } from "../hooks/disable"
import { useIndication } from "../hooks/indications"

export const Label: FunctionComponent<JSX.IntrinsicElements["label"]> = ({
  children,
  ...props
}) => (
  <label {...props}>
    <style jsx>{`
      label {
        background: lightgray;
        margin: 0.1em 0;
        padding-right: 1em;
      }
    `}</style>
    {children}
  </label>
)

export const Group: FunctionComponent<{ label?: string }> = ({
  label,
  children,
}) => (
  <div className="group-wrapper">
    <style jsx>{`
      .group-wrapper {
        display: flex;
        flex-flow: column nowrap;
        margin: 1em 0;
      }
      .group-wrapper > * {
        display: flex;
        flex-flow: column nowrap;
      }
      p {
        margin: 0;
        margin-right: 1em;
        font-style: italic;
      }
      div {
        margin-left: ${label ? "1em" : "0"};
      }
    `}</style>
    {label ? <p>{label}:</p> : null}
    <div>{children}</div>
  </div>
)

export const RadioSet: FunctionComponent<{
  options: string[]
  onChange?: (value: string) => void
}> = ({ options, onChange }) => {
  const [isFocused, setIsFocused] = React.useState(0)
  useIndication("[up] and [down] to change options", isFocused > 0)
  useIndication("[space] to toggle", isFocused > 0)
  useIndication("[c] to clear", isFocused > 0)

  const isDisabled = useDisabled()
  const props = { onChange, "aria-label": "radio-group", isDisabled }
  const state = useRadioGroupState(props)
  const { radioGroupProps } = useRadioGroup(props, state)

  return (
    <div {...radioGroupProps}>
      <style jsx>{`
        div {
          display: contents;
        }
      `}</style>
      {options.map((option) => (
        <Radio
          key={option}
          state={state}
          value={option}
          onKeyUp={(e: React.KeyboardEvent<HTMLElement>) => {
            if (e.key == "c" || e.key == "C") state.setSelectedValue("")
          }}
          onFocus={() => setIsFocused((old) => old + 1)}
          onBlur={() => setIsFocused((old) => old - 1)}
          onClick={() => state.setSelectedValue(option)}
        />
      ))}
    </div>
  )
}

const Radio: FunctionComponent<
  { state: RadioGroupState } & RadioAriaProps &
    Pick<JSX.IntrinsicElements["label"], "onClick">
> = ({ state, onClick, ...props }) => {
  const isDisabled = useDisabled()
  const ref = React.createRef<HTMLInputElement>()
  const { inputProps } = useRadio(
    { "aria-label": "radio", ...props, isDisabled },
    state,
    ref
  )
  return (
    <Label onClick={onClick}>
      <input {...inputProps} ref={ref} /> {props.value}
    </Label>
  )
}

export const Checkbox: FunctionComponent<{
  label: string
  onChange?: (value: boolean) => void
  defaultChecked?: boolean
}> = ({ label, onChange, defaultChecked = false }) => {
  const [isFocused, setIsFocused] = React.useState(false)
  useIndication("[space] to toggle", isFocused)

  const isDisabled = useDisabled()

  const props = {
    defaultSelected: defaultChecked,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onChange: onChange,
    isDisabled,
    "aria-label": "toggle",
  }
  const state = useToggleState(props)
  const ref = React.useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(props, state, ref)

  return (
    <Label onClick={() => state.setSelected(!state.isSelected)}>
      <input {...inputProps} ref={ref} /> {label}
    </Label>
  )
}

export const CheckboxSet: FunctionComponent<{ options: string[] }> = ({
  options,
}) => (
  <>
    {options.map((option) => (
      <Checkbox key={option} label={option} />
    ))}
  </>
)

export const Scale: FunctionComponent<{ label: [string, string] }> = ({
  label,
}) => {
  const [isFocused, setIsFocused] = React.useState(false)
  useIndication("[left] and [right] to change value", isFocused)

  const isDisabled = useDisabled()

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
      />
    </Label>
  )
}

export const Fieldset: FunctionComponent<{
  legend: string
  togglable?: boolean
  defaultValue?: boolean
}> = ({ legend, children, togglable = true }) => {
  const [isOn, setIsOn] = React.useState(true)

  return (
    <fieldset>
      <style jsx>{`
        fieldset {
          display: flex;
          flex-flow: column nowrap;
          max-width: 400px;
          width: 100%;
          margin-bottom: 1.5em;
        }
      `}</style>
      <legend>
        {togglable ? (
          <Checkbox label={legend} defaultChecked onChange={setIsOn} />
        ) : (
          legend
        )}
      </legend>
      <DisableProvider disable={!isOn}>{children}</DisableProvider>
    </fieldset>
  )
}
