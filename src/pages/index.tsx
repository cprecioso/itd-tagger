import React, { FunctionComponent } from "react"
import FormContents from "../components/Form"
import { Indications, IndicationsProvider } from "../hooks/indications"

const ActionsPanel: FunctionComponent = () => (
  <div className="actions">
    <style jsx>{`
      .actions {
        display: flex;
        flex-flow: column nowrap;
        padding-top: 1em;
      }

      .actions > * {
        width: 200px;
        margin: 0.1em 0.5em;
      }

      hr {
        border: 0;
        padding: 0.5em 0;
      }
    `}</style>
    <button>Previous [j]</button>
    <button>Next [k]</button>
    <hr />
    <button>Save [enter]</button>
    <button>Export</button>
    <hr />
    <Indications />
  </div>
)

const IndexPage = () => (
  <IndicationsProvider>
    <div className="split-panel">
      <style jsx>{`
        .split-panel {
          display: flex;
          flex-flow: row nowrap;
        }

        iframe {
          border: 0;
          height: 100vh;
          width: 70vh;
          pointer-events: none;
        }
      `}</style>

      <iframe src="/static/star.pdf" tabIndex={-1} />

      <div>
        <FormContents />
      </div>

      <ActionsPanel />
    </div>
  </IndicationsProvider>
)

export default IndexPage
