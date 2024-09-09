import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../lib/mongodb';
import Rifa from '../../models/Rifa';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectMongo();

      const rifas = await Rifa.find({});
      const numerosComprados = rifas.flatMap((rifa) => rifa.numeros);

      res.status(200).json(numerosComprados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar números comprados' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}