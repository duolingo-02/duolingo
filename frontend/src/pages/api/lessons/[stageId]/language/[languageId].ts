import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stageId, languageId } = req.query;
  console.log('API route called:', { stageId, languageId });

  if (req.method === 'GET') {
    try {
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: Number(stageId),
          languageId: Number(languageId),
        },
        include: {
          questions: true,
        },
      });

      if (!lesson) {
        console.log('Lesson not found');
        return res.status(404).json({ message: 'Lesson not found' });
      }

      console.log('Lesson found:', lesson);
      res.status(200).json(lesson);
    } catch (error) {
      console.error('Error fetching lesson data:', error);
      res.status(500).json({ message: 'Error fetching lesson data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}