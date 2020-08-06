import Link from "next/link"
import React, { FunctionComponent } from "react"
import { OverviewBox } from "../components/OverviewBox"

const IndexPage: FunctionComponent = () => {
  return (
    <div>
      <h1>ITD Tagger</h1>
      <hr />
      <style jsx>{`
        div {
          margin: 1em;
        }
      `}</style>
      <h3>Launch tool</h3>
      <p>
        <Link href="/[db]" as="/cais">
          <button>Cais</button>
        </Link>
        <Link href="/[db]" as="/oscar">
          <button>Oscar</button>
        </Link>
      </p>
      <hr />
      <OverviewBox />
    </div>
  )
}

export default IndexPage
