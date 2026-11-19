import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage, AsideCard } from "../_components/form/form-page";
import { updateAdminEmail, updateAdminPassword } from "./actions";
import { PasswordInput } from "./password-input";
import styles from "./account.module.css";

type Props = { searchParams: Promise<{ error?: string; saved?: string }> };

const ERRORS: Record<string, string> = {
  "email-validation": "Enter a valid email and your current password.",
  "email-taken": "That email is already in use.",
  "current-password": "Current password is incorrect.",
  "password-validation": "New password must be at least 10 characters.",
  "password-mismatch": "New password and confirmation do not match.",
};

export default async function AccountPage({ searchParams }: Props) {
  const session = await requireAdmin();
  const query = await searchParams;
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, updatedAt: true },
  });
  if (!admin) {
    return null;
  }

  return (
    <FormPage
      backHref="/admin"
      backLabel="Dashboard"
      title="Account"
      description="Update the sign-in email and password for this admin account."
      error={query.error ? ERRORS[query.error] ?? "Could not save." : null}
      saved={query.saved === "password" || query.saved === "email"}
      aside={
        <AsideCard title="This account">
          <ul className={styles.asideList}>
            <li>
              Signed in as <strong>{admin.name}</strong>
            </li>
            <li>Email: {admin.email}</li>
            <li>
              Changing email signs you out so the next login uses the new address.
            </li>
            <li>Password changes take effect immediately.</li>
          </ul>
        </AsideCard>
      }
    >
      <form action={updateAdminEmail} className={formClass}>
        <FormSection
          title="Email"
          description="Used to sign in. Confirm with your current password."
          single
        >
          <Field label="New email" full>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue={admin.email}
            />
          </Field>
          <Field label="Current password" full>
            <PasswordInput
              id="email-current-password"
              name="currentPassword"
              autoComplete="current-password"
            />
          </Field>
        </FormSection>
        <FormFooter cancelHref="/admin" submitLabel="Update email" />
      </form>

      <form action={updateAdminPassword} className={formClass}>
        <FormSection
          title="Password"
          description="At least 10 characters. Confirm with your current password."
          single
        >
          <Field label="Current password" full>
            <PasswordInput
              id="password-current"
              name="currentPassword"
              autoComplete="current-password"
            />
          </Field>
          <Field label="New password" full>
            <PasswordInput
              id="password-new"
              name="newPassword"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm new password" full>
            <PasswordInput
              id="password-confirm"
              name="confirmPassword"
              autoComplete="new-password"
            />
          </Field>
        </FormSection>
        <FormFooter cancelHref="/admin" submitLabel="Update password" />
      </form>
    </FormPage>
  );
}
