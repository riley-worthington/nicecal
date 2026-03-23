import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === "production") {
  prisma = createClient();
} else {
  if (!global.__prisma) {
    global.__prisma = createClient();
  }
  prisma = global.__prisma;
}

export { prisma };
