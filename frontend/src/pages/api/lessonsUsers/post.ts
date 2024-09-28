import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, lessonId, progress, isCompleted } = req.body;

    try {
        const lessonUser = await prisma.lessonsUsers.upsert({
            where: {
              userId_lessonId: {
                userId: Number(userId),
                lessonId: Number(lessonId),
              },
            },
            update: {
              progress: Number(progress),
              isCompleted: Boolean(isCompleted),
            },
            create: {
              userId: Number(userId),
              lessonId: Number(lessonId),
              progress: Number(progress),
              isCompleted: Boolean(isCompleted),
            },
          });

      res.status(200).json(lessonUser);
    } catch (error) {
      res.status(500).json({ message: 'Error saving progress' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}