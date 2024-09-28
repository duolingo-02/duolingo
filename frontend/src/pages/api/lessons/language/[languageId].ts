import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { languageId } = req.query;
  console.log('API route called:', { languageId });

  if (req.method === 'GET') {
    try {
      console.log('Fetching lessons for language:', languageId);
      const lessons = await prisma.lesson.findMany({
        where: {
          languageId: Number(languageId),
        },
        orderBy: {
          id: 'asc',
        },
      });

      console.log('Lessons fetched:', lessons.length);
      res.status(200).json(lessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ message: 'Error fetching lessons data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}