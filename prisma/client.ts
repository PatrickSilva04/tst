import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Debug Prisma queries
});

// Test database connection
prisma.$connect()
  .then(() => console.log("Prisma connected to database"))
  .catch((error) => console.error("Prisma connection error:", error));

export default prisma;