import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesModule } from './transacoes/transacoes.module';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI não configurada. Crie o arquivo .env a partir do .env.example');
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { serverSelectionTimeoutMS: 10000 }),
    TransacoesModule,
  ],
})
export class AppModule {}
