# 💪 Gym Companion

**Gym Companion** é uma aplicação web full-stack de musculação e performance física projetada para ser o melhor e mais ágil companheiro de academia. Desenvolvido com arquitetura **Offline-First**, o app oferece rastreamento de treino em tempo real com controle de 1 mão (ergonomia focada no polegar), cronômetro de descanso automático, progressão de sobrecarga, biblioteca master de exercícios com mídia e um **AI Coach** inteligente via OpenRouter.

---

## 🚀 Principais Funcionalidades

- **⏱️ Treino Ativo Anti-Fricção (&lt; 3s)**: Interface otimizada para uso com uma mão na academia, com conclusão rápida de séries, acréscimo inteligente de carga (+2.5 kg/+5 kg), botão de "Aparelho Ocupado" para reorganização dinâmica e cronômetro com feedback sonoro e vibração.
- **🧠 AI Coach em Tempo Real**: Assistente de treino integrado via OpenRouter (Claude Sonnet 4.5 / DeepSeek) com recomendações de biomecânica, recuperação e adaptações para dor ou fadiga. Possui fallback heurístico instantâneo para operação offline.
- **📚 Banco Global de Exercícios**: Catálogo completo com grupos musculares, instruções detalhadas, regulagens de máquinas, tabela de anilhas e suporte a imagens anatômicas geradas por IA.
- **🔄 Persistência Híbrida Cloud & Offline**: Sincronização em tempo real com Cloud Firestore e cache robusto no LocalStorage para treinar sem falhas mesmo sem internet.
- **🎧 Audio & Gym Beats**: Gerador de trilhas sonoras motivacionais e sintetizador de áudio para treinos.
- **📊 Métricas, Gamificação & Glow Up**: Cálculo de 1RM, volume total (tonelagem), calorias estimadas, controle de peso/composição corporal e sistema de conquistas (badges).

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion (`motion/react`), Lucide React, Canvas Confetti, Recharts.
- **Backend / API**: Express 4, Node.js / Bun, TypeScript (`tsx` em dev, `esbuild` em prod).
- **Segurança & Resiliência**: `express-rate-limit` (30 req/min por IP), CORS restrito por domínio e regras de segurança blindadas no `firestore.rules`.
- **Banco de Dados & Autenticação**: Firebase Firestore & Firebase Auth.
- **Inteligência Artificial**:
  - **OpenRouter API**: AI Coach via `anthropic/claude-sonnet-4-5` / `deepseek/deepseek-chat`.
  - **Google Gemini (@google/genai)**: Ilustrações anatômicas (`gemini-3.1-flash-image`), animação de vídeos de execução (`gemini-omni-flash-preview`) e áudio (`lyria-3`).

---

## 💻 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) v20+ ou [Bun](https://bun.sh/) instalado.

### 2. Instalar as dependências

Usando **Bun**:
```bash
bun install
```

Ou usando **npm**:
```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha suas chaves de API (detalhes na seção abaixo).

### 4. Executar em modo de desenvolvimento

Usando **Bun**:
```bash
bun run dev
```

Ou usando **npm**:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 🔑 Configuração das Chaves de API

No arquivo `.env`, você pode configurar as seguintes chaves:

| Variável | Obrigatória | Descrição |
| :--- | :---: | :--- |
| `OPENROUTER_API_KEY` | Recomendada | Chave de API da [OpenRouter](https://openrouter.ai/) para o AI Coach em tempo real (Claude Sonnet 4.5 / DeepSeek). Caso não informada, o sistema usa o motor heurístico local. |
| `GEMINI_API_KEY` | Opcional | Chave da Google AI Studio para geração de imagens anatômicas, animação de exercícios e áudio via Lyria. |
| `APP_URL` | Opcional | URL base da aplicação para validação de CORS e links (ex.: `http://localhost:3000` ou a URL do Cloud Run). |

> 🔒 **Segurança**: Nunca envie chaves reais ao repositório git. O arquivo `.gitignore` já está configurado para ignorar `.env`.

---

## 🔒 Regras de Segurança do Firestore

O arquivo `firestore.rules` foi endurecido com as seguintes políticas:
- `/users/{userId}`: Acesso restrito exclusivamente ao dono autenticado (`request.auth.uid == userId`).
- `/masterExercises/{exerciseId}`: Leitura pública global (`allow read: if true`) para carregamento do catálogo e escrita restrita a usuários autenticados.
- `/workoutPlans`, `/workoutSessions`, `/exercisePresets`, `/bodyMetrics`, `/syncMetadata`: Acesso permitido somente a usuários autenticados.
- Coleções não mapeadas têm negação padrão (`allow read, write: if false`).

Para publicar as regras no Firebase:
```bash
firebase deploy --only firestore:rules
```

---

## 📦 Build e Deploy para Produção

### 1. Build da Aplicação
O comando de build compila o frontend com Vite e empacota o backend Express em um único arquivo `dist/server.cjs`:

```bash
bun run build
# ou
npm run build
```

### 2. Iniciar o Servidor de Produção
```bash
bun run start
# ou
npm run start
```

### 3. Deploy no Google Cloud Run / Container
A aplicação está pronta para execução em contêineres Docker / Cloud Run escutando na porta `3000`.

Exemplo de Dockerfile padrão:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Validação e Qualidade de Código

Para verificar a integridade dos tipos TypeScript:
```bash
bun run lint
# ou
npm run lint
```
