import React, { FunctionComponent } from "react"
import { useFormContext } from "react-hook-form"
import { DisableProvider } from "../hooks/disable"
import { useIndication } from "../hooks/indications"
import { Checkbox, CheckboxSet } from "./controls/Checkbox"
import { Date } from "./controls/Date"
import { Fieldset } from "./controls/Fieldset"
import { Group } from "./controls/Group"
import { RadioSet } from "./controls/Radio"
import { Scale } from "./controls/Scale"
import { Text } from "./controls/Text"

const ContextLearning: FunctionComponent<{ i: number }> = ({ i }) => {
  const { watch } = useFormContext()

  return (
    <Fieldset
      togglable
      name={`context_learning[${i - 1}].enabled`}
      legend={`Context learning ${i}`}
    >
      <RadioSet
        name={`context_learning[${i - 1}].type`}
        options={["process description", "design description", "knowledge"]}
      />
      <DisableProvider
        disable={watch(`context_learning[${i - 1}].type`) !== "knowledge"}
      >
        <Group label="Knowledge type indication">
          <Checkbox
            name={`context_learning[${i - 1}].knowledge.type.correct`}
            label="correct"
          />
          <DisableProvider
            disable={watch(`context_learning[${i - 1}].knowledge.type.correct`)}
          >
            <RadioSet
              name={`context_learning[${i - 1}].knowledge.type.actual`}
              options={["insight", "idea", "know-how"]}
            />
          </DisableProvider>
        </Group>
        <Group label="Knowledge focus indication">
          <Checkbox
            name={`context_learning[${i - 1}].knowledge.focus.correct`}
            label="correct"
          />
          <DisableProvider
            disable={watch(
              `context_learning[${i - 1}].knowledge.focus.correct`
            )}
          >
            <CheckboxSet
              name={`context_learning[${i - 1}].knowledge.focus.actual`}
              options={["people", "technology", "organisation"]}
            />
          </DisableProvider>
        </Group>
        <Group>
          <Scale
            name={`context_learning[${i - 1}].knowledge.depth`}
            label={["superficial", "thought-through"]}
          />
          <Scale
            name={`context_learning[${
              i - 1
            }].knowledge.project_or_self_oriented`}
            label={["project-oriented", "self-oriented"]}
          />
          <Scale
            name={`context_learning[${i - 1}].knowledge.universality`}
            label={["case-specific", "universal"]}
          />
        </Group>
      </DisableProvider>
      <Checkbox name={`context_learning[${i - 1}].special`} label="special" />
    </Fieldset>
  )
}

const FormContents: FunctionComponent<{}> = () => {
  useIndication("[tab] and [shift+tab] to change between fields")
  const { watch, register } = useFormContext()

  return (
    <div className="form">
      <style jsx>{`
        .form {
          display: flex;
          flex-flow: column nowrap;

          width: 430px;
          height: 100vh;
          padding: 1em;
          overflow-y: scroll;
        }
      `}</style>

      {watch("status.deleted") ? <p>Card is not applicable</p> : null}

      <DisableProvider disable={watch("status.deleted")}>
        <Fieldset legend="In progress" togglable={false}>
          <Checkbox
            refocus
            label="Mark card as in progress"
            name="status.in_progress"
          />
        </Fieldset>

        <DisableProvider disable={!watch("status.in_progress")}>
          <Fieldset legend="Heading" name="heading.enabled">
            <Group>
              <RadioSet
                name="heading.type"
                options={[
                  "describes interaction with the protoype",
                  "describes the design",
                  "describes the process",
                  "other",
                ]}
              />
            </Group>
            <Checkbox
              name="heading.special"
              label="special (wow! e.g. a nice quote)"
            />
          </Fieldset>

          <Fieldset name="image.enabled" legend="Image">
            <Group label="Medium">
              <CheckboxSet
                name="image.medium"
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
                name="image.depiction"
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
            <Checkbox name="image.special" label="special" />
          </Fieldset>

          <ContextLearning i={1} />
          <ContextLearning i={2} />
          <ContextLearning i={3} />

          <Fieldset
            name="design_learning.enabled"
            legend="Knowledge gained about designing"
          >
            <Group>
              <RadioSet
                name="design_learning.type"
                options={[
                  "process description",
                  "personal insight",
                  "teamwork insight",
                ]}
              />
            </Group>
            <Group>
              <Scale
                name="design_learning.progress"
                label={["going bad", "going well"]}
              />
            </Group>
            <Checkbox name="design_learning.special" label="special" />
          </Fieldset>

          <Fieldset legend="Card data" togglable={false}>
            <Date name="metadata.date" label="Date" />
            <Text name="metadata.student_name" label="Student name" />
            <Text name="metadata.group_number" label="Group number" />
          </Fieldset>

          <Fieldset legend="Completed" togglable={false}>
            <Checkbox label="Mark card as processed" name="status.completed" />
          </Fieldset>
        </DisableProvider>
      </DisableProvider>

      <Fieldset legend="Special" togglable={false}>
        Notes
        <br />
        <textarea name="notes" ref={register()} />
        <hr />
        <Checkbox label="Mark card as not applicable" name="status.deleted" />
      </Fieldset>
    </div>
  )
}

export default FormContents
