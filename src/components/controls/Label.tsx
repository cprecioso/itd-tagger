import React, { FunctionComponent } from "react"

export const Label: FunctionComponent<JSX.IntrinsicElements["label"]> = ({
  children,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <label
      {...props}
      className={`${isFocused ? "focused" : ""} ${props.className ?? ""}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <style jsx>{`
        label {
          background: rgba(0, 0, 0, 0.1);
          margin: 0.1em 0;
          padding-right: 1em;
        }
        label.focused {
          background: rgba(50, 0, 0, 0.3);
        }
      `}</style>
      {children}
    </label>
  )
}
