import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransacoesService } from './transacoes.service';
import { Transacao } from './schemas/transacao.schema';

describe('TransacoesService', () => {
  it('calcula saldo, despesas e gastos por impulso no Service', async () => {
    const historico = [
      { descricao: 'Salário', tipo: 'receita', valor: 2500, categoria: 'Renda', consumoConsciente: true },
      { descricao: 'Energia', tipo: 'despesa', valor: 150.50, categoria: 'Moradia', consumoConsciente: true },
      { descricao: 'Compra por impulso', tipo: 'despesa', valor: 79.90, categoria: 'Lazer', consumoConsciente: false },
    ];
    const exec = jest.fn().mockResolvedValue(historico);
    const sort = jest.fn().mockReturnValue({ lean: () => ({ exec }) });
    const model = { find: jest.fn().mockReturnValue({ sort }) };

    const modulo = await Test.createTestingModule({
      providers: [TransacoesService, { provide: getModelToken(Transacao.name), useValue: model }],
    }).compile();
    const service = modulo.get(TransacoesService);
    const resposta = await service.listarComMetricas();

    expect(resposta.historico).toEqual(historico);
    expect(resposta.metricas).toEqual({
      saldoTotal: 2269.60,
      totalDespesas: 230.40,
      totalGastoImpulso: 79.90,
    });
  });

  it('retorna métricas zeradas quando não há transações', async () => {
    const model = { find: () => ({ sort: () => ({ lean: () => ({ exec: async () => [] }) }) }) };
    const modulo = await Test.createTestingModule({
      providers: [TransacoesService, { provide: getModelToken(Transacao.name), useValue: model }],
    }).compile();
    const resposta = await modulo.get(TransacoesService).listarComMetricas();
    expect(resposta).toEqual({
      historico: [],
      metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 },
    });
  });
});
