import styles from "./complaint-intro.module.css";

export function ComplaintIntro() {
  return (
    <section className={styles.section} aria-labelledby="complaint-intro-heading">
      <h2 id="complaint-intro-heading" className={styles.heading}>
        How anonymous complaints work
      </h2>
      <ul className={styles.list}>
        <li>
          This form does <strong>not</strong> ask for your name, email, phone, or
          any other identity details.
        </li>
        <li>
          Do not include personal contact details in the description if you want
          to stay anonymous.
        </li>
        <li>
          Complaints are stored for review and are{" "}
          <strong>deleted automatically after 30 days</strong>.
        </li>
        <li>
          There is no email acknowledgement. After you submit, you will only see
          a confirmation on this page.
        </li>
        <li>
          File attachments are not accepted in this version of the form.
        </li>
      </ul>
    </section>
  );
}
