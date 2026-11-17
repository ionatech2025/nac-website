import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import {
  COMPLAINT_RETENTION_DAYS,
  complaintDaysLeft,
  complaintDeleteOn,
  purgeExpiredComplaints,
} from "../../../../lib/complaint-retention";
import {
  COMPLAINT_STATUSES,
  COMPLAINT_STATUS_LABEL,
  formatComplaintDate,
} from "../../../../lib/complaint-filters";
import { ConfirmDelete } from "../../_components/confirm-delete";
import { AsideCard, FormPage } from "../../_components/form/form-page";
import layout from "../../_components/form/form-layout.module.css";
import detail from "../../_components/inbox/detail.module.css";
import { deleteComplaint, saveComplaintNotes, setComplaintStatus } from "../actions";
import { ComplaintStatusPill } from "../complaint-list";
import listStyles from "../complaints.module.css";
import styles from "./complaint-detail.module.css";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd className={value ? undefined : styles.notProvided}>
        {value ?? "Not provided"}
      </dd>
    </div>
  );
}

export default async function ComplaintDetailPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID_RE.test(id)) notFound();
  await purgeExpiredComplaints();
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) notFound();

  const submitted = formatComplaintDate(complaint.submittedOn, true);

  return (
    <FormPage
      backHref="/admin/complaints"
      backLabel="Complaints"
      title={complaint.category ?? "Complaint"}
      description={`Submitted ${submitted} · anonymous`}
      saved={Boolean(sp.saved)}
      error={sp.error === "notes" ? "Notes must be 5,000 characters or fewer." : null}
      aside={
        <>
          <AsideCard title="Status">
            <div className={styles.segmented} role="group" aria-label="Complaint status">
              {COMPLAINT_STATUSES.map((s) => {
                const active = complaint.status === s;
                return (
                  <form key={s} action={setComplaintStatus.bind(null, complaint.id, s)}>
                    <button
                      type="submit"
                      className={active ? `${styles.segment} ${styles.segmentActive}` : styles.segment}
                      aria-pressed={active}
                      disabled={active}
                    >
                      {COMPLAINT_STATUS_LABEL[s]}
                    </button>
                  </form>
                );
              })}
            </div>
            <p className={styles.small}>
              New → Reviewed when you have read it; Closed when follow-up is done.
            </p>
          </AsideCard>

          <AsideCard title="Private notes">
            <form action={saveComplaintNotes.bind(null, complaint.id)} className={styles.notesForm}>
              <textarea
                name="adminNotes"
                className={styles.notes}
                maxLength={5000}
                defaultValue={complaint.adminNotes ?? ""}
                placeholder="Internal follow-up, actions taken, who was consulted…"
                aria-label="Private notes"
              />
              <button type="submit" className={styles.saveNotes}>
                Save notes
              </button>
            </form>
            <p className={styles.small}>Only visible to admins. Never shown publicly.</p>
          </AsideCard>

          <AsideCard title="Retention">
            <dl className={layout.meta}>
              <div>
                <dt>Auto-deletes on</dt>
                <dd>{formatComplaintDate(complaintDeleteOn(complaint.submittedOn))}</dd>
              </div>
              <div>
                <dt>Days left</dt>
                <dd>{complaintDaysLeft(complaint.submittedOn)}</dd>
              </div>
            </dl>
            <p className={styles.small}>
              Complaints and their notes are deleted {COMPLAINT_RETENTION_DAYS} days after
              submission. You can delete earlier if it is no longer needed.
            </p>
            <div className={layout.actions}>
              <ConfirmDelete
                action={deleteComplaint.bind(null, complaint.id)}
                warning="The complaint and its notes will be removed for good."
              />
            </div>
          </AsideCard>
        </>
      }
    >
      <div className={listStyles.privacy}>
        <Lock size={16} aria-hidden />
        <span>
          Only the details below were submitted. There is no way to identify or contact
          the complainant.
        </span>
      </div>

      <article className={detail.card}>
        <header className={styles.head}>
          Complaint
          <ComplaintStatusPill status={complaint.status} />
        </header>
        <pre className={detail.body}>{complaint.description}</pre>
        <dl className={styles.facts}>
          <Fact label="Category" value={complaint.category} />
          <Fact
            label="Incident date"
            value={complaint.incidentDate ? formatComplaintDate(complaint.incidentDate) : null}
          />
          <Fact label="Programme or place" value={complaint.programmeOrPlace} />
          <Fact label="Submitted on" value={submitted} />
        </dl>
      </article>
    </FormPage>
  );
}
