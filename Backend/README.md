# LOGOS Backend API

Backend Node.js/Express para o jogo LOGOS.

## Configuração

1.  **Instalar Dependências**:
    ```bash
    cd Backend
    npm install
    ```

2.  **Configurar Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz da pasta `Backend` com o seguinte conteúdo:
    ```env
    PORT=3000
    GOOGLE_APPLICATION_CREDENTIALS=./caminho/para/serviceAccountKey.json
    ```
    *Nota: Você precisa baixar a chave de serviço do Firebase Console e salvar o arquivo JSON.*

3.  **Rodar o Servidor**:
    ```bash
    npm run dev
    ```

## Endpoints

Todas as rotas (exceto Content) exigem o header `Authorization: Bearer <FIREBASE_ID_TOKEN>`.

### Game Logic (`/api/game`)
*   `POST /sync`: Sincroniza o estado do jogo.
*   `POST /chests/unlock`: Inicia o desbloqueio de um baú.
    *   Body: `{ "chestIndex": 0 }`
*   `POST /chests/open`: Abre um baú pronto e coleta recompensas.
    *   Body: `{ "chestIndex": 0 }`

### Multiplayer / PvP (`/api/pvp`)
*   `POST /queue/join`: Entra na fila de matchmaking.
*   `POST /queue/leave`: Sai da fila.
*   `GET /status`: Verifica se encontrou partida.
*   `POST /move`: Envia um movimento na batalha.
    *   Body: `{ "cardId": "...", "target": "..." }`

### Social (`/api/social`)
*   `POST /guilds/create`: Cria uma nova guilda/escola.
    *   Body: `{ "name": "Nome da Escola", "description": "..." }`
*   `POST /guilds/join`: Entra em uma guilda existente.
    *   Body: `{ "guildId": "..." }`
*   `GET /friends`: Lista amigos (Mock).

### Content (`/api/content`) - Público
*   `GET /philosophers`: Retorna lista de filósofos.
*   `GET /cards`: Retorna lista de cartas.

## Estrutura do Projeto

*   `src/server.js`: Ponto de entrada.
*   `src/config/`: Configurações (Firebase).
*   `src/controllers/`: Lógica de negócios.
*   `src/routes/`: Definição de rotas.
*   `src/middleware/`: Middlewares (Auth).
*   `src/services/`: Serviços compartilhados (Matchmaking).
