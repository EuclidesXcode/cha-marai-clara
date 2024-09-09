import mongoose from 'mongoose';

const { Schema } = mongoose;

const rifaSchema = new Schema({
  nome: { type: String, required: true },
  numeros: { type: [Number], required: true },
});

const Rifa = mongoose.models.Rifa || mongoose.model('rifas', rifaSchema);

export default Rifa;