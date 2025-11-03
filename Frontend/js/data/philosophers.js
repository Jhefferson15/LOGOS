/**
 * philosophers.js
 * 
 * Este arquivo contém o banco de dados principal dos filósofos para o jogo.
 * Cada filósofo é um objeto com informações essenciais como data de nascimento,
 * escola filosófica, conceitos-chave e predecessores, permitindo a criação de
 * mecânicas de jogo complexas como linhas de pensamento e evolução conceitual.
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
    CETISCISMO: 'Ceticismo', // Adicionada para melhor categorização
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
    21: { date: -624, name: 'Tales de Mileto', school: SCHOOLS.PRE_SOCRATICO_MILETO, era: 'Antiga', predecessors: [], keyConcepts: [108, 109], description: 'Considerado o primeiro filósofo, buscou a origem de tudo na água.', image: 'assets/game/images/philosophers/tales.png' },
    22: { date: -610, name: 'Anaximandro', school: SCHOOLS.PRE_SOCRATICO_MILETO, era: 'Antiga', predecessors: [21], keyConcepts: [108, 110], description: 'Propôs o "Ápeiron" (o ilimitado) como o princípio fundamental do universo.', image: 'assets/game/images/philosophers/anaximandro.png' },
    35: { date: -570, name: 'Xenófanes', school: SCHOOLS.PRE_SOCRATICO_ELEIA, era: 'Antiga', predecessors: [], keyConcepts: [126], description: 'Poeta e filósofo que criticou a representação antropomórfica dos deuses, sugerindo um deus único e abstrato.', image: 'assets/game/images/philosophers/xenofanes.png' }, // NOVA ADIÇÃO
    23: { date: -585, name: 'Anaxímenes', school: SCHOOLS.PRE_SOCRATICO_MILETO, era: 'Antiga', predecessors: [22], keyConcepts: [108, 111], description: 'Defendia que o ar, através da rarefação e condensação, formava todas as coisas.', image: 'assets/game/images/philosophers/anaximenes.png' },
    24: { date: -570, name: 'Pitágoras', school: SCHOOLS.PITAGORISMO, era: 'Antiga', predecessors: [], keyConcepts: [112, 113], description: 'Místico e matemático que via os números como a essência da realidade.', image: 'assets/game/images/philosophers/pitagoras.png' },
    25: { date: -535, name: 'Heráclito', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [], keyConcepts: [114, 115], description: 'O filósofo do "devir". Para ele, tudo flui e a guerra é a mãe de todas as coisas.', image: 'assets/game/images/philosophers/heraclito.png' },
    26: { date: -515, name: 'Parmênides', school: SCHOOLS.PRE_SOCRATICO_ELEIA, era: 'Antiga', predecessors: [35], keyConcepts: [116], description: 'Afirmou que "o Ser é e o Não-Ser não é", negando a realidade do movimento e da mudança.', image: 'assets/game/images/philosophers/parmenides.png' },
    27: { date: -490, name: 'Zenão de Eleia', school: SCHOOLS.PRE_SOCRATICO_ELEIA, era: 'Antiga', predecessors: [26], keyConcepts: [117], description: 'Criou paradoxos famosos para defender que o movimento é uma ilusão dos sentidos.', image: 'assets/game/images/philosophers/zenao.png' },
    28: { date: -495, name: 'Empédocles', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [], keyConcepts: [118, 119], description: 'Propôs os quatro elementos (terra, ar, fogo, água) movidos pelo Amor e pelo Ódio.', image: 'assets/game/images/philosophers/empedocles.png' },
    36: { date: -500, name: 'Leucipo', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [], keyConcepts: [120], description: 'O mestre de Demócrito e o verdadeiro fundador do atomismo, postulando que a realidade é feita de átomos indivisíveis e do vazio.', image: 'assets/game/images/philosophers/leucipo.png' }, // NOVA ADIÇÃO
    29: { date: -460, name: 'Demócrito', school: SCHOOLS.PRE_SOCRATICO_PLURALISTA, era: 'Antiga', predecessors: [36], keyConcepts: [120], description: 'Desenvolveu o atomismo, a teoria de que tudo é composto por átomos e vazio.', image: 'assets/game/images/philosophers/democrito.png' },
    37: { date: -485, name: 'Górgias', school: SCHOOLS.SOFISMO, era: 'Antiga', predecessors: [26], keyConcepts: [127], description: 'Mestre da retórica e do ceticismo, famoso por suas três teses: nada existe; se existisse, não poderia ser conhecido; se fosse conhecido, não poderia ser comunicado.', image: 'assets/game/images/philosophers/gorgias.png' }, // NOVA ADIÇÃO
    30: { date: -490, name: 'Protágoras', school: SCHOOLS.SOFISMO, era: 'Antiga', predecessors: [], keyConcepts: [121], description: 'Sofista famoso pelo lema "O homem é a medida de todas as coisas".', image: 'assets/game/images/philosophers/protagoras.png' },
    38: { date: -450, name: 'Trasímaco', school: SCHOOLS.SOFISMO, era: 'Antiga', predecessors: [30, 37], keyConcepts: [128], description: 'Sofista conhecido por seu argumento em "A República" de Platão, de que a justiça é simplesmente "o interesse do mais forte".', image: 'assets/game/images/philosophers/trasimaco.png' }, // NOVA ADIÇÃO
    39: { date: -470, name: 'Filolau', school: SCHOOLS.PITAGORISMO, era: 'Antiga', predecessors: [24], keyConcepts: [129], description: 'Sistematizador do pitagorismo, foi um dos primeiros a propor que a Terra não era o centro do universo, mas girava em torno de um "fogo central".', image: 'assets/game/images/philosophers/filolau.png' }, // NOVA ADIÇÃO

    // Período Clássico e Helenístico
    1: { date: -470, name: 'Sócrates', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [30], keyConcepts: [101, 102], description: 'O mestre do questionamento. "Só sei que nada sei" e a virtude é conhecimento.', image: 'assets/game/images/philosophers/socrates.png' },
    40: { date: -445, name: 'Antístenes', school: SCHOOLS.CINISMO, era: 'Antiga', predecessors: [1], keyConcepts: [123], description: 'Discípulo de Sócrates e considerado o fundador da filosofia cínica. Defendia uma vida virtuosa baseada na autossuficiência e no desprezo pelos bens materiais.', image: 'assets/game/images/philosophers/antistenes.png' }, // NOVA ADIÇÃO
    41: { date: -430, name: 'Xenofonte', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [1], keyConcepts: [130], description: 'Historiador e discípulo de Sócrates, cujos escritos, como "Memoráveis", são uma fonte crucial sobre a vida e o pensamento de seu mestre, com um viés mais prático e menos metafísico que o de Platão.', image: 'assets/game/images/philosophers/xenofonte.png' }, // NOVA ADIÇÃO
    2: { date: -427, name: 'Platão', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [1, 24, 26], keyConcepts: [103, 104], description: 'Discípulo de Sócrates, idealizou um mundo de formas perfeitas e imutáveis.', image: 'assets/game/images/philosophers/platao.png' },
    32: { date: -412, name: 'Diógenes de Sinope', school: SCHOOLS.CINISMO, era: 'Antiga', predecessors: [40], keyConcepts: [123], description: 'O Cínico que vivia num barril, desprezava as convenções e buscava a virtude na simplicidade.', image: 'assets/game/images/philosophers/diogenes.png' },
    3: { date: -384, name: 'Aristóteles', school: SCHOOLS.GREGA, era: 'Antiga', predecessors: [2], keyConcepts: [105, 106], description: 'Fundador da lógica formal e defensor do conhecimento empírico e da ética das virtudes.', image: 'assets/game/images/philosophers/aristoteles.png' },
    31: { date: -341, name: 'Epicuro', school: SCHOOLS.EPICURISMO, era: 'Antiga', predecessors: [29], keyConcepts: [122], description: 'Defendia que a felicidade é a busca do prazer moderado e da tranquilidade da alma.', image: 'assets/game/images/philosophers/epicuro.png' },
    33: { date: -334, name: 'Zenão de Cítio', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [32], keyConcepts: [107, 124], description: 'Fundador do Estoicismo, ensinava a virtude como a única via para a felicidade.', image: 'assets/game/images/philosophers/zenao_citio.png' },
    42: { date: -280, name: 'Crisipo', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [33], keyConcepts: [131], description: 'Conhecido como o "segundo fundador" do Estoicismo, sistematizou sua lógica e física, tornando-a uma das filosofias mais influentes da antiguidade.', image: 'assets/game/images/philosophers/crisipo.png' }, // NOVA ADIÇÃO
    43: { date: -214, name: 'Carnéades', school: SCHOOLS.CETISCISMO, era: 'Antiga', predecessors: [2], keyConcepts: [132], description: 'Líder da Academia de Platão em sua fase cética, era famoso por sua habilidade de argumentar de forma convincente a favor e contra qualquer posição, defendendo um ceticismo probabilístico.', image: 'assets/game/images/philosophers/carneades.png' }, // NOVA ADIÇÃO

    // Período Romano
    44: { date: -94, name: 'Lucrécio', school: SCHOOLS.EPICURISMO, era: 'Antiga', predecessors: [31], keyConcepts: [120, 122], description: 'Poeta-filósofo romano autor de "De Rerum Natura" ("Sobre a Natureza das Coisas"), uma obra épica que explica o universo através do atomismo epicurista.', image: 'assets/game/images/philosophers/lucrecio.png' }, // NOVA ADIÇÃO
    45: { date: -106, name: 'Cícero', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [2, 3, 33], keyConcepts: [133], description: 'Orador, político e filósofo romano. Embora eclético, foi o principal responsável por traduzir e popularizar a filosofia grega, especialmente o Estoicismo, para o mundo latino.', image: 'assets/game/images/philosophers/cicero.png' }, // NOVA ADIÇÃO
    4: { date: -4, name: 'Sêneca', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [33, 42], keyConcepts: [107], description: 'Filósofo estóico que ensinava sobre a serenidade da alma (apatheia) diante do destino.', image: 'assets/game/images/philosophers/seneca.png' },
    46: { date: 55, name: 'Epiteto', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [4], keyConcepts: [134], description: 'Ex-escravo que se tornou um proeminente filósofo estoico. Ensinou a "dicotomia do controle": focar apenas no que podemos controlar (nossos julgamentos) e aceitar o resto com serenidade.', image: 'assets/game/images/philosophers/epiteto.png' }, // NOVA ADIÇÃO
    47: { date: 121, name: 'Marco Aurélio', school: SCHOOLS.ESTOICISMO, era: 'Antiga', predecessors: [46], keyConcepts: [135], description: 'Imperador-filósofo romano, autor das "Meditações", um diário pessoal onde aplicava os princípios estoicos para governar a si mesmo e ao Império com justiça e tranquilidade.', image: 'assets/game/images/philosophers/marco_aurelio.png' }, // NOVA ADIÇÃO
    48: { date: 160, name: 'Sexto Empírico', school: SCHOOLS.CETISCISMO, era: 'Antiga', predecessors: [43], keyConcepts: [136], description: 'Médico e filósofo, principal representante do ceticismo pirrônico. Suas obras são a fonte mais completa que temos hoje sobre o ceticismo na antiguidade.', image: 'assets/game/images/philosophers/sexto_empirico.png' }, // NOVA ADIÇÃO
    49: { date: 46, name: 'Plutarco', school: SCHOOLS.NEOPLATONISMO, era: 'Antiga', predecessors: [2], keyConcepts: [137], description: 'Historiador e ensaísta grego da era romana. Como filósofo platônico, focou em questões de ética e moral, buscando aplicar a filosofia à vida cotidiana.', image: 'assets/game/images/philosophers/plutarco.png' }, // NOVA ADIÇÃO
    34: { date: 204, name: 'Plotino', school: SCHOOLS.NEOPLATONISMO, era: 'Antiga', predecessors: [2], keyConcepts: [125], description: 'O grande sistematizador do Neoplatonismo, descreveu a realidade como emanação do Uno.', image: 'assets/game/images/philosophers/plotino.png' },
    50: { date: 234, name: 'Porfírio', school: SCHOOLS.NEOPLATONISMO, era: 'Antiga', predecessors: [34], keyConcepts: [138], description: 'Discípulo leal de Plotino, editou e publicou sua obra "As Enéadas". Também foi um lógico influente, cuja "Isagoge" foi um texto padrão de lógica por mais de mil anos.', image: 'assets/game/images/philosophers/porfirio.png' }, // NOVA ADIÇÃO
    51: { date: 412, name: 'Proclo', school: SCHOOLS.NEOPLATONISMO, era: 'Antiga', predecessors: [34, 50], keyConcepts: [139], description: 'Um dos últimos grandes filósofos pagãos, foi um sistematizador meticuloso do Neoplatonismo, criando uma vasta e complexa estrutura metafísica que influenciou o pensamento medieval.', image: 'assets/game/images/philosophers/proclo.png' }, // NOVA ADIÇÃO
    52: { date: 355, name: 'Hipátia de Alexandria', school: SCHOOLS.NEOPLATONISMO, era: 'Antiga', predecessors: [34], keyConcepts: [140], description: 'Brilhante matemática, astrônoma e filósofa, foi a chefe da escola neoplatônica em Alexandria. É celebrada como um ícone da razão e do martírio intelectual.', image: 'assets/game/images/philosophers/hipatia.png' }, // NOVA ADIÇÃO
    
    // --- IDADE MÉDIA ---
    5: { date: 354, name: 'Santo Agostinho', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [2, 34], keyConcepts: [201], description: 'Teólogo que fundiu a filosofia neoplatônica com o cristianismo.', image: 'assets/game/images/philosophers/augustine.png' },
    53: { date: 480, name: 'Boécio', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [2, 3, 5], keyConcepts: [203], description: 'Considerado "o último romano e o primeiro escolástico". Sua obra "A Consolação da Filosofia", escrita na prisão, é uma ponte fundamental entre o pensamento antigo e o medieval.', image: 'assets/game/images/philosophers/boecio.png' }, // NOVA ADIÇÃO
    6: { date: 1225, name: 'Tomás de Aquino', school: SCHOOLS.ESCOLASTICA, era: 'Medieval', predecessors: [3, 5], keyConcepts: [202], description: 'Sintetizou o pensamento aristotélico com a doutrina cristã.', image: 'assets/game/images/philosophers/aquinas.png' },

    // --- MODERNIDADE ---
    7: { date: 1596, name: 'Descartes', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [], keyConcepts: [301, 302], description: '"Penso, logo existo." O pai da filosofia moderna e do racionalismo.', image: 'assets/game/images/philosophers/descartes.png' },
    8: { date: 1632, name: 'Spinoza', school: SCHOOLS.RACIONALISMO, era: 'Moderna', predecessors: [7], keyConcepts: [303], description: 'Via Deus e a Natureza como uma única substância divina e infinita.', image: 'assets/game/images/philosophers/spinoza.png' },
    9: { date: 1632, name: 'John Locke', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [], keyConcepts: [304, 305], description: 'Defensor da mente como uma "tábula rasa" e dos direitos naturais do homem.', image: 'assets/game/images/philosophers/locke.png' },
    10: { date: 1711, name: 'David Hume', school: SCHOOLS.EMPIRISMO, era: 'Moderna', predecessors: [9], keyConcepts: [306], description: 'Levou o empirismo ao seu ceticismo radical, questionando a causalidade.', image: 'assets/game/images/philosophers/hume.png' },
    11: { date: 1724, name: 'Kant', school: SCHOOLS.ILUMINISMO, era: 'Moderna', predecessors: [7, 10], keyConcepts: [307, 308], description: 'Realizou a "revolução copernicana" na filosofia, unindo racionalismo e empirismo.', image: 'assets/game/images/philosophers/kant.png' },
    12: { date: 1770, name: 'Hegel', school: SCHOOLS.IDEALISMO_ALEMAO, era: 'Moderna', predecessors: [11], keyConcepts: [309], description: 'Desenvolveu um sistema dialético para explicar o progresso do Espírito Absoluto na história.', image: 'assets/game/images/philosophers/hegel.png' },

    // --- CONTEMPORÂNEA ---
    13: { date: 1818, name: 'Karl Marx', school: SCHOOLS.MATERIALISMO, era: 'Contemporânea', predecessors: [12], keyConcepts: [401, 402], description: 'Crítico do capitalismo que via a história como uma luta de classes.', image: 'assets/game/images/philosophers/marx.png' },
    14: { date: 1844, name: 'Nietzsche', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [2, 11], keyConcepts: [403, 404], description: 'Proclamou a "morte de Deus" e exaltou o Super-Homem e a vontade de poder.', image: 'assets/game/images/philosophers/nietzsche.png' },
    15: { date: 1905, name: 'Sartre', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [405, 406], description: 'Defendia que "a existência precede a essência", tornando o homem radicalmente livre.', image: 'assets/game/images/philosophers/sartre.png' },
    16: { date: 1908, name: 'Simone de Beauvoir', school: SCHOOLS.EXISTENCIALISMO, era: 'Contemporânea', predecessors: [15], keyConcepts: [407], description: '"Não se nasce mulher, torna-se." Pioneira do feminismo existencialista.', image: 'assets/game/images/philosophers/beauvoir.png' },
    17: { date: 1926, name: 'Foucault', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [14], keyConcepts: [408, 409], description: 'Analisou as relações entre poder, conhecimento e discurso na sociedade.', image: 'assets/game/images/philosophers/foucault.png' },
    18: { date: 1930, name: 'Derrida', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17], keyConcepts: [410], description: 'Criador do desconstrucionismo, que desafia as oposições binárias do pensamento ocidental.', image: 'assets/game/images/philosophers/derrida.png' },
    19: { date: 1903, name: 'Adorno', school: SCHOOLS.ESCOLA_DE_FRANKFURT, era: 'Contemporânea', predecessors: [13, 12], keyConcepts: [411], description: 'Crítico da "indústria cultural" e da razão instrumental na sociedade de massas.', image: 'assets/game/images/philosophers/adorno.png' },
    20: { date: 1959, name: 'Byung-Chul Han', school: SCHOOLS.POS_ESTRUTURALISMO, era: 'Contemporânea', predecessors: [17, 19], keyConcepts: [412], description: 'Analisa a "sociedade do cansaço", onde a exploração agora é autoimposta.', image: 'assets/game/images/philosophers/byung-chul-han.png' },
};