import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query;
  const prisma = new PrismaClient();
  try {
    switch (action) {
      case "create":
        await prisma.$executeRaw`CREATE DATABASE duoLingo;`;
        return res.status(200).json({ name: "DB Created" });
      case "drop":
        await prisma.$executeRaw`DROP DATABASE duoLingo;`;
        return res.status(200).json({ name: "DB dropped" });
      default:
        res.status(404).json({ error: "Invalid action" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error dropping DB" });
  } finally {
    await prisma.$disconnect();
  }
}
