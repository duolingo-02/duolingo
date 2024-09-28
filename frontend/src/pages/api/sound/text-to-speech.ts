import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, language = 'en' } = req.body;

    try {
      // Replace this with your actual text-to-speech API call
      const response = await axios.post('https://your-tts-api-endpoint.com', {
        text,
        language,
      });

      res.status(200).json({ url: response.data.audioUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error generating text-to-speech' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}