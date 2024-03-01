import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { iCategoria } from './interfaces/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  private logger = new Logger(CategoriasController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: iCategoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(categoria)}`);

    try {
      await this.categoriasService.criarCategoria(categoria);
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

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      if (_id) {
        return await this.categoriasService.consultarCategoriaPeloId(_id);
      } else {
        return await this.categoriasService.consultarCategorias();
      }
    } finally {
      await channel.ack(originMessage);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const categoria: iCategoria = data.categoria;

      await this.categoriasService.atualizarCategoria(_id, categoria);
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
