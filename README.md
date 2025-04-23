
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Grupo-26-FIAP_hackaton-file-manager&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Grupo-26-FIAP_hackaton-file-manager)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Grupo-26-FIAP_hackaton-file-manager&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Grupo-26-FIAP_hackaton-file-manager)

# Hackaton File Manager

Serviço responsável pela gestão e processamento de arquivos no ecossistema do Tech Challenge FIAP. Este projeto faz parte da arquitetura de microsserviços do Grupo 26.

## ✨ Tecnologias

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [AWS SQS](https://aws.amazon.com/pt/sqs/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)

## 📁 Estrutura de Pastas

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── domain/
│   └── file/
│       ├── file.service.ts
│       ├── file.repository.ts
├── infrastructure/
│   ├── storage/
│   │   └── s3.service.ts
│   ├── queue/
│   │   └── consumer/
│   │       └── sqs.consumer.ts
└── main.ts
```

## 🚀 Funcionalidades

- Recebimento e armazenamento de arquivos no S3.
- Processamento de mensagens da fila SQS relacionadas a arquivos.
- Arquitetura em camadas (Controller, Service, Repository).
- Preparado para ambientes de produção e Docker.

## 🔧 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Grupo-26-FIAP/hackaton-file-manager.git
cd hackaton-file-manager
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` com as seguintes informações:

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=seu-bucket
AWS_ACCESS_KEY_ID=sua_chave_aws
AWS_SECRET_ACCESS_KEY=sua_secreta_aws

AWS_SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/sua-fila
```

### 4. Rodando a aplicação

```bash
npm run start:dev
```

### 5. Rodando com Docker

```bash
docker build -t hackaton-file-manager .
docker-compose up
```

## 🧪 Testes

```bash
npm run test
```

## 📦 Produção

A aplicação está preparada para ser compilada e executada em ambiente de produção. Use:

```bash
npm run build
node dist/main
```

## 👥 Contribuidores

- Grupo 26 – FIAP Tech Challenge

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
