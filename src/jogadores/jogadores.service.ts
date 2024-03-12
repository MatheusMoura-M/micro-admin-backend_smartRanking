import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { iJogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<iJogador>,
  ) {}

  private readonly logger = new Logger();

  async criarJogador(jogador: iJogador): Promise<iJogador> {
    try {
      const { email } = jogador;

      const jogadorEncontrado = await this.jogadorModel
        .findOne({ email })
        .exec();

      if (jogadorEncontrado) {
        throw new BadRequestException(
          `Jogador com e-mail '${email}' já cadastrado`,
        );
      }

      const jogadorCriado = await this.jogadorModel.create(jogador);

      return jogadorCriado;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async atualizarJogador(_id: string, jogador: iJogador): Promise<void> {
    try {
      await this.jogadorModel
        .findOneAndUpdate({ _id }, { $set: jogador })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodosJogadores(): Promise<iJogador[]> {
    try {
      return await this.jogadorModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarJogadorPeloId(_id: string): Promise<iJogador> {
    try {
      return await this.jogadorModel
        .findById({ _id })
        .populate('categoria')
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletarJogador(_id: string): Promise<void> {
    try {
      await this.jogadorModel.findByIdAndDelete({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
