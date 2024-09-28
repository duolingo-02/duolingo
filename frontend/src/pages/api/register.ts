// pages/api/users/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import multer from "multer";
import fs from 'fs';

const saltRounds = 10;
const domain = "/uploads/";

const upload = multer({
  dest: './public/uploads/',
});

const prisma = new PrismaClient();

const uploadMiddleware = upload.single('file');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

interface ExtendedNextApiRequest extends NextApiRequest {
  file?: Express.Multer.File;
}

export default async function userSignup(req: ExtendedNextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, email, passwordHash, role } = req.body;
    const file = req.body.file ? JSON.parse(req.body.file) : null;

    console.log("Received data:", { username, email, role, file });

    if (!username || !email || !passwordHash || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["user", "admin", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (passwordHash.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);
    
    let profilePicture = null;
    if (file) {
      const buffer = Buffer.from(file.data.split(',')[1], 'base64');
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `./public/uploads/${filename}`;
      await fs.promises.writeFile(filePath, buffer);
      profilePicture = `${domain}${filename}`;
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role,
        profilePicture: profilePicture || "hello"
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}