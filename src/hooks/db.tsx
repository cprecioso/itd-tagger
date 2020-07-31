import PouchDB from "pouchdb"
import React, { FunctionComponent } from "react"
import useSWR, { mutate } from "swr"
import { useSimplePromise } from "./promise"

export type DB = PouchDB.Database<{}>

const createDb = async (remoteUrl: string | undefined) => {
  if (!remoteUrl) throw new Error("No remote db")
  const db = new PouchDB("local")
  await db.sync(remoteUrl)
  db.sync(remoteUrl, { live: true, retry: true })

  try {
    Object.assign(window, { db })
  } catch {}

  return db
}

const DBContext = React.createContext<DB | null>(null)
DBContext.displayName = "DBContext"

export const DBProvider: FunctionComponent = ({ children }) => {
  const { error, value: db } = useSimplePromise(
    () => createDb(process.env.NEXT_PUBLIC_REMOTE_DB_URL),
    []
  )

  if (error) {
    return (
      <>
        <p>Error</p>
        <pre>{"" + error}</pre>
      </>
    )
  } else if (db) {
    return <DBContext.Provider value={db}>{children}</DBContext.Provider>
  } else {
    return <p>Syncing...</p>
  }
}

export const useDB = () => {
  const db = React.useContext(DBContext)
  if (!db) throw new Error("No dbprovider")
  return db
}

export const useCardStatus = () => {
  const db = useDB()
  return useSWR("card-queries/card-status", db.query.bind(db), {
    refreshInterval: 10000,
  })
}

export const updateCardStatus = () => mutate("card-queries/card-status")
