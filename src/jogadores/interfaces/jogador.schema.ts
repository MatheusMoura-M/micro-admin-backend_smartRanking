import { Schema } from 'mongoose';

export const JogadorSchema = new Schema(
  {
    email: { type: String, unique: true },
    telefoneCelular: { type: String },
    nome: { type: String },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    ranking: { type: String },
    posicaoRanking: { type: Number },
    urlFotoJogador: { type: String },
  },
  { timestamps: true, collection: 'jogadores' },
);
