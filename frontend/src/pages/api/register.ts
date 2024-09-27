// pages/api/users/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import multer from "multer";

const saltRounds = 10;
const domain = "http://127.0.0.1:1274/uploads/";

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/', // Change to your upload directory
});

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

// Wrap the API handler to use multer
const uploadMiddleware = upload.single('file');

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


declare module "next" {
    interface NextApiRequest {
      file?: Express.Multer.File; // Add this line to extend the NextApiRequest with file
    }
  }

  
export default async function userSignup(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body,"dataaaaaaaa")
  
  try {
    await runMiddleware(req, res, uploadMiddleware);

    if (req.method !== "POST") return res.status(405).end();

    const { username, email, passwordHash, role } = req.body;
    console.log(username,email)
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
    const profilePicture = req.file ? `${domain}${req.file.filename}` : null;

    const user = await prisma.user.create({
      data: {
        username,
        email,  
        passwordHash: hashedPassword,
        role,
        profilePicture:"hello"
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};