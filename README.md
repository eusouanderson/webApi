# Sistema Web de Cálculo de IMC (Índice de Massa Corporal)

> Sistema web full-stack desenvolvido com arquitetura orientada a domínio (Domain-Driven/Feature-Based), monorepo pnpm, TypeScript estrito, backend REST em Hono e interface moderna em React com Tailwind CSS.

---

## 1. Descrição do Projeto

Este projeto é uma aplicação web completa e profissional cujo objetivo funcional é realizar a coleta, validação e cálculo do **Índice de Massa Corporal (IMC)**, bem como fornecer a classificação diagnóstica de acordo com faixas nutricionais padronizadas.

Embora desenvolvido no contexto de uma atividade acadêmica de Engenharia de Software, o sistema adota padrões rigorosos de software de produção:

- **Clean Architecture & Separação Estrita de Responsabilidades**: O frontend é exclusivamente responsável pela interface, acessibilidade e experiência do usuário; o cálculo matemático e as regras de negócio de classificação ocorrem exclusivamente no backend.
- **Tipagem Forte de Ponta a Ponta**: Uso de TypeScript com `strict: true` e inferência direta de schemas com **Zod**.
- **Contratos Compartilhados**: Schemas e tipos de entrada/saída centralizados no pacote `@repo/contracts`.
- **Tratamento Centralizado de Erros**: Respostas HTTP previsíveis com envelopes padronizados e sem vazamento de stack traces.
- **Testes Automatizados**: Suíte completa de testes unitários e de integração com Vitest e React Testing Library cobrindo 100% dos fluxos e limites matemáticos.

---

## 2. Objetivo Acadêmico

- Demonstrar a aplicação prática de **Clean Architecture** e **Feature-Driven Design** em ambientes TypeScript.
- Evitar a dispersão de regras de negócio em componentes de interface (proibição de cálculos no client-side).
- Praticar o desenvolvimento baseado em contratos compartilhados em monorepo com `pnpm workspaces`.
- Garantir cobertura rigorosa de testes cobrindo limites estritos de faixas numéricas (`18.5`, `24.9`, `30.0`), payloads malformados e acessibilidade (`ARIA`).

---

## 3. Tecnologias Utilizadas

### Backend (`apps/api`)

- **Node.js** (v20+ / v22+)
- **TypeScript 5.8** (Strict Mode, ES2022)
- **Hono** (Framework HTTP minimalista e performático)
- **@hono/node-server** (Adaptador de execução Node.js)
- **Zod 3.24** (Validação e sanitização estrita de dados)
- **Vitest 3.0** (Runner de testes rápidos para unitários e integração)

### Frontend (`apps/web`)

- **React 18** com **Vite 6**
- **TypeScript 5.8** (Strict Mode)
- **Tailwind CSS 3.4** (Design system utilitário com tokens customizados)
- **React Hook Form** + **@hookform/resolvers/zod** (Gerenciamento performático e acessível de formulários)
- **React Router 6** (Roteamento baseado em layouts)
- **Lucide React** (Ícones SVG limpos e sem overhead)
- **Vitest**, **Testing Library (React & DOM)**, **jsdom**, **user-event** (Testes comportamentais e acessibilidade)

### Pacotes Compartilhados (`packages/`)

- `@repo/contracts`: Schemas Zod, tipos TypeScript e constantes de faixas do IMC.
- `@repo/config`: Configurações compartilhadas de TypeScript para Node e Web.

### Ferramentas de Engenharia

- **pnpm 12** (Gerenciador de dependências e workspace monorepo)
- **ESLint 9/10 Flat Config** + **typescript-eslint**
- **Prettier** (Padronização e formatação de código)

---

## 4. Arquitetura e Estrutura de Diretórios

O projeto adota uma estrutura em **Monorepo** com separação estrita por domínio:

