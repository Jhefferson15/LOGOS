/**
 * philosophers.js
 * 
 * Este arquivo contém o banco de dados principal dos filósofos para o jogo.
 * Cada filósofo é um objeto com informações essenciais como data de nascimento,
 * escola filosófica, conceitos-chave e predecessores, permitindo a criação de
 * mecânicas de jogo complexas como linhas de pensamento e evolução conceitual.
 * 
 * **MODIFICADO:** Adicionada a propriedade `pos` a cada filósofo para layout visual.
 */

/**
 * Constante para manter a consistência dos nomes das escolas.
 * Funciona como as "cores" ou "facções" do jogo.
 */
export const SCHOOLS = {
    // Antigas
    GREGA: 'Grega Clássica',
    PRE_SOCRATICO_MILETO: 'Escola de Mileto',
    PRE_SOCRATICO_ELEIA: 'Escola de Eleia',
    PRE_SOCRATICO_PLURALISTA: 'Pluralistas',
    PITAGORISMO: 'Pitagorismo',
    SOFISMO: 'Sofismo',
    ESTOICISMO: 'Estoicismo',
    EPICURISMO: 'Epicurismo',
    CINISMO: 'Cinismo',
    NEOPLATONISMO: 'Neoplatonismo',
    CETISCISMO: 'Ceticismo', 
    // Medievais
    ESCOLASTICA: 'Escolástica',
    // Modernas
    RACIONALISMO: 'Racionalismo',
    EMPIRISMO: 'Empirismo',
    ILUMINISMO: 'Iluminismo',
    IDEALISMO_ALEMAO: 'Idealismo Alemão',
    // Contemporâneas
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
 */
export const PHILOSOPHERS_DATA = {
    // --- ANTIGUIDADE ---
    // Pré-Socráticos
    21: { date: -624, name: 'Tales de Mileto', school: SCHOOLS.PRE_SOCRATICO_MILETO, era: 'Antiga', predecessors: [], keyConcepts: [108, 109], description: 'Considerado o primeiro filósofo, buscou a origem de tudo na água.', image: 'assets/game/images/philosophers/tales.png', pos: { x: '15%', y: '50%' } },
    22: { date: -610, name: 'Anaximandro', school: SCHOOLS.PRE_SOCRATICO_MILETO, era: 'Antiga', predecessors: [21], keyConcepts: [108, 110], description: 'Propôs o "Ápeiron" (o ilimitado) como o princípio fundamental do universo.', image: 'assets/game/images/philosophers/anaximandro.png', pos: { x: '50%', y: '50%' } },
    23: { date: -585, name: 'Anaxímenes', school: SCHOOLS.PRE_SOCRATICO_MILETO, era: 'Antiga', predecessors: [22], keyConcepts: [108, 111], description: 'Defendia que o ar, através da rarefação e condensação, formava todas as coisas.', image: 'assets/game/images/philosophers/anaximenes.png', pos: { x: '85%', y: '50%' } },
    35: { date: -570, name: 'Xenófanes', school: SCHOOLS.PRE_SOCRATICO_ELEIA, era: 'Antiga', predecessors: [], keyConcepts: [126], description: 'Criticou a representação antropomórfica dos deuses.', image: 'assets/game/images/philosophers/xenofanes.png', pos: { x: '20%', y: '50%' } },
    26: { date: -515, name: 'Parmênides', school: SCHOOLS.PRE_SOCRATICO_ELEIA, era: 'Antiga', predecessors: [35], keyConcepts: [116], description: 'Afirmou que "o Ser é e o Não-Ser não é".', image: 'assets/game/images/philosophers/parmenides.png', pos: { x: '50%', y: '50%' } },
    27: { date: -490, name: 'Zenão de Eleia', school: SCHOOLS.PRE_SOCRATICO_ELEIA, era: 'Antiga', predecessors: [26], keyConcepts: [117], description: 'Criou paradoxos para defender que o movimento é uma ilusão.', image: 'assets/game/images/philosophers/zenao.png', pos: { x: '80%', y: '50%' } },
    24: { date: -570, name: 'Pitágoras', school: SCHOOLS.PITAGORISMO, era: 'Antiga', predecessors: [], keyConcepts: [112, 113], description: 'Místico e matemático que via os números como a essência da realidade.', image: 'assets/game/images/philosophers/pitagoras.png', pos: { x: '25%', y: '50%' } },
    39: { date: -470, name: 'Filolau', school: SCHOOLS.PITAGORISMO, era: 'Antiga', predecessors: [24], keyConcepts: [129], description: 'Propôs que a Terra não era o centro do universo.', image: 'assets/game/images/philosophers/filolau.png', pos: { x: '75%', y: '50%' } },
    25: { date: -535, name: 'Heráclito', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [], keyConcepts: [114, 115], description: 'O filósofo do "devir". Para ele, tudo flui.', image: 'assets/game/images/philosophers/heraclito.png', pos: { x: '15%', y: '50%' } },
    28: { date: -495, name: 'Empédocles', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [], keyConcepts: [118, 119], description: 'Propôs os quatro elementos movidos pelo Amor e pelo Ódio.', image: 'assets/game/images/philosophers/empedocles.png', pos: { x: '40%', y: '50%' } },
    36: { date: -500, name: 'Leucipo', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [], keyConcepts: [120], description: 'Fundador do atomismo.', image: 'assets/game/images/philosophers/leucipo.png', pos: { x: '65%', y: '50%' } },
    29: { date: -460, name: 'Demócrito', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [36], keyConcepts: [120], description: 'Desenvolveu o atomismo.', image: 'assets/game/images/philosophers/democrito.png', pos: { x: '90%', y: '50%' } },
    30: { date: -490, name: 'Protágoras', school: SCHOOLS.SOFISMO, era: 'Antiga', predecessors: [], keyConcepts: [121], description: '"O homem é a medida de todas as coisas".', image: 'assets/game/images/philosophers/protagoras.png', pos: { x: '20%', y: '50%' } },
    37: { date: -485, name: 'Górgias', school: SCHOOLS.SOFISMO, era: 'Antiga', predecessors: [26], keyConcepts: [127], description: 'Mestre da retórica e do ceticismo.', image: 'assets/game/images/philosophers/gorgias.png', pos: { x: '50%', y: '50%' } },
    38: { date: -450, name: 'Trasímaco', school: SCHOOLS.SOFISMO, era: 'Antiga', predecessors: [30, 37], keyConcepts: [128], description: 'Defendia que a justiça é "o interesse do mais forte".', image: 'assets/game/images/philosophers/trasimaco.png', pos: { x: '80%', y: '50%' } },
    
    // Período Clássico e Helenístico
    1: { date: -470, name: 'Sócrates', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [30], keyConcepts: [101, 102], description: 'O mestre do questionamento. "Só sei que nada sei".', image: 'assets/game/images/philosophers/socrates.png', pos: { x: '15%', y: '50%' } },
    2: { date: -427, name: 'Platão', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [1, 24, 26], keyConcepts: [103, 104], description: 'Discípulo de Sócrates, idealizou um mundo de formas perfeitas.', image: 'assets/game/images/philosophers/platao.png', pos: { x: '50%', y: '50%' } },
    3: { date: -384, name: 'Aristóteles', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [2], keyConcepts: [105, 106], description: 'Fundador da lógica formal e defensor do conhecimento empírico.', image: 'assets/game/images/philosophers/aristoteles.png', pos: { x: '85%', y: '50%' } },
    41: { date: -430, name: 'Xenofonte', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [1], keyConcepts: [130], description: 'Historiador e discípulo de Sócrates.', image: 'assets/game/images/philosophers/xenofonte.png', pos: { x: '30%', y: '80%' } },
    40: { date: -445, name: 'Antístenes', school: SCHOOLS.CINISMO, era: 'Antiga', predecessors: [1], keyConcepts: [123], description: 'Fundador da filosofia cínica.', image: 'assets/game/images/philosophers/antistenes.png', pos: { x: '30%', y: '50%' } },
    32: { date: -412, name: 'Diógenes de Sinope', school: SCHOOLS.CINISMO, era: 'Antiga', predecessors: [40], keyConcepts: [123], description: 'O Cínico que vivia num barril.', image: 'assets/game/images/philosophers/diogenes.png', pos: { x: '70%', y: '50%' } },
    31: { date: -341, name: 'Epicuro', school: SCHOOLS.EPICURISMO, era: 'Antiga', predecessors: [29], keyConcepts: [122], description: 'Defendia que a felicidade é a busca do prazer moderado.', image: 'assets/game/images/philosophers/epicuro.png', pos: { x: '50%', y: '50%' } },
    33: { date: -334, name: 'Zenão de Cítio', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [32], keyConcepts: [107, 124], description: 'Fundador do Estoicismo.', image: 'assets/game/images/philosophers/zenao_citio.png', pos: { x: '10%', y: '50%' } },
    42: { date: -280, name: 'Crisipo', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [33], keyConcepts: [131], description: 'O "segundo fundador" do Estoicismo.', image: 'assets/game/images/philosophers/crisipo.png', pos: { x: '30%', y: '50%' } },
    4: { date: -4, name: 'Sêneca', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [33, 42], keyConcepts: [107], description: 'Ensinava sobre a serenidade da alma (apatheia).', image: 'assets/game/images/philosophers/seneca.png', pos: { x: '50%', y: '50%' } },
    46: { date: 55, name: 'Epiteto', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [4], keyConcepts: [134], description: 'Ensinou a "dicotomia do controle".', image: 'assets/game/images/philosophers/epiteto.png', pos: { x: '70%', y: '50%' } },
    47: { date: 121, name: 'Marco Aurélio', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [46], keyConcepts: [135], description: 'Imperador-filósofo romano, autor das "Meditações".', image: 'assets/game/images/philosophers/marco_aurelio.png', pos: { x: '90%', y: '50%' } },
    34: { date: 204, name: 'Plotino', school: SCHOOLS.NEOPLATONISMO, era: 'Antiga', predecessors: [2], keyConcepts: [125], description: 'Sistematizador do Neoplatonismo, descreveu a realidade como emanação do Uno.', image: 'assets/game/images/philosophers/plotino.png', pos: { x: '50%', y: '50%' } },

    // --- IDADE MÉDIA ---
    5: { date: 354, name: 'Santo Agostinho', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [2, 34], keyConcepts: [201], description: 'Fundiu a filosofia neoplatônica com o cristianismo.', image: 'assets/game/images/philosophers/augustine.png', pos: { x: '25%', y: '50%' } },
    6: { date: 1225, name: 'Tomás de Aquino', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [3, 5], keyConcepts: [202], description: 'Sintetizou o pensamento aristotélico com a doutrina cristã.', image: 'assets/game/images/philosophers/aquinas.png', pos: { x: '75%', y: '50%' } },

    // --- MODERNIDADE ---
    7: { date: 1596, name: 'Descartes', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [], keyConcepts: [301, 302], description: '"Penso, logo existo." O pai da filosofia moderna.', image: 'assets/game/images/philosophers/descartes.png', pos: { x: '20%', y: '50%' } },
    8: { date: 1632, name: 'Spinoza', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [7], keyConcepts: [303], description: 'Via Deus e a Natureza como uma única substância.', image: 'assets/game/images/philosophers/spinoza.png', pos: { x: '50%', y: '50%' } },
    9: { date: 1632, name: 'John Locke', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [], keyConcepts: [304, 305], description: 'Defensor da mente como uma "tábula rasa".', image: 'assets/game/images/philosophers/locke.png', pos: { x: '20%', y: '50%' } },
    10: { date: 1711, name: 'David Hume', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [9], keyConcepts: [306], description: 'Levou o empirismo ao seu ceticismo radical.', image: 'assets/game/images/philosophers/hume.png', pos: { x: '50%', y: '50%' } },
    11: { date: 1724, name: 'Kant', school: SCHOOLS.ILUMINISMO, era: 'Moderna', predecessors: [7, 10], keyConcepts: [307, 308], description: 'Realizou a "revolução copernicana" na filosofia.', image: 'assets/game/images/philosophers/kant.png', pos: { x: '50%', y: '50%' } },
    12: { date: 1770, name: 'Hegel', school: SCHOOLS.IDEALISMO_ALEMAO, era: 'Moderna', predecessors: [11], keyConcepts: [309], description: 'Desenvolveu um sistema dialético para explicar a história.', image: 'assets/game/images/philosophers/hegel.png', pos: { x: '50%', y: '50%' } },

    // --- CONTEMPORÂNEA ---
    13: { date: 1818, name: 'Karl Marx', school: SCHOOLS.MATERIALISMO, era: 'Contemporânea', predecessors: [12], keyConcepts: [401, 402], description: 'Crítico do capitalismo que via a história como uma luta de classes.', image: 'assets/game/images/philosophers/marx.png', pos: { x: '50%', y: '50%' } },
    14: { date: 1844, name: 'Nietzsche', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [2, 11], keyConcepts: [403, 404], description: 'Proclamou a "morte de Deus" e exaltou o Super-Homem.', image: 'assets/game/images/philosophers/nietzsche.png', pos: { x: '20%', y: '50%' } },
    15: { date: 1905, name: 'Sartre', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [405, 406], description: '"A existência precede a essência".', image: 'assets/game/images/philosophers/sartre.png', pos: { x: '50%', y: '35%' } },
    16: { date: 1908, name: 'Simone de Beauvoir', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [15], keyConcepts: [407], description: '"Não se nasce mulher, torna-se.".', image: 'assets/game/images/philosophers/beauvoir.png', pos: { x: '50%', y: '65%' } },
    19: { date: 1903, name: 'Adorno', school: SCHOOLS.ESCOLA_DE_FRANKFURT, era: 'Contemporânea', predecessors: [13, 12], keyConcepts: [411], description: 'Crítico da "indústria cultural" e da razão instrumental.', image: 'assets/game/images/philosophers/adorno.png', pos: { x: '50%', y: '50%' } },
    17: { date: 1926, name: 'Foucault', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [408, 409], description: 'Analisou as relações entre poder, conhecimento e discurso.', image: 'assets/game/images/philosophers/foucault.png', pos: { x: '20%', y: '50%' } },
    18: { date: 1930, name: 'Derrida', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17], keyConcepts: [410], description: 'Criador do desconstrucionismo.', image: 'assets/game/images/philosophers/derrida.png', pos: { x: '50%', y: '50%' } },
    20: { date: 1959, name: 'Byung-Chul Han', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17, 19], keyConcepts: [412], description: 'Analisa a "sociedade do cansaço".', image: 'assets/game/images/philosophers/byung-chul-han.png', pos: { x: '80%', y: '50%' } },
};