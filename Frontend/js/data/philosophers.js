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
 */
export const PHILOSOPHERS_DATA = {
    // --- ANTIGUIDADE ---
    1: { name: 'Sócrates', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [], keyConcepts: [101, 102], description: 'O mestre do questionamento, que acreditava que a virtude é conhecimento.' },
    2: { name: 'Platão', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [1], keyConcepts: [103, 104], description: 'Discípulo de Sócrates, idealizou um mundo de formas perfeitas e imutáveis.' },
    3: { name: 'Aristóteles', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [2], keyConcepts: [105, 106], description: 'Fundador da lógica formal e defensor do conhecimento empírico e da ética das virtudes.' },
    4: { name: 'Sêneca', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [], keyConcepts: [107], description: 'Filósofo estóico que ensinava sobre a serenidade da alma diante do destino.' },

    // --- IDADE MÉDIA ---
    5: { name: 'Santo Agostinho', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [2], keyConcepts: [201], description: 'Teólogo que fundiu a filosofia platônica com o cristianismo.' },
    6: { name: 'Tomás de Aquino', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [3, 5], keyConcepts: [202], description: 'Sintetizou o pensamento aristotélico com a doutrina cristã.' },
    
    // --- MODERNIDADE ---
    7: { name: 'Descartes', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [], keyConcepts: [301, 302], description: '"Penso, logo existo." O pai da filosofia moderna e do racionalismo.' },
    8: { name: 'Spinoza', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [7], keyConcepts: [303], description: 'Via Deus e a Natureza como uma única substância divina e infinita.' },
    9: { name: 'John Locke', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [], keyConcepts: [304, 305], description: 'Defensor da mente como uma "tábula rasa" e dos direitos naturais do homem.' },
    10: { name: 'David Hume', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [9], keyConcepts: [306], description: 'Levou o empirismo ao seu ceticismo radical, questionando a causalidade.' },
    11: { name: 'Kant', school: SCHOOLS.ILUMINISMO, era: 'Moderna', predecessors: [7, 10], keyConcepts: [307, 308], description: 'Realizou a "revolução copernicana" na filosofia, unindo racionalismo e empirismo.' },
    12: { name: 'Hegel', school: SCHOOLS.IDEALISMO_ALEMAO, era: 'Moderna', predecessors: [11], keyConcepts: [309], description: 'Desenvolveu um sistema dialético para explicar o progresso do Espírito Absoluto na história.' },

    // --- CONTEMPORÂNEA ---
    13: { name: 'Karl Marx', school: SCHOOLS.MATERIALISMO, era: 'Contemporânea', predecessors: [12], keyConcepts: [401, 402], description: 'Crítico do capitalismo que via a história como uma luta de classes.' },
    14: { name: 'Nietzsche', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [2, 11], keyConcepts: [403, 404], description: 'Proclamou a "morte de Deus" e exaltou o Super-Homem e a vontade de poder.' },
    15: { name: 'Sartre', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [405, 406], description: 'Defendia que "a existência precede a essência", tornando o homem radicalmente livre.' },
    16: { name: 'Simone de Beauvoir', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [15], keyConcepts: [407], description: '"Não se nasce mulher, torna-se." Pioneira do feminismo existencialista.' },
    17: { name: 'Foucault', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [408, 409], description: 'Analisou as relações entre poder, conhecimento e discurso na sociedade.' },
    18: { name: 'Derrida', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17], keyConcepts: [410], description: 'Criador do desconstrucionismo, que desafia as oposições binárias do pensamento ocidental.' },
    19: { name: 'Adorno', school: SCHOOLS.ESCOLA_DE_FRANKFURT, era: 'Contemporânea', predecessors: [13, 12], keyConcepts: [411], description: 'Crítico da "indústria cultural" e da razão instrumental na sociedade de massas.' },
    20: { name: 'Byung-Chul Han', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17, 19], keyConcepts: [412], description: 'Analisa a "sociedade do cansaço", onde a exploração agora é autoimposta.' },
};