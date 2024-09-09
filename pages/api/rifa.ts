import { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../lib/mongodb';
import Rifa from '../../models/Rifa';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nome, numeroSelecionado } = req.body;

    try {
      await connectMongo();
      const novaRifa = new Rifa({ nome, numeroSelecionado });
      await novaRifa.save();
      res.status(201).json({ message: 'Número selecionado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
    }
  } else if (req.method === 'GET') {
    try {
      await connectMongo();
      const rifas = await Rifa.find();
      res.status(200).json(rifas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar rifas' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}