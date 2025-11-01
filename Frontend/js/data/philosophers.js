/**
 * Constante para manter a consistência dos nomes das escolas.
 * Funciona como as "cores" do jogo.
 */
export const SCHOOLS = {
    GREGA: 'Grega',
    ESTOICISMO: 'Estoicismo',
    ESCOLASTICA: 'Escolástica',
    RACIONALISMO: 'Racionalismo',
    EMPIRISMO: 'Empirismo',
    ILUMINISMO: 'Iluminismo',
    IDEALISMO_ALEMAO: 'Idealismo Alemão',
    MATERIALISMO: 'Materialismo Histórico',
    EXISTENCIALISMO: 'Existencialismo',
    FENOMENOLOGIA: 'Fenomenologia',
    ESCOLA_DE_FRANKFURT: 'Escola de Frankfurt',
    ESTRUTURALISMO: 'Estruturalismo',
    POS_ESTRUTURALISMO: 'Pós-Estruturalismo',
};

/**
 * PHILOSOPHERS_DATA
 * Banco de dados principal das cartas de filósofos.
 * 
 * - id: Identificador único da carta.
 * - name: Nome do filósofo.
 * - school: A "cor" da carta, vinda de SCHOOLS.
 * - era: Período histórico para contexto e futuras regras.
 * - predecessors: Array de IDs de filósofos que este diretamente critica ou continua.
 *                 Permite a jogada de "Evolução Conceitual".
 * - keyConcepts: Array de IDs de conceitos associados a este filósofo.
 *                Usado para validar a pontuação do jogador.
 * - description: Texto de ambientação para a carta, visível na UI.
 * - image: Caminho para a imagem do filósofo para popups e cards.
 */
export const PHILOSOPHERS_DATA = {
    // --- ANTIGUIDADE ---
    1: { name: 'Sócrates', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [], keyConcepts: [101, 102], description: 'O mestre do questionamento, que acreditava que a virtude é conhecimento.', image: 'assets/game/images/philosophers/socrates.png' },
    2: { name: 'Platão', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [1], keyConcepts: [103, 104], description: 'Discípulo de Sócrates, idealizou um mundo de formas perfeitas e imutáveis.', image: 'assets/game/images/philosophers/platao.png' },
    3: { name: 'Aristóteles', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [2], keyConcepts: [105, 106], description: 'Fundador da lógica formal e defensor do conhecimento empírico e da ética das virtudes.', image: 'assets/game/images/philosophers/aristoteles.png' },
    4: { name: 'Sêneca', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [], keyConcepts: [107], description: 'Filósofo estóico que ensinava sobre a serenidade da alma diante do destino.', image: 'assets/game/images/philosophers/seneca.png' },

    // --- IDADE MÉDIA ---
    5: { name: 'Santo Agostinho', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [2], keyConcepts: [201], description: 'Teólogo que fundiu a filosofia platônica com o cristianismo.', image: 'assets/game/images/philosophers/augustine.png' },
    6: { name: 'Tomás de Aquino', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [3, 5], keyConcepts: [202], description: 'Sintetizou o pensamento aristotélico com a doutrina cristã.', image: 'assets/game/images/philosophers/aquinas.png' },
    
    // --- MODERNIDADE ---
    7: { name: 'Descartes', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [], keyConcepts: [301, 302], description: '"Penso, logo existo." O pai da filosofia moderna e do racionalismo.', image: 'assets/game/images/philosophers/descartes.png' },
    8: { name: 'Spinoza', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [7], keyConcepts: [303], description: 'Via Deus e a Natureza como uma única substância divina e infinita.', image: 'assets/game/images/philosophers/spinoza.png' },
    9: { name: 'John Locke', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [], keyConcepts: [304, 305], description: 'Defensor da mente como uma "tábula rasa" e dos direitos naturais do homem.', image: 'assets/game/images/philosophers/locke.png' },
    10: { name: 'David Hume', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [9], keyConcepts: [306], description: 'Levou o empirismo ao seu ceticismo radical, questionando a causalidade.', image: 'assets/game/images/philosophers/hume.png' },
    11: { name: 'Kant', school: SCHOOLS.ILUMINISMO, era: 'Moderna', predecessors: [7, 10], keyConcepts: [307, 308], description: 'Realizou a "revolução copernicana" na filosofia, unindo racionalismo e empirismo.', image: 'assets/game/images/philosophers/kant.png' },
    12: { name: 'Hegel', school: SCHOOLS.IDEALISMO_ALEMAO, era: 'Moderna', predecessors: [11], keyConcepts: [309], description: 'Desenvolveu um sistema dialético para explicar o progresso do Espírito Absoluto na história.', image: 'assets/game/images/philosophers/hegel.png' },

    // --- CONTEMPORÂNEA ---
    13: { name: 'Karl Marx', school: SCHOOLS.MATERIALISMO, era: 'Contemporânea', predecessors: [12], keyConcepts: [401, 402], description: 'Crítico do capitalismo que via a história como uma luta de classes.', image: 'assets/game/images/philosophers/marx.png' },
    14: { name: 'Nietzsche', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [2, 11], keyConcepts: [403, 404], description: 'Proclamou a "morte de Deus" e exaltou o Super-Homem e a vontade de poder.', image: 'assets/game/images/philosophers/nietzsche.png' },
    15: { name: 'Sartre', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [405, 406], description: 'Defendia que "a existência precede a essência", tornando o homem radicalmente livre.', image: 'assets/game/images/philosophers/sartre.png' },
    16: { name: 'Simone de Beauvoir', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [15], keyConcepts: [407], description: '"Não se nasce mulher, torna-se." Pioneira do feminismo existencialista.', image: 'assets/game/images/philosophers/beauvoir.png' },
    17: { name: 'Foucault', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [408, 409], description: 'Analisou as relações entre poder, conhecimento e discurso na sociedade.', image: 'assets/game/images/philosophers/foucault.png' },
    18: { name: 'Derrida', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17], keyConcepts: [410], description: 'Criador do desconstrucionismo, que desafia as oposições binárias do pensamento ocidental.', image: 'assets/game/images/philosophers/derrida.png' },
    19: { name: 'Adorno', school: SCHOOLS.ESCOLA_DE_FRANKFURT, era: 'Contemporânea', predecessors: [13, 12], keyConcepts: [411], description: 'Crítico da "indústria cultural" e da razão instrumental na sociedade de massas.', image: 'assets/game/images/philosophers/adorno.png' },
    20: { name: 'Byung-Chul Han', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17, 19], keyConcepts: [412], description: 'Analisa a "sociedade do cansaço", onde a exploração agora é autoimposta.', image: 'assets/game/images/philosophers/byung-chul-han.png' },
};