import { AppProps } from "next/app"
import Head from "next/head"
import React, { FunctionComponent } from "react"
import { DBProvider } from "../hooks/db"

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;

          font-size: 0.9em;

          overflow: hidden;
        }
        body,
        button {
          font-family: "Fira Code", monospace;
        }

        input:focus {
          outline: 2px red solid;
        }
      `}</style>

      <DBProvider>
        <Component {...pageProps} />
      </DBProvider>
    </>
  )
}

export default App
