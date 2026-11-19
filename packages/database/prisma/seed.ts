import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { ensureSiteSettings } from "../src/public-site-settings";
import { loadStarterYouthSpaces } from "../src/youth-space-starter";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@nacuganda.org";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-now-please";
  const name = process.env.ADMIN_NAME ?? "Site Admin";

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const passwordHash = await hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Seeded AdminUser ${admin.email} (role=${admin.role})`);

  const youth = await loadStarterYouthSpaces(prisma);
  console.log(
    `Youth spaces: ${youth.regions} new regions, ${youth.spaces} new draft spaces`,
  );

  const settings = await ensureSiteSettings(prisma);
  console.log(`Site settings: ${settings} new rows (contact / social / external)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
