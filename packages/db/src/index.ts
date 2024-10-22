import { PrismaClient as MongoPrismaClient } from "@prisma/mongo-client";
import { PrismaClient as SQLitePrismaClient } from "@prisma/sqlite-client";

export const createClient = <T extends "mongo" | "sqlite">(
  type: T,
): typeof type extends "mongo" ? MongoPrismaClient : SQLitePrismaClient => {
  if (type === "mongo") return new MongoPrismaClient() as never;
  else if (type === "sqlite") return new SQLitePrismaClient() as never;
  else throw new TypeError("PrismaClient not supported or found");
};
