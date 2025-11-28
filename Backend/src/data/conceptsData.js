/**
 * conceptsData.js
 * 
 * Backend version of the concepts database.
 */

const CONCEPTS_DATA_1 = {
    // --- Conceitos Antigos (IDs 1xx) ---
    101: { name: 'Maiêutica', philosophers: [1], points: 30, description: 'O método socrático de "dar à luz" às ideias por meio de um diálogo de perguntas e respostas, levando o interlocutor ao conhecimento.' },
    102: { name: 'Ironia Socrática', philosophers: [1], points: 20, description: 'A famosa postura de fingir ignorância para expor as contradições e a falta de conhecimento real do interlocutor.' },
    103: { name: 'Mundo das Ideias', philosophers: [2], points: 35, description: 'A teoria central de Platão, que postula a existência de um reino de Formas perfeitas, eternas e imutáveis, do qual nosso mundo é uma mera sombra.' },
    104: { name: 'Alegoria da Caverna', philosophers: [2], points: 25, description: 'A célebre metáfora platônica sobre a jornada da alma, da ignorância (sombras na caverna) para o conhecimento verdadeiro (a luz do sol, o Bem).' },
    105: { name: 'Ética das Virtudes', philosophers: [3], points: 30, description: 'A ética aristotélica focada no caráter e na busca pela "vida boa" (eudaimonia), alcançada pela prática da virtude como um justo meio-termo.' },
    106: { name: 'Potência e Ato', philosophers: [3], points: 25, description: 'A distinção fundamental de Aristóteles para explicar a mudança: a potência é a capacidade de ser, enquanto o ato é a realização dessa capacidade.' },
    107: { name: 'Estoicismo', philosophers: [33, 4], points: 20, description: 'Filosofia que prega a aceitação do destino (Logos), o controle sobre as paixões (apatheia) e o foco naquilo que podemos controlar.' },
    108: { name: 'Arché', philosophers: [21, 22, 23], points: 30, description: 'O conceito central dos pré-socráticos: a busca pelo princípio ou substância fundamental da qual todas as coisas derivam.' },
    109: { name: 'Hilozoísmo', philosophers: [21], points: 15, description: 'A crença de que a própria matéria possui vida e alma, associada à ideia de Tales de que "todas as coisas estão cheias de deuses".' },
    110: { name: 'Ápeiron', philosophers: [22], points: 25, description: 'O princípio ilimitado, infinito e indeterminado proposto por Anaximandro como a origem de tudo, de onde os opostos se separam.' },
    111: { name: 'Pneuma (Ar como Arché)', philosophers: [23], points: 20, description: 'A teoria de Anaxímenes de que o ar é a substância primordial, gerando tudo através de sua rarefação e condensação.' },
    112: { name: 'Metempsicose', philosophers: [24], points: 25, description: 'A doutrina pitagórica da transmigração da alma, que reencarna em diferentes corpos até atingir a purificação (katharsis).' },
    113: { name: 'Harmonia das Esferas', philosophers: [24], points: 20, description: 'A ideia de que os corpos celestes, em seus movimentos matematicamente perfeitos, produzem uma música divina e inaudível.' },
    114: { name: 'Devir (Panta Rhei)', philosophers: [25], points: 30, description: 'A doutrina de Heráclito de que a realidade está em fluxo constante e perpétua mudança. "Ninguém se banha duas vezes no mesmo rio".' },
    115: { name: 'Logos', philosophers: [25], points: 35, description: 'A razão ou lei universal que governa toda a mudança no cosmos, mantendo a unidade através da tensão dos opostos.' },
    116: { name: 'O Ser e o Não-Ser', philosophers: [26], points: 35, description: 'O pilar do pensamento de Parmênides: o Ser é uno, eterno e imóvel, enquanto o Não-Ser (e, portanto, a mudança) é impensável e impossível.' },
    117: { name: 'Paradoxos de Zenão', philosophers: [27], points: 25, description: 'Argumentos lógicos (como Aquiles e a Tartaruga) para provar que a percepção sensorial do movimento é contraditória e ilusória.' },
    118: { name: 'Quatro Elementos', philosophers: [28], points: 20, description: 'A teoria de Empédocles de que tudo é composto por quatro "raízes": terra, água, ar e fogo.' },
    119: { name: 'Amor e Ódio (Philia e Neikos)', philosophers: [28], points: 20, description: 'As duas forças cósmicas que, segundo Empédocles, unem (Amor) e separam (Ódio) os quatro elementos, criando e destruindo o mundo.' },
    120: { name: 'Atomismo', philosophers: [29], points: 30, description: 'A teoria materialista de que o universo consiste em átomos (partículas indivisíveis e eternas) movendo-se no vazio.' },
    121: { name: 'Relativismo Sofista', philosophers: [30], points: 25, description: 'A ideia de que não há verdade absoluta, resumida na frase de Protágoras: "O homem é a medida de todas as coisas".' },
    122: { name: 'Ataraxia e Aponia', philosophers: [31], points: 30, description: 'O objetivo do Epicurismo: a tranquilidade da alma (ataraxia) e a ausência de dor no corpo (aponia), que constituem o verdadeiro prazer.' },
    123: { name: 'Cinismo', philosophers: [32], points: 25, description: 'Filosofia que defende uma vida de virtude na simplicidade, rejeitando radicalmente as convenções sociais, a riqueza e o poder.' },
    124: { name: 'Apatheia', philosophers: [33, 4], points: 25, description: 'Ideal estóico de serenidade e ausência de perturbação, alcançado através do domínio racional sobre as paixões e emoções.' },
    125: { name: 'Emanacionismo', philosophers: [34], points: 30, description: 'A doutrina neoplatônica de que toda a realidade "emana" ou flui hierarquicamente a partir de uma fonte única e perfeita, o Uno.' },

    // --- Conceitos Medievais (IDs 2xx) ---
    201: { name: 'Cidade de Deus', philosophers: [5], points: 25, description: 'A grande obra de Agostinho, que distingue a cidade terrena (marcada pelo pecado e amor próprio) e a cidade celestial (guiada pela fé e amor a Deus).' },
    202: { name: 'As Cinco Vias', philosophers: [6], points: 30, description: 'Os cinco argumentos lógicos de Tomás de Aquino para provar a existência de Deus a partir da observação do mundo natural (motor, causa, etc.).' },

    // --- Conceitos Modernos (IDs 3xx) ---
    301: { name: 'Dúvida Metódica', philosophers: [7], points: 25, description: 'O processo cético de Descartes de duvidar de tudo o que pode ser duvidado, a fim de encontrar uma base absolutamente certa para o conhecimento.' },
    302: { name: 'Cogito, Ergo Sum', philosophers: [7], points: 35, description: '"Penso, logo existo." A primeira certeza inabalável de Descartes, o fundamento de sua filosofia: a existência do eu como ser pensante.' },
    303: { name: 'Panteísmo', philosophers: [8], points: 20, description: 'A visão de Spinoza de que Deus e o universo são a mesma coisa (Deus sive Natura), uma única substância infinita com infinitos atributos.' },
    304: { name: 'Tábula Rasa', philosophers: [9], points: 20, description: 'A ideia empirista de que a mente humana nasce como uma "folha em branco", sem ideias inatas, e todo o conhecimento deriva da experiência.' },
    305: { name: 'Direitos Naturais', philosophers: [9], points: 25, description: 'Direitos inalienáveis que todo ser humano possui por natureza (vida, liberdade e propriedade), que o governo deve proteger.' },
    306: { name: 'Ceticismo Radical', philosophers: [10], points: 30, description: 'A conclusão de Hume de que a razão não pode justificar nossa crença em causa e efeito, indução ou no mundo exterior, que são baseados no hábito.' },
    307: { name: 'Imperativo Categórico', philosophers: [11], points: 40, description: 'O princípio moral supremo de Kant: "Aja apenas segundo uma máxima tal que possas querer ao mesmo tempo que se torne lei universal".' },
    308: { name: 'Juízo Sintético a Priori', philosophers: [11], points: 35, description: 'A grande descoberta de Kant: conhecimento que é universal e necessário (a priori) mas que também expande nosso saber sobre o mundo (sintético).' },
    309: { name: 'Dialética Hegeliana', philosophers: [12], points: 30, description: 'O motor da história e do pensamento, um processo de conflito e superação entre Tese, Antítese e Síntese que move o Espírito.' },

    // --- Conceitos Contemporâneos (IDs 4xx) ---
    401: { name: 'Luta de Classes', philosophers: [13], points: 25, description: 'O motor da história, segundo Marx, impulsionado pelo conflito entre a classe dominante (burguesia) e a classe explorada (proletariado).' },
    402: { name: 'Alienação', philosophers: [13], points: 20, description: 'No capitalismo, a separação do trabalhador do produto de seu trabalho, de si mesmo e dos outros, tornando-se uma mera engrenagem.' },
    403: { name: 'Vontade de Poder', philosophers: [14], points: 30, description: 'A força motriz fundamental, segundo Nietzsche, que impulsiona todos os seres a se expandirem, crescerem e dominarem seu ambiente.' },
    404: { name: 'Eterno Retorno', philosophers: [14], points: 35, description: 'O experimento mental nietzschiano: viver cada momento de sua vida com tal intensidade que você desejaria repeti-lo infinitamente.' },
    405: { name: 'Angústia Existencial', philosophers: [15], points: 25, description: 'O sentimento de vertigem e responsabilidade total que surge da consciência da nossa liberdade radical, pois somos "condenados a ser livres".' },
    406: { name: 'Má-fé', philosophers: [15, 16], points: 20, description: 'A autoenganação de negar a própria liberdade, agindo como se fôssemos objetos ou tivéssemos uma essência fixa, para fugir da angústia.' },
    407: { name: 'O Segundo Sexo', philosophers: [16], points: 30, description: 'A análise fundamental de Beauvoir sobre como a mulher foi historicamente construída como o "Outro" em relação ao homem, que é a norma.' },
    408: { name: 'Microfísica do Poder', philosophers: [17], points: 30, description: 'A teoria de Foucault de que o poder não é algo centralizado no Estado, mas uma rede difusa de relações exercida em todos os níveis da sociedade.' },
    409: { name: 'Sociedade Disciplinar', philosophers: [17], points: 25, description: 'Modelo social, analisado por Foucault, baseado na vigilância e normalização dos indivíduos em instituições como prisões, escolas e hospitais.' },
    410: { name: 'Desconstrução', philosophers: [18], points: 35, description: 'O método de Derrida para analisar textos, revelando e desfazendo as oposições binárias hierárquicas (fala/escrita, homem/mulher) que estruturam o pensamento ocidental.' },
    411: { name: 'Indústria Cultural', philosophers: [19], points: 25, description: 'A crítica de Adorno à produção em massa de arte e cultura como mercadorias padronizadas que pacificam e manipulam a sociedade.' },
    412: { name: 'Sociedade do Desempenho', philosophers: [20], points: 30, description: 'A tese de Byung-Chul Han de que a sociedade disciplinar foi substituída por uma onde o indivíduo se torna seu próprio explorador, buscando otimização constante.' },
};

module.exports = { CONCEPTS_DATA_1 };
