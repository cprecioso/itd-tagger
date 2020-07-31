import React, { FunctionComponent } from "react"
import { DisableProvider } from "../hooks/disable"
import { useIndication } from "../hooks/indications"
import {
  Checkbox,
  CheckboxSet,
  Fieldset,
  Group,
  RadioSet,
  Scale,
} from "./controls"

const ContextLearning: FunctionComponent<{ i: number }> = ({ i }) => {
  const [enabledParts, setEnabledParts] = React.useState({
    knowledge: false,
    type: true,
    focus: true,
  })

  return (
    <Fieldset togglable legend={`Context learning ${i}`}>
      <RadioSet
        options={["process description", "design description", "knowledge"]}
        onChange={(v) =>
          setEnabledParts((old) => ({ ...old, knowledge: v === "knowledge" }))
        }
      />
      <DisableProvider disable={!enabledParts.knowledge}>
        <Group label="Knowledge type indication">
          <Checkbox
            label="correct"
            onChange={(v) => setEnabledParts((old) => ({ ...old, type: !v }))}
          />
          <DisableProvider disable={!enabledParts.type}>
            <RadioSet options={["insight", "idea", "know-how"]} />
          </DisableProvider>
        </Group>
        <Group label="Knowledge focus indication">
          <Checkbox
            label="correct"
            onChange={(v) => setEnabledParts((old) => ({ ...old, focus: !v }))}
          />
          <DisableProvider disable={!enabledParts.focus}>
            <CheckboxSet options={["people", "technology", "organisation"]} />
          </DisableProvider>
        </Group>
        <Group>
          <Scale label={["superficial", "thought-through"]} />
          <Scale label={["project-oriented", "self-oriented"]} />
          <Scale label={["case-specific", "universal"]} />
        </Group>
      </DisableProvider>
      <Checkbox label="special" />
    </Fieldset>
  )
}

const FormContents: FunctionComponent = () => {
  useIndication("[tab] and [shift+tab] to change to between fields", true)

  return (
    <form>
      <style jsx>{`
        form {
          display: flex;
          flex-flow: column nowrap;

          width: 430px;
          height: 100vh;
          padding: 1em;
          overflow-y: scroll;
        }
      `}</style>
      <Fieldset legend="Heading">
        <Group>
          <RadioSet
            options={[
              "describes interaction with the protoype",
              "describes the design",
              "describes the process",
              "other",
            ]}
          />
        </Group>
        <Checkbox label="special (wow! e.g. a nice quote)" />
      </Fieldset>

      <Fieldset legend="Image">
        <Group label="Medium">
          <CheckboxSet
            options={[
              "photo",
              "sketch",
              "3d game",
              "photoshopped image",
              "collage of multiple elements",
              "other",
            ]}
          />
        </Group>
        <Group label="Depiction">
          <CheckboxSet
            options={[
              "product",
              "context",
              "person/people",
              "hands",
              "face",
              "screen interface",
              "tangible interface",
              "low fidelity",
              "high fidelity",
            ]}
          />
        </Group>
        <Checkbox label="special" />
      </Fieldset>

      <ContextLearning i={1} />
      <ContextLearning i={2} />
      <ContextLearning i={3} />

      <Fieldset legend="Knowledge gained about designing">
        <Group>
          <RadioSet
            options={[
              "process description",
              "personal insight",
              "teamwork insight",
            ]}
          />
        </Group>
        <Group>
          <Scale label={["going bad", "going well"]} />
        </Group>
        <Checkbox label="special" />
      </Fieldset>
    </form>
  )
}

export default FormContents
