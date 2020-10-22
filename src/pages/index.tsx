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
        <Link href="/[db]" as="/rev1">
          <button>Rev1</button>
        </Link>
        <Link href="/[db]" as="/rev2">
          <button>Rev2</button>
        </Link>
      </p>
      <hr />
      <OverviewBox />
    </div>
  )
}

export default IndexPage
