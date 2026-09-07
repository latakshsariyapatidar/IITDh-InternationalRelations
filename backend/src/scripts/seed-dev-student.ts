import "dotenv/config";
import { prisma } from "../config/prisma.js";

// A fixed, well-known Student row used only for local Postman/Newman testing.
// The Postman collection crafts a JWT with this exact studentId (signed
// using your local JWT_SECRET) so outbound-application routes can be
// exercised without a real Google Sign-In flow. Safe to re-run — upsert.
export const DEV_STUDENT_ID = "99999999-9999-9999-9999-999999999999";

async function main() {
  const student = await prisma.student.upsert({
    where: { id: DEV_STUDENT_ID },
    update: {},
    create: {
      id: DEV_STUDENT_ID,
      email: "dev.student@iitdh.ac.in",
      name: "Dev Test Student",
      googleSub: "dev-test-google-sub",
    },
  });
  console.log("[SEED-DEV-STUDENT] Ready:", student.id, student.email);
}

main()
  .catch((e) => {
    console.error("[SEED-DEV-STUDENT] Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
