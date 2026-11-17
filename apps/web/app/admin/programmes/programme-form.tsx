import type { Programme, ProgrammeStrategy } from "@repo/database";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import { CmsStatusActions } from "../_components/cms-status-actions";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage, StatusCard } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import styles from "../cms.module.css";
import {
  archiveProgramme,
  createProgramme,
  publishProgramme,
  unpublishProgramme,
  updateProgramme,
} from "./actions";

type ProgrammeWithStrategies = Programme & { strategies: ProgrammeStrategy[] };

type Props = {
  programme?: ProgrammeWithStrategies;
  error?: string;
  saved?: boolean;
};

export function ProgrammeForm({ programme, error, saved }: Props) {
  const isEdit = Boolean(programme);
  const action = isEdit
    ? updateProgramme.bind(null, programme!.id)
    : createProgramme;
  const strategies = [
    ...(programme?.strategies ?? []),
    {
      id: "blank",
      title: "",
      body: null as string | null,
      sortOrder: 999,
    },
  ];

  return (
    <FormPage
      backHref="/admin/programmes"
      backLabel="Programmes"
      title={isEdit ? "Edit programme" : "New programme"}
      description="Programme areas and their strategies shown on the public site."
      status={programme?.status}
      error={error ? "Check the required fields and try again." : null}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={programme?.updatedAt}>
            {programme ? (
              <CmsStatusActions
                status={programme.status}
                publish={publishProgramme.bind(null, programme.id)}
                unpublish={unpublishProgramme.bind(null, programme.id)}
                archive={archiveProgramme.bind(null, programme.id)}
              />
            ) : null}
          </StatusCard>
          {programme ? (
            <PreviewPanel
              title={programme.title}
              lines={[
                { label: "Slug", value: programme.slug },
                { label: "Strategies", value: String(programme.strategies.length) },
                {
                  label: "Published",
                  value: programme.publishedAt
                    ? programme.publishedAt.toLocaleDateString("en-GB")
                    : "Never",
                },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="The programme name, summary and full description.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. HIV Prevention"
              defaultValue={programme?.title ?? ""}
            />
          </Field>
          <Field label="Slug" optional hint="Generated from the title if left empty.">
            <input
              name="slug"
              placeholder="hiv-prevention"
              defaultValue={programme?.slug ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={programme?.sortOrder ?? 0}
            />
          </Field>
          <Field label="Summary" optional full hint="Shown on programme cards.">
            <textarea
              name="summary"
              placeholder="One or two sentences about this programme"
              defaultValue={programme?.summary ?? ""}
              style={{ minHeight: 80 }}
            />
          </Field>
          <Field label="Body" full hint={RICH_TEXT_HINT}>
            <textarea
              name="body"
              required
              placeholder="Describe the programme in full…"
              defaultValue={programme?.body ?? ""}
              style={{ minHeight: 220 }}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Strategies"
          description="Shown in this order. Leave a title blank to drop that row on save; save and reopen to get another empty row."
          single
        >
          {strategies.map((row, index) => (
            <div className={styles.strategyBlock} key={`${row.id}-${index}`}>
              <Field label="Strategy title" optional={row.id === "blank"}>
                <input
                  name="strategyTitle"
                  placeholder="e.g. Community outreach"
                  defaultValue={row.title}
                />
              </Field>
              <Field label="Strategy body" optional>
                <textarea
                  name="strategyBody"
                  placeholder="What this strategy involves"
                  defaultValue={row.body ?? ""}
                  style={{ minHeight: 72 }}
                />
              </Field>
            </div>
          ))}
        </FormSection>

        <FormFooter
          cancelHref="/admin/programmes"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
