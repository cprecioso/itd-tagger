import React, { FunctionComponent } from "react"

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
