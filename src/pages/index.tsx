import Link from "next/link"
import React from "react"

const IndexPage = () => (
  <>
    <Link href="/[db]" as="/cais">
      <a>Cais</a>
    </Link>
    <br />
    <Link href="/[db]" as="/oscar">
      <a>Oscar</a>
    </Link>
  </>
)

export default IndexPage
