import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../lib/mongodb';
import Rifa from '../../models/Rifa';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectMongo();

      const { nome, numeros } = req.body;

      const rifa = new Rifa({ nome, numeros });
      await rifa.save();

      res.status(200).json({ message: 'Rifa salva com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao salvar rifa' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}