import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { Transacao } from './schemas/transacao.schema';

@Injectable()
export class TransacoesService {
  constructor(@InjectModel(Transacao.name) private readonly transacaoModel: Model<Transacao>) {}

  async cadastrar(dados: CriarTransacaoDto) {
    const transacao = new this.transacaoModel(dados);
    return transacao.save();
  }

  async listarComMetricas() {
    const historico = await this.transacaoModel.find().sort({ createdAt: -1 }).lean().exec();

    // A lógica das métricas fica obrigatoriamente no Service, conforme o enunciado.
    // Trabalhar com centavos evita erros comuns de ponto flutuante na soma.
    let saldoCentavos = 0;
    let despesasCentavos = 0;
    let impulsoCentavos = 0;

    for (const transacao of historico) {
      const centavos = Math.round(transacao.valor * 100);
      if (transacao.tipo === 'receita') {
        saldoCentavos += centavos;
      } else {
        saldoCentavos -= centavos;
        despesasCentavos += centavos;
        if (transacao.consumoConsciente === false) {
          impulsoCentavos += centavos;
        }
      }
    }

    return {
      historico,
      metricas: {
        saldoTotal: saldoCentavos / 100,
        totalDespesas: despesasCentavos / 100,
        totalGastoImpulso: impulsoCentavos / 100,
      },
    };
  }
}
