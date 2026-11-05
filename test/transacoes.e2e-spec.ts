import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import request from 'supertest';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';
import { Transacao } from '../src/transacoes/schemas/transacao.schema';

describe('Transacoes API (e2e, banco simulado)', () => {
  let app: INestApplication;
  const historico: any[] = [];

  class ModeloEmMemoria {
    constructor(private readonly dados: any) {}
    async save() { historico.push(this.dados); return this.dados; }
    static find() {
      return { sort: () => ({ lean: () => ({ exec: async () => historico }) }) };
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [TransacoesService, { provide: getModelToken(Transacao.name), useValue: ModeloEmMemoria }],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('POST cadastra e GET consolida', async () => {
    await request(app.getHttpServer()).post('/transacoes').send({
      descricao: 'Salário', valor: 2000, tipo: 'receita', categoria: 'Renda', consumoConsciente: true,
    }).expect(201);
    await request(app.getHttpServer()).post('/transacoes').send({
      descricao: 'Delivery', valor: 65, tipo: 'despesa', categoria: 'Alimentação', consumoConsciente: false,
    }).expect(201);
    const resposta = await request(app.getHttpServer()).get('/transacoes').expect(200);
    expect(resposta.body.historico).toHaveLength(2);
    expect(resposta.body.metricas).toEqual({ saldoTotal: 1935, totalDespesas: 65, totalGastoImpulso: 65 });
  });

  it('rejeita tipo inválido', async () => {
    await request(app.getHttpServer()).post('/transacoes').send({
      descricao: 'Teste', valor: 10, tipo: 'transferencia', categoria: 'Outros', consumoConsciente: true,
    }).expect(400);
  });
});
