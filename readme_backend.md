# Documentação de Funcionalidades e Backend - LOGOS

Este documento detalha todas as funcionalidades existentes no jogo "LOGOS - O Jogo da Filosofia", bem como os requisitos para o backend atual e necessidades futuras para escalar o projeto.

## 1. Funcionalidades Atuais (Frontend & Integração Básica)

O jogo atualmente opera como uma aplicação Web (SPA) com integração ao Firebase para autenticação e persistência de dados básicos.

### 1.1. Autenticação e Usuários
*   **Login Social**: Autenticação via Google (Firebase Auth).
*   **Gestão de Sessão**: Persistência de login (Local Storage / Firebase Auth State).
*   **Perfil de Usuário**: Armazenamento de dados básicos (UID, Nome, Email, Foto).
*   **Modo Demo**: Acesso limitado sem login para testes.

### 1.2. Sistema de Jogo (Core Loop)
*   **Navegação Responsiva**:
    *   **Mobile**: Barra de navegação inferior.
    *   **Desktop**: Sidebar lateral e layout de painel duplo (Contexto + Debate).
*   **Economia do Jogo**:
    *   **Recursos**: Pergaminhos (Scrolls) e Livros (Books).
    *   **XP e Níveis**: Barra de progresso de experiência e sistema de níveis.
*   **Sistema de Baús (Gacha/Recompensas)**:
    *   **Slots de Baús**: 4 slots para baús ganhos em batalhas.
    *   **Baús Temporais**: Baú Grátis (Free Chest) e Baú da Coroa (Crown Chest) com timers cíclicos.
    *   **Mecânica de Desbloqueio**: Timers para abrir baús, com estados (Bloqueado, Desbloqueando, Pronto).
*   **Arenas**:
    *   Seleção visual de arenas baseada no nível do jogador.
    *   Visualização de progresso na arena atual.

### 1.3. Conteúdo Educacional e Exploração
*   **Biblioteca**: Visualização de cartas/conceitos adquiridos.
*   **Filósofos**: Catálogo de filósofos, provavelmente com detalhes biográficos ou cartas associadas.
*   **Escolas**: Agrupamento de filósofos/conceitos por escolas filosóficas (ex: Estoicismo, Epicurismo).
*   **Reels**: Feed de vídeos curtos para consumo de conteúdo rápido (Edutainment).
*   **Simpósio**: Área para eventos ou discussões (funcionalidade a detalhar/expandir).

### 1.4. Interface e UX
*   **Popups e Modais**: Sistema centralizado (`PopupManager`) para:
    *   Detalhes de Baús e Recompensas.
    *   Configurações.
    *   Perfil Completo.
    *   Linha do Tempo da Arena.
*   **Notificações**: Sistema de "Toast" para feedback visual rápido.

---

## 2. Necessidades do Backend (Versão Atual)

Para suportar as funcionalidades acima, o backend (atualmente Firebase) precisa garantir:

### 2.1. Autenticação (Firebase Auth)
*   [x] Provedor de Login Google ativado.
*   [x] Gestão de tokens de acesso seguros.

### 2.2. Banco de Dados (Firestore)
Estrutura de dados necessária para persistência:

*   **Coleção `users`**:
    *   Documento por `uid`.
    *   Campos: `displayName`, `email`, `photoURL`, `lastLogin`.
*   **Sub-coleção `users/{uid}/gameData`**:
    *   Documento `progress`:
        *   `level` (Number)
        *   `xp` (Number)
        *   `xpMax` (Number)
        *   `scrolls` (Number)
        *   `books` (Number)
        *   `trophies` (Number)
        *   `timers` (Object: `freeChest`, `crownChest`)
        *   `chestSlots` (Array de Objects: `{type, status, remainingTime, arena}`)

### 2.3. Segurança (Firestore Rules)
*   **Regras de Leitura/Escrita**: Usuários só podem ler e escrever em seus próprios documentos (`users/{userId}`).

---

## 3. Necessidades Futuras e Expansão (Roadmap Backend)

Para transformar o LOGOS em um jogo competitivo, seguro e escalável, as seguintes funcionalidades de backend são **CRITICAMENTE NECESSÁRIAS**:

### 3.1. Validação de Lógica no Servidor (Anti-Cheat)
*   **Problema Atual**: A lógica de recompensas, timers e abertura de baús roda no cliente (`play.js`). Isso é vulnerável a cheats (alteração de relógio, injeção de recursos).
*   **Necessidade**:
    *   **Cloud Functions**: Endpoints para "Abrir Baú", "Iniciar Desbloqueio", "Coletar Recompensa".
    *   O servidor deve verificar se o tempo realmente passou e calcular as recompensas, retornando apenas o resultado para o cliente.

### 3.2. Multiplayer Real-Time (PvP)
*   **Funcionalidade**: Batalhas de debate entre jogadores reais.
*   **Necessidades**:
    *   **Matchmaking**: Fila de espera baseada em nível/troféus.
    *   **Servidor de Jogo (Game Server)**: WebSocket (Socket.io) ou Firebase Realtime Database para sincronizar turnos, cartas jogadas e vida em tempo real.
    *   **Validação de Movimentos**: Garantir que o jogador possui as cartas que está jogando e que o movimento é legal.

### 3.3. Sistema Social e Comunidade
*   **Funcionalidades**:
    *   Lista de Amigos.
    *   Clãs/Escolas (Guilds): Chat de clã, doação de cartas/livros.
    *   Batalhas Amistosas.
*   **Necessidades**:
    *   Estrutura de dados relacional para Amigos/Guildas.
    *   Sistema de Chat (Realtime DB ou serviço terceiro).

### 3.4. Conteúdo Dinâmico (LiveOps)
*   **Funcionalidade**: Adicionar novos filósofos, cartas e eventos sem atualizar o código do app.
*   **Necessidades**:
    *   **CMS (Content Management System)**: Painel administrativo para criar conteúdo.
    *   **Versionamento de Dados**: O app baixa a versão mais recente dos dados (JSON) ao iniciar (Remote Config).

### 3.5. Economia e Monetização
*   **Funcionalidades**: Loja de itens, compras in-app (IAP).
*   **Necessidades**:
    *   Integração com APIs de pagamento (Google Play Billing / Apple App Store / Stripe).
    *   Validação de recibos de compra no servidor (Receipt Validation).
    *   Logs de transações para auditoria.

### 3.6. Analytics e Dashboards
*   **Necessidades**:
    *   Rastreamento de eventos (Início de batalha, Retenção D1/D7/D30, Funil de conversão).
    *   Dashboards para monitorar a saúde do jogo e balanceamento (ex: Win rate de cartas/filósofos).

---

## Resumo de Prioridades para o Backend

1.  **Imediato**: Garantir que a persistência atual no Firestore esteja robusta e segura (Security Rules).
2.  **Curto Prazo**: Migrar a lógica de abertura de baús e recompensas para Cloud Functions (Anti-Cheat básico).
3.  **Médio Prazo**: Implementar sistema de Matchmaking e Multiplayer Real-time para o "Debate".
4.  **Longo Prazo**: Sistemas sociais (Guildas), LiveOps e Monetização.
