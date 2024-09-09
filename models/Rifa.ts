import mongoose, { Document, Model, Schema } from 'mongoose';

interface IRifa extends Document {
  nome: string;
  numeroSelecionado: number;
}

const RifaSchema: Schema = new Schema({
  nome: { type: String, required: true },
  numeroSelecionado: { type: Number, required: true },
});

const Rifa: Model<IRifa> = mongoose.models.Rifa || mongoose.model<IRifa>('Rifa', RifaSchema);

export default Rifa;