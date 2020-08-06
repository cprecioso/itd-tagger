import sortBy from "lodash.sortby"
import zip from "lodash.zip"
import PouchDB from "pouchdb"
import React, { FunctionComponent } from "react"
import useSWR from "swr"
import { useSecrets } from "../hooks/secret"

export const fetcher = async (caisUrl: string, oscarUrl: string) => {
  const [cais, oscar] = await Promise.all(
    [caisUrl, oscarUrl].map(async (dbUrl) =>
      sortBy(
        (await new PouchDB(dbUrl).query("card-queries/card-status")).rows,
        (row) => row.id
      )
    )
  )

  return zip(cais, oscar)
}

export const SIZE = 13
export const PADDING = 2
export const COLUMNS = 50

export const OverviewBox: FunctionComponent = () => {
  const secrets = useSecrets()
  const { data } = useSWR([secrets.cais, secrets.oscar], fetcher, {
    refreshInterval: 5000,
  })

  const rows = Math.ceil((data?.length ?? 0) / COLUMNS)

  const width = COLUMNS * (PADDING + SIZE)
  const height = rows * (PADDING + SIZE)

  return (
    <>
      <h3>Progress</h3>
      <svg width={width} height={height}>
        <style jsx>{`
          polygon {
            stroke: white;
            stroke-width: ${PADDING / 2};
            fill: black;
          }
          .none {
            fill: red;
          }
          .in_progress {
            fill: orange;
          }
          .completed {
            fill: green;
          }
        `}</style>

        {data?.map(([cais, oscar], n) => {
          const i = n % COLUMNS
          const j = (n / COLUMNS) | 0
          const originX = i * SIZE
          const originY = j * SIZE

          return (
            <React.Fragment key={(cais ?? oscar)!.id}>
              {cais ? (
                <polygon
                  className={cais.key}
                  points={`${originX},${originY} ${originX},${originY + SIZE} ${
                    originX + SIZE
                  },${originY}`}
                />
              ) : null}
              {oscar ? (
                <polygon
                  className={oscar.key}
                  points={`${originX + SIZE},${originY + SIZE} ${originX},${
                    originY + SIZE
                  } ${originX + SIZE},${originY}`}
                />
              ) : null}
            </React.Fragment>
          )
        })}
      </svg>
    </>
  )
}