```text
webApi/
├── apps/
│   ├── api/                                # Backend REST API (Hono)
│   │   ├── src/
│   │   │   ├── common/                     # Utilitários compartilhados do backend
│   │   │   │   ├── errors/                 # AppError customizado
│   │   │   │   └── middlewares/            # ErrorHandler e NotFoundHandler centralizados
│   │   │   ├── config/                     # Variáveis de ambiente validadas com Zod
│   │   │   ├── modules/
│   │   │   │   └── bmi/                    # Domínio: Cálculo de IMC
│   │   │   │       ├── bmi.constants.ts    # Constantes e faixas numéricas do IMC
│   │   │   │       ├── bmi.types.ts        # Tipagem forte do domínio
│   │   │   │       ├── bmi.schema.ts       # Schemas Zod de validação
│   │   │   │       ├── bmi.service.ts      # Regra pura de cálculo e classificação
│   │   │   │       ├── bmi.controller.ts   # Orquestração HTTP e parsing da requisição
│   │   │   │       ├── bmi.routes.ts       # Definição e roteamento Hono
│   │   │   │       └── tests/              # Testes unitários e de integração HTTP
│   │   │   │           ├── bmi.service.test.ts
│   │   │   │           ├── bmi.controller.test.ts
│   │   │   │           └── bmi.routes.test.ts
│   │   │   ├── app.ts                      # Factory da aplicação Hono (CORS, rotas, erros)
│   │   │   └── server.ts                   # Ponto de entrada do servidor Node.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   │
│   └── web/                                # Frontend SPA (React + Vite + Tailwind)
│       ├── src/
│       │   ├── components/
│       │   │   └── ui/                     # Componentes visuais atômicos e reutilizáveis
│       │   │       ├── badge.tsx
│       │   │       ├── button.tsx
│       │   │       ├── card.tsx
│       │   │       ├── container.tsx
│       │   │       ├── error-message.tsx
│       │   │       ├── form-field.tsx
│       │   │       ├── input.tsx
│       │   │       ├── loading.tsx
│       │   │       └── page-header.tsx
│       │   ├── layouts/                    # Layout padrão (Navbar, Conteúdo, Footer)
│       │   │   └── root-layout.tsx
│       │   ├── modules/
│       │   │   └── bmi/                    # Domínio: Funcionalidade de IMC
│       │   │       ├── components/
│       │   │       │   ├── bmi-form/       # Formulário com React Hook Form + Zod
│       │   │       │   │   ├── bmi-form.schema.ts
│       │   │       │   │   ├── bmi-form.types.ts
│       │   │       │   │   ├── bmi-form.tsx
│       │   │       │   │   └── tests/
│       │   │       │   │       └── bmi-form.test.tsx
│       │   │       │   └── bmi-result/     # Card de resultado e tabela de referência
│       │   │       │       ├── bmi-result.types.ts
│       │   │       │       ├── bmi-result.tsx
│       │   │       │       └── tests/
│       │   │       │           └── bmi-result.test.tsx
│       │   │       ├── hooks/              # Custom hook de cálculo e estados
│       │   │       │   ├── use-bmi-calculator.ts
│       │   │       │   ├── use-bmi-calculator.types.ts
│       │   │       │   └── tests/
│       │   │       │       └── use-bmi-calculator.test.ts
│       │   │       ├── services/           # Cliente HTTP da API (fetch)
│       │   │       │   ├── bmi-api.ts
│       │   │       │   ├── bmi-api.types.ts
│       │   │       │   └── tests/
│       │   │       │       └── bmi-api.test.ts
│       │   │       ├── utils/              # Formatadores de texto e estilos de faixa
│       │   │       │   ├── format-bmi.ts
│       │   │       │   ├── format-bmi.types.ts
│       │   │       │   └── tests/
│       │   │       │       └── format-bmi.test.ts
│       │   │       └── types/
│       │   │           └── bmi.types.ts
│       │   ├── pages/                      # Páginas da aplicação
│       │   │   └── bmi-page.tsx
│       │   ├── App.tsx                     # Configuração de rotas
│       │   ├── main.tsx                    # Bootstrap do React
│       │   └── index.css                   # Tailwind directives
│       ├── package.json
│       ├── tailwind.config.js
│       ├── vite.config.ts
│       └── vitest.config.ts
│
├── packages/
│   ├── contracts/                          # Contratos compartilhados (Schemas e Tipos)
│   │   ├── src/
│   │   │   ├── bmi/
│   │   │   │   ├── bmi.constants.ts
│   │   │   │   ├── bmi.schema.ts
│   │   │   │   ├── bmi.types.ts
│   │   │   │   └── tests/
│   │   │   │       └── bmi.schema.test.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                             # Tsconfigs base e compartilhados
│       ├── package.json
│       ├── tsconfig.node.json
│       └── tsconfig.web.json
│
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json                            # Scripts e orquestração do monorepo
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

---

## 5. Regras de Negócio do IMC

### Fórmula

$$\text{IMC} = \frac{\text{Peso}}{\text{Altura}^2}$$

- **Peso**: informado em quilogramas ($\text{kg}$), estritamente $> 0$.
- **Altura**: informada em metros ($\text{m}$), estritamente $> 0$.

### Faixas de Classificação

O cálculo adota **precisão real não arredondada** para determinar a classificação (evitando que um IMC de `18.499` seja incorretamente promovido para `Normal` devido ao arredondamento da exibição).

| Faixa Numérica Real            | Classificação | Descrição Médica                        |
| ------------------------------ | ------------- | --------------------------------------- |
| $\text{IMC} < 18,5$            | **Magreza**   | Abaixo do peso recomendado              |
| $18,5 \le \text{IMC} \le 24,9$ | **Normal**    | Faixa de peso considerada saudável      |
| $24,9 < \text{IMC} \le 30,0$   | **Sobrepeso** | Atenção preventiva recomendada          |
| $\text{IMC} > 30,0$            | **Obesidade** | Acompanhamento profissional recomendado |

O valor numérico do IMC retornado na resposta da API é arredondado para **duas casas decimais** para exibição limpa.

---

## 6. Especificação da API REST

### Health Check

- **Endpoint**: `GET /api/v1/health` ou `GET /health`
- **Resposta**: `200 OK`

```json
{
  "status": "ok",
  "service": "bmi-api",
  "timestamp": "2026-11-24T17:30:00.000Z",
  "environment": "development"
}
```

### Cálculo do IMC

- **Endpoint**: `POST /api/v1/bmi`
- **Headers**: `Content-Type: application/json`

#### Exemplo de Requisição (Payload)

```json
{
  "weight": 80,
  "height": 1.75
}
```

#### Exemplo de Resposta de Sucesso (`200 OK`)

```json
{
  "success": true,
  "data": {
    "weight": 80,
    "height": 1.75,
    "bmi": 26.12,
    "classification": "Sobrepeso"
  }
}
```

#### Exemplo de Resposta de Erro de Validação (`400 Bad Request`)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados informados são inválidos.",
    "details": [
      {
        "field": "weight",
        "message": "O peso deve ser maior que zero."
      }
    ]
  }
}
```

#### Exemplo de Resposta para Rota Inexistente (`404 Not Found`)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Rota 'GET /api/v1/desconhecida' não encontrada.",
    "details": []
  }
}
```

---

## 7. Requisitos de Instalação e Execução

### Pré-requisitos

- **Node.js**: versão 20.x ou 22.x+ recomendada
- **pnpm**: versão 9.x ou 12.x+ (`npm install -g pnpm`)

### Instalação das Dependências

Na raiz do projeto, execute:

```bash
pnpm install
```

Caso o pnpm solicite permissão para compilar scripts nativos (como `esbuild`), execute:

```bash
pnpm approve-builds --all
```

---

## 8. Scripts Padronizados do Monorepo

| Comando             | Descrição                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Inicia simultaneamente o **Backend** (`http://localhost:3001`) e o **Frontend** (`http://localhost:5173`) |
| `pnpm dev:api`      | Inicia apenas o servidor de desenvolvimento do Backend (Hono + tsx watch)                                 |
| `pnpm dev:web`      | Inicia apenas o servidor Vite do Frontend com proxy configurado para `/api`                               |
| `pnpm build`        | Compila os contratos compartilhados, o backend TypeScript e o frontend para produção                      |
| `pnpm test`         | Executa todos os testes da suíte completa de contratos, backend e frontend                                |
| `pnpm test:watch`   | Executa os testes em modo interativo contínuo (Watch Mode)                                                |
| `pnpm lint`         | Analisa a conformidade de todo o código com ESLint Flat Config                                            |
| `pnpm lint:fix`     | Corrige automaticamente problemas de linting e importações                                                |
| `pnpm format`       | Formata todo o repositório utilizando Prettier                                                            |
| `pnpm format:check` | Verifica se os arquivos respeitam os padrões do Prettier sem modificá-los                                 |
| `pnpm typecheck`    | Executa a verificação estrita de tipos TypeScript (`tsc --noEmit`) em todos os pacotes                    |

