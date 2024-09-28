import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, languageId } = req.query;

  if (req.method === 'GET') {
    try {
      const progress = await prisma.lessonsUsers.findMany({
        where: {
          userId: Number(userId),
          lesson: {
            languageId: Number(languageId),
          },
        },
      });

      res.status(200).json(progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Error fetching progress data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}