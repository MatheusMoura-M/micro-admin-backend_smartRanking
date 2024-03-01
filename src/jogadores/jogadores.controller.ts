import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { iJogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  private logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: iJogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);

      await this.jogadoresService.criarJogador(jogador);
      await channel.ack(originMessage);
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originMessage);
      }
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      if (_id) {
        return await this.jogadoresService.consultarJogadorPeloId(_id);
      } else {
        return await this.jogadoresService.consultarTodosJogadores();
      }
    } finally {
      await channel.ack(originMessage);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);

      const _id: string = data.id;
      const jogador: iJogador = data.jogador;

      await this.jogadoresService.atualizarJogador(_id, jogador);
      await channel.ack(originMessage);
    } catch (err) {
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originMessage);
      }
    }
  }

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      await this.jogadoresService.deletarJogador(_id);
      await channel.ack(originMessage);
    } catch (err) {
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originMessage);
      }
    }
  }
}
