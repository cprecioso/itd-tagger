import sortBy from "lodash.sortby"
import React, { FunctionComponent } from "react"
import { CardStatusQueryResponse } from "../card-data"
import { useCardStatus } from "../hooks/db"
import { Indications, useIndication } from "../hooks/indications"
import { useSelectedDocument } from "../hooks/selected-document"

export const IndexBox: FunctionComponent = () => {
  const { data, isValidating, error } = useCardStatus()

  const { currentIndex, goTo } = useSelectedDocument()

  useIndication("Refreshing card index...", isValidating)

  return (
    <>
      {error ? (
        <>
          <p>Error</p>
          <pre>{"" + error}</pre>
        </>
      ) : null}
      <div className="index-box-wrapper">
        <style jsx>{`
          .index-box-wrapper {
            overflow-y: scroll;
            margin-bottom: 3em;
            flex: 200px 1 1;
            height: 100vh;
            padding: 1em;
            box-sizing: border-box;
          }
          .index-box {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
          }

          .card-status {
            width: 10px;
            height: 10px;
            background: lightblue;
            box-sizing: border-box;
            margin: 0.5px;
            cursor: pointer;
          }

          .card-status.in_progress {
            background: orange;
          }

          .card-status.none {
            background: red;
          }

          .card-status.completed {
            background: green;
          }

          .card-status.current {
            background: blue;
            transform: scale(2);
            border: 1px solid white;
          }
        `}</style>
        <div
          className="index-box"
          onClick={(e) => {
            const index = (e.target as HTMLElement).dataset.index
            if (index) {
              goTo(Number.parseInt(index))
            } else {
              goTo(null)
            }
          }}
        >
          {sortBy(
            ((data?.rows as any) as CardStatusQueryResponse[]) ?? [],
            (row) => row.id.padStart(5, "0")
          ).map((row) => (
            <div
              className={`card-status ${row.key} ${
                row.id === "" + currentIndex ? "current" : ""
              }`}
              key={row.id}
              data-index={row.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export const ActionsPanel: FunctionComponent = () => {
  const { goToPrevious, goToNext } = useSelectedDocument()

  React.useEffect(() => {
    const listener = (e: KeyboardEvent): void => {
      if (
        e.target instanceof HTMLInputElement &&
        (e.target.type === "text" || e.target.type === "date")
      )
        return
      if (e.key === "j" || e.key === "J") {
        goToPrevious()
        e.stopPropagation()
      } else if (e.key === "k" || e.key === "K") {
        goToNext()
        e.stopPropagation()
      }
    }

    document.addEventListener("keyup", listener, true)
    return () => document.removeEventListener("keyup", listener)
  }, [])

  return (
    <div className="actions">
      <style jsx>{`
        .actions {
          display: flex;
          flex-flow: column nowrap;
          padding-top: 1em;
          height: 100vh;
          overflow-y: hidden;

          width: 250px;
        }

        .actions > * {
          width: 80%;
          margin: 0.1em 0.5em;
        }

        hr {
          border: 0;
          padding: 0.5em 0;
        }
      `}</style>

      <button type="submit">Save [enter]</button>
      <hr />
      <button onClick={() => goToPrevious()}>Previous [j]</button>
      <button onClick={() => goToNext()}>Next [k]</button>
      <hr />
      <Indications />
    </div>
  )
}
