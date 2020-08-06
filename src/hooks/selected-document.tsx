import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { mutate } from "swr"
import { updateCardStatus, useDB } from "./db"

type SelectedDocumentState = { currentIndex: number | null }

export type SelectedDocumentContext = {
  goToPrevious(): void
  goToNext(): void
  goTo(index: number | null): void
  readonly currentIndex: number | null
  save(): Promise<void>
}

const SelectedDocumentContext = React.createContext<SelectedDocumentContext | null>(
  null
)

export const SelectedDocumentProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = React.useState<SelectedDocumentState>({
    currentIndex: null,
  })

  const { handleSubmit } = useFormContext()
  const db = useDB()

  const ctx = React.useMemo<SelectedDocumentContext>(() => {
    const save = handleSubmit(async (formData) => {
      if (state.currentIndex == null) return
      const docId = "" + state.currentIndex
      const data = await db.get(docId)
      const newData = { ...data, ...formData }
      console.log("Saving", data, formData, newData)
      mutate(docId, newData, false)
      await db.put(newData)
      mutate(docId)
      updateCardStatus()
    })

    return {
      save,
      currentIndex: state.currentIndex,
      goTo: async (index) => {
        await save()
        return setState((old) =>
          old.currentIndex === index ? old : { ...old, currentIndex: index }
        )
      },
      goToNext: async () => {
        await save()
        return setState((old) => ({
          ...old,
          currentIndex: (old.currentIndex ?? -1) + 1,
        }))
      },
      goToPrevious: async () => {
        await save()
        return setState((old) => ({
          ...old,
          currentIndex: (old.currentIndex ?? 1) - 1,
        }))
      },
    }
  }, [state])

  return (
    <SelectedDocumentContext.Provider value={ctx}>
      {children}
    </SelectedDocumentContext.Provider>
  )
}

export const useSelectedDocument = () => {
  const ctx = React.useContext(SelectedDocumentContext)
  if (!ctx) throw new Error("No SelectedDocument Provider")
  return ctx
}
