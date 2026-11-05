# Controle Financeiro Pessoal 

API RESTful **NestJS + MongoDB Atlas**, baseada no enunciado da atividade extensionista.

## Instalar e executar

Requisitos: Node.js 20 ou 22, npm, banco MongoDB Atlas (cluster e usuário com permissão).

1. Abra um terminal na pasta raiz do projeto.
2. Execute `npm install`.
3. Copie `.env.example` para `.env`.
4. Preencha a variável `MONGODB_URI` no `.env` com a connection string do Atlas, usando o banco `controle_financeiro`. Atenção: configure o usuário de banco, IP permitido e senha com caracteres especiais codificados em URL.
5. Execute `npm run start:dev`.
6. Use `http://localhost:3000/transacoes` em Postman, Insomnia ou PowerShell.

### POST /transacoes

```json
{
  "descricao": "Conta de Luz",
  "valor": 180.50,
  "tipo": "despesa",
  "categoria": "Moradia",
  "consumoConsciente": true
}
```

Outros registros úteis:

```json
{"descricao":"Salário","valor":3000,"tipo":"receita","categoria":"Renda","consumoConsciente":true}
```

```json
{"descricao":"Compra por impulso","valor":120.90,"tipo":"despesa","categoria":"Lazer","consumoConsciente":false}
```

### GET /transacoes

Retorna `historico` e `metricas`, com os campos `saldoTotal`, `totalDespesas` e `totalGastoImpulso`, calculados no `TransacoesService`.

Com os três lançamentos acima, os valores esperados são:

```json
{
  "metricas": {
    "saldoTotal": 2698.60,
    "totalDespesas": 301.40,
    "totalGastoImpulso": 120.90
  }
}
```

(A resposta real também contém `historico` com os documentos completos do MongoDB.)

## Executar testes

- `npm test` — testes unitários sem banco.
- `npm run test:e2e` — testes HTTP sem banco, com modelo simulado.
- `npm run build` — compilação do NestJS.

