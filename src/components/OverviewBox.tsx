import sortBy from "lodash.sortby"
import zip from "lodash.zip"
import PouchDB from "pouchdb"
import React, { FunctionComponent } from "react"
import useSWR from "swr"

export const fetcher = async () => {
  const [cais, oscar] = await Promise.all(
    [
      process.env.NEXT_PUBLIC_REMOTE_DB_URL_CAIS,
      process.env.NEXT_PUBLIC_REMOTE_DB_URL_OSCAR,
    ].map(async (dbUrl) =>
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
  const { data } = useSWR("overview", fetcher, { refreshInterval: 5000 })

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
