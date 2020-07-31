import React, { FunctionComponent } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useSWR from "swr"
import { CardData } from "../card-data"
import { ActionsPanel, IndexBox } from "../components/ActionsPanel"
import FormContents from "../components/Form"
import { useDB } from "../hooks/db"
import { DisableProvider } from "../hooks/disable"
import { IndicationsProvider, useIndication } from "../hooks/indications"
import {
  SelectedDocumentProvider,
  useSelectedDocument,
} from "../hooks/selected-document"

const IndexPage = () => {
  const methods = useForm<CardData>()

  return (
    <IndicationsProvider>
      <FormProvider {...methods}>
        <SelectedDocumentProvider>
          <AppPanels />
        </SelectedDocumentProvider>
      </FormProvider>
    </IndicationsProvider>
  )
}

export default IndexPage

const AppPanels: FunctionComponent = () => {
  const { currentIndex, save } = useSelectedDocument()

  const db = useDB()
  const key = currentIndex != null ? "" + currentIndex : null
  const { data, error, isValidating } = useSWR(
    key,
    (id) => db.get<CardData>(id),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  const canEdit = key != null && !error && !isValidating

  useIndication("Refreshing content...", isValidating)

  const { reset } = useFormContext()

  React.useEffect(() => {
    if (data && canEdit) {
      reset({
        heading: { enabled: true },
        image: { enabled: true },
        context_learning: [
          { enabled: true },
          { enabled: true },
          { enabled: true },
        ],
        design_learning: { enabled: true },
        ...data,
      })
    }
  }, [data, canEdit])

  return (
    <form className="split-panel" onSubmit={save}>
      <style jsx>{`
        .split-panel {
          display: flex;
          flex-flow: row nowrap;
        }

        iframe {
          border: 0;
          height: 100vh;
          width: 70vh;
          pointer-events: none;
          flex: auto 0 0;
        }
      `}</style>

      <iframe src={data?.url} tabIndex={-1} />

      <div>
        {error ? (
          <>
            <p>Error</p>
            <pre>{"" + error}</pre>
          </>
        ) : null}
        <DisableProvider disable={!canEdit}>
          <FormContents />
        </DisableProvider>
      </div>

      <ActionsPanel />

      <IndexBox />
    </form>
  )
}
