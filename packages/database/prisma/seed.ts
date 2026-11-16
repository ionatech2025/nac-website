import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
