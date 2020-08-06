import { AppProps } from "next/app"
import React, { FunctionComponent } from "react"
import { SecretProvider } from "../hooks/secret"

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
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
          font-family: sans-serif;
        }

        input:focus {
          outline: 2px red solid;
        }
      `}</style>

      <SecretProvider>
        <Component {...pageProps} />
      </SecretProvider>
    </>
  )
}

export default App
