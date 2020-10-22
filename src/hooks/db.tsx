import { useRouter } from "next/router"
import PouchDB from "pouchdb"
import React, { FunctionComponent } from "react"
import useSWR, { mutate } from "swr"
import { useSimplePromise } from "./promise"
import { useSecrets } from "./secret"

export type DB = PouchDB.Database<{}>

const createDb = async (localName: string, remoteUrl: string | undefined) => {
  if (!remoteUrl) throw new Error("No remote db")
  const db = new PouchDB("local-2-" + localName)
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
  const router = useRouter()
  const dbName = router.query.db as "cais" | "oscar"

  const urls = useSecrets()

  const { error, value: db } = useSimplePromise(
    () => createDb(dbName, urls[dbName]),
    [dbName]
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
