import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  cadastrar(@Body() dados: CriarTransacaoDto) {
    return this.transacoesService.cadastrar(dados);
  }

  @Get()
  listarComMetricas() {
    return this.transacoesService.listarComMetricas();
  }
}
