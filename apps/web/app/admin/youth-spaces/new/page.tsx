import Link from "next/link";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import adminStyles from "../../admin.module.css";
import styles from "../../cms.module.css";
import { SpaceForm } from "../space-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewYouthSpacePage({ searchParams }: Props) {
  await requireAdmin();
  const { error } = await searchParams;
  const regions = await prisma.youthRegion.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  if (regions.length === 0) {
    return (
      <section className={adminStyles.panel}>
        <h1>New youth space</h1>
        <p className={styles.empty}>
          Every space belongs to a region. <Link href="/admin/youth-spaces/regions">Add a region</Link>{" "}
          first, or load the starter spaces from the <Link href="/admin/youth-spaces">Youth spaces</Link> page.
        </p>
      </section>
    );
  }

  return <SpaceForm regions={regions} error={error} />;
}
