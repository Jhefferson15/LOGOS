# Funcionalidades de Frontend Faltantes - Projeto LOGOS

Este documento lista todas as mecânicas e sistemas do frontend que possuem estruturas de dados ou interfaces parciais, mas **não estão implementados logicamente** ou funcionalmente no código atual.

## 1. Sistema de Batalha e Modos de Jogo
- **Seleção de Arena**:
  - O arquivo `arenas.js` define 10 arenas com requisitos de troféus, mas o código em `play.js` carrega fixamente a Arena 1 (`arenas[1]`).
  - **IMPLEMENTADO PARCIALMENTE**: Interface para visualizar arenas bloqueadas/desbloqueadas utilizando o `PopupManager` (`arena:timeline`), lógica para selecionar a arena baseada nos troféus do jogador e navegação entre arenas. A seleção de arena ainda não é forçada antes de uma batalha, e o fluxo foi ajustado para permitir que o usuário inicie uma batalha com a arena atual.
- **Seleção de Modos de Jogo**:
  - Não existe lógica para escolher entre diferentes tipos de debate (ex: "Clássico", "Rápido", "Ranqueado").
  - **IMPLEMENTADO**: Menu de seleção de modo de jogo antes de iniciar a batalha (`shared:game-mode-selection`).
- **Matchmaking Visual**:
  - O botão "Batalha" redireciona imediatamente para `game.html`.
  - **IMPLEMENTADO**: Tela de "Procurando Oponente", animação de pareamento, exibição do perfil do oponente antes da partida começar (`play:matchmaking`).
- **Deck Builder / Seleção de Filósofos**:
  - O `gameState` possui uma coleção, mas não há "Deck" ou "Time" definido.
  - **IMPLEMENTADO**: Interface para o jogador escolher quais 4-8 filósofos levará para o debate (Deck Building) (`play:deck-builder`).

## 2. Sistema de Economia e Recompensas
- **Gasto de Recursos**:
  - Existem variáveis para `scrolls` (Papiros) e `books` (Tomos/Ouro), mas não há onde gastá-los.
  - **IMPLEMENTADO**: Loja (Shop) para comprar cartas, baús ou ouro com gemas. O sistema de recompensas ao ganhar uma partida também foi implementado.
- **Coleta de Recompensas (Claim)**:
  - A lógica de abrir baús existe parcialmente (`handlePlayScreenClick`), mas é simplista.
  - **IMPLEMENTADO**: Animações visuais de abertura de baú, revelação carta-por-carta (efeito de suspense), e conversão visual de cartas repetidas em "XP" ou "Curingas" (`arena:chest-opening`).
- **Recompensas de Partida**:
  - O `endGame` em `game.js` apenas mostra uma mensagem.
  - **IMPLEMENTADO**: Tela de "Vitória/Derrota" rica, mostrando ganho de Troféus, Ouro e Baús ganhos na partida. Atualização do `gameState` com esses ganhos (`game:end-game`).

## 3. Sistema de Progressão (Meta-Game)
- **Level Up do Jogador**:
  - `gameState` tem `xp` e `level`, mas não há lógica que verifique `if (xp >= xpMax) levelUp()`.
  - **IMPLEMENTADO**: Animação de "Level Up", aumento de status da torre/rei, e recompensas por subir de nível (`profile:level-up`).
- **Desbloqueio e Evolução de Filósofos**:
  - A tela de filósofos mostra nível, mas não tem botão "Evoluir".
  - **Falta**:
    - Interface de evolução de filósofos utilizando o `PopupManager`.
    - Lógica para verificar se o jogador tem cartas suficientes para evoluir (ex: 10/10 cartas).
    - Botão de "Melhorar" que gasta Ouro (`books`) e consome cartas para subir o nível do filósofo.
    - Aumento dos atributos do filósofo (Vida, Dano) ao evoluir.
- **Caminho de Troféus (Trophy Road)**:
  - As arenas têm requisitos de troféus, mas não há uma visualização linear de progresso.
  - **Falta**: Interface de "Caminho de Troféus" mostrando recompensas a cada marco de troféus alcançado.

## 4. Funcionalidades Sociais e Clãs
- **Sistema de Clãs (Escolas)**:
  - `gameState` tem `clanName`, mas é estático.
  - **Falta**:
    - Tela de busca e criação de Escolas (Clãs).
    - Chat da Escola.
    - Doação de cartas (mencionada em `donations` no state, mas sem lógica).
    - Batalhas amistosas entre membros.
- **Perfil de Jogador e Amigos**:
  - **Falta**: Capacidade de ver perfil de outros jogadores, histórico de partidas detalhado, lista de amigos.

## 5. Missões e Conquistas
- **Sistema de Quests**:
  - Não há menção a missões diárias ou semanais no código.
  - **Falta**: Painel de "Missões Diárias" (ex: "Vença 3 debates com Estoicos") que dão recompensas.
- **Conquistas (Achievements)**:
  - **Falta**: Lista de conquistas de longo prazo (ex: "Colete 50 filósofos").

## 6. UI/UX e Feedback Visual
- **Feedback de Toque e Interação**:
  - Faltam sons e efeitos visuais ao clicar em botões de UI (além do básico).
- **Notificações**:
  - Sistema de `toast` existe, mas faltam notificações push ou badges (bolinha vermelha) em abas quando há algo novo (ex: carta para evoluir, baú pronto).
- **Configurações**:
  - O popup de configurações existe, mas muitas opções podem não estar funcionais (vincular conta, idioma, etc).

## Resumo Técnico
O frontend atual possui uma **excelente base estrutural** (Router, GameState, Componentização), mas opera majoritariamente com dados estáticos (`mock data`). A lógica de **mutação de estado persistente** (gastar dinheiro, evoluir, ganhar XP real) e o **ciclo de gameplay completo** (Menu -> Deck -> Batalha -> Recompensa -> Evolução) estão incompletos.