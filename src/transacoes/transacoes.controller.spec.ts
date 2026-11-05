import { Test } from '@nestjs/testing';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';

describe('TransacoesController', () => {
  it('encaminha GET /transacoes ao service', async () => {
    const resultado = { historico: [], metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 } };
    const service = { listarComMetricas: jest.fn().mockResolvedValue(resultado), cadastrar: jest.fn() };
    const modulo = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [{ provide: TransacoesService, useValue: service }],
    }).compile();
    const controller = modulo.get(TransacoesController);
    await expect(controller.listarComMetricas()).resolves.toEqual(resultado);
  });
});
