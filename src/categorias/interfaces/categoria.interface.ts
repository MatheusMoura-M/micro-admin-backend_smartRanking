import { Document } from 'mongoose';

export interface iEvento {
  nome: string;
  operacao: string;
  valor: number;
}

export interface iCategoria extends Document {
  readonly categoria: string;
  descricao: string;
  eventos: Array<iEvento>;
}