---

## 9. Estratégia e Execução dos Testes

O projeto conta com **58 testes automatizados** distribuídos estrategicamente por domínio:

### 1. Pacote de Contratos (`packages/contracts`) — 11 testes

- Validação de payload correto.
- Rejeição de campos ausentes (`weight`, `height`).
- Rejeição de valores negativos e zero.
- Rejeição de valores não finitos (`NaN`, `Infinity`).
- Rejeição de coerção silenciosa de strings (`"80"`).
- Validação dos envelopes de sucesso e de erro.

### 2. Backend (`apps/api`) — 27 testes

- **Unitários de Serviço (`bmi.service.test.ts`)**:
  - Exatidão da fórmula $\text{Peso} / \text{Altura}^2$.
  - Arredondamento para 2 casas decimais.
  - Classificação estrita para Magreza ($< 18,5$).
  - Limite inferior exato de Normal ($18,5$).
  - Limite superior exato de Normal ($24,9$).
  - Transição imediata para Sobrepeso ($24,9001$).
  - Limite superior de Sobrepeso ($30,0$).
  - Transição imediata para Obesidade ($30,001$).
  - **Regra de ouro**: garantia de que $18,4999$ é classificado como Magreza antes de qualquer formatação decimal.
- **Unitários de Controller (`bmi.controller.test.ts`)**:
  - Delegação para o serviço e envelope de resposta 200.
  - Interceptação de corpos JSON malformados.
- **Integração HTTP (`bmi.routes.test.ts`)**:
  - Testes completos de requisição e resposta via Hono `app.request`.
  - Verificação de códigos de status 200, 400, 404.
  - Verificação dos endpoints de `/health` e `/api/v1/health`.

### 3. Frontend (`apps/web`) — 20 testes

- **Componente Formulário (`bmi-form.test.tsx`)**:
  - Renderização acessível com labels vinculadas por `htmlFor`.
  - Validação de campos obrigatórios ao submeter formulário vazio.
  - Rejeição visual de valores menores ou iguais a zero.
  - Disparo de `onSubmit` com números tipados corretos.
  - Desabilitação de campos durante o carregamento (`isLoading`).
  - Limpeza completa de campos e acionamento de `onReset`.
- **Componente de Resultado (`bmi-result.test.tsx`)**:
  - Exibição do IMC formatado em padrão brasileiro (`26,12`).
  - Exibição dos badges de classificação coloridos por gravidade.
  - Renderização da tabela de faixas e destaque da linha com marcador _"Sua faixa"_.
- **Hook de Estado (`use-bmi-calculator.test.ts`)**:
  - Estados iniciais, transições assíncronas de loading, sucesso e erro.
- **Cliente de API (`bmi-api.test.ts`)**:
  - Requisição POST com cabeçalhos corretos.
  - Tratamento de falhas de rede (`NETWORK_ERROR`).
  - Parsing de erros estruturados da API (`VALIDATION_ERROR`).
- **Formatadores (`format-bmi.test.ts`)**:
  - Formatação monetária/numérica PT-BR e mapeamento de estilos Tailwind.

### Para rodar todos os testes:

```bash
pnpm test
```

---

## 10. Como Testar Manualmente

1. Inicie a aplicação completa:
   ```bash
   pnpm dev
   ```
2. Abra seu navegador em `http://localhost:5173`.
3. Insira valores de teste:
   - Exemplo 1: Peso = `80`, Altura = `1.75` $\rightarrow$ Resultado esperado: IMC `26,12` — **Sobrepeso**.
   - Exemplo 2: Peso = `70`, Altura = `1.75` $\rightarrow$ Resultado esperado: IMC `22,86` — **Normal**.
   - Exemplo 3: Peso = `50`, Altura = `1.75` $\rightarrow$ Resultado esperado: IMC `16,33` — **Magreza**.
   - Exemplo 4: Peso = `110`, Altura = `1.75` $\rightarrow$ Resultado esperado: IMC `35,92` — **Obesidade**.
4. Teste a limpeza do formulário clicando no botão **"Limpar"**.
5. Teste as validações tentando clicar em **"Calcular IMC"** com campos em branco ou valores negativos.
