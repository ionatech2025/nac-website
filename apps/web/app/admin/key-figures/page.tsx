import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { Field, FormSection, formClass } from "../_components/form/form-fields";
import { FormPage } from "../_components/form/form-page";
import styles from "../cms.module.css";
import local from "./key-figures.module.css";
import {
  createKeyFigure,
  deleteKeyFigure,
  updateKeyFigure,
} from "./actions";

type Props = { searchParams: Promise<{ error?: string; saved?: string }> };

export default async function KeyFiguresPage({ searchParams }: Props) {
  await requireAdmin();
  const query = await searchParams;
  const figures = await prisma.keyFigure.findMany({
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
  });

  return (
    <FormPage
      backHref="/admin"
      backLabel="Dashboard"
      title="Key figures"
      description="Labels and values shown on About / homepage areas."
      error={query.error ? "Label and value are required." : null}
      saved={query.saved === "1"}
    >
      <div className={formClass}>
        <form action={createKeyFigure}>
          <FormSection
            title="Add figure"
            description="A short statistic, e.g. “15+ youth spaces”."
          >
            <Field label="Label">
              <input name="label" required placeholder="Youth spaces" />
            </Field>
            <Field label="Value">
              <input name="value" required placeholder="15+" />
            </Field>
            <Field label="Sort order" hint="Lower numbers appear first.">
              <input
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={0}
                style={{ maxWidth: 160 }}
              />
            </Field>
            <div className={local.addActions}>
              <button type="submit" className={styles.button}>
                Add figure
              </button>
            </div>
          </FormSection>
        </form>

        <FormSection
          title="Existing figures"
          description="Edit a row and click Update. Changes go live immediately."
          single
        >
          {figures.length === 0 ? (
            <p className={styles.empty}>No key figures yet.</p>
          ) : (
            <div className={local.list}>
              {figures.map((figure) => (
                <div key={figure.id} className={local.row}>
                  <form
                    action={updateKeyFigure.bind(null, figure.id)}
                    className={local.rowForm}
                  >
                    <Field label="Label">
                      <input name="label" required defaultValue={figure.label} />
                    </Field>
                    <Field label="Value">
                      <input name="value" required defaultValue={figure.value} />
                    </Field>
                    <Field label="Order">
                      <input
                        name="sortOrder"
                        type="number"
                        min={0}
                        defaultValue={figure.sortOrder}
                      />
                    </Field>
                    <button type="submit" className={styles.ghostButton}>
                      Update
                    </button>
                  </form>
                  <form action={deleteKeyFigure.bind(null, figure.id)}>
                    <button type="submit" className={styles.dangerButton}>
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </FormSection>
      </div>
    </FormPage>
  );
}
