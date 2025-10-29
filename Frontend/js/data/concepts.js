/**
 * CONCEPTS_DATA
 * Banco de dados dos conceitos que os jogadores usarão para pontuar.
 * 
 * - id: Identificador único do conceito.
 * - name: Nome do conceito.
 * - points: Valor base da carta. Acertar = +points. Errar = -points / 2.
 * - description: Breve explicação para ajudar o jogador a fazer a conexão correta.
 */
export const CONCEPTS_DATA = {
    // --- Conceitos Antigos (IDs 1xx) ---
    101: { name: 'Maiêutica', points: 30, description: 'O método socrático de "dar à luz" às ideias por meio de perguntas.' },
    102: { name: 'Ironia Socrática', points: 20, description: 'Postura de fingir ignorância para levar o interlocutor a contradições.' },
    103: { name: 'Mundo das Ideias', points: 35, description: 'A teoria platônica de que existe um reino de formas perfeitas e imutáveis.' },
    104: { name: 'Alegoria da Caverna', points: 25, description: 'Metáfora sobre a jornada do filósofo do mundo das aparências para o do conhecimento.' },
    105: { name: 'Ética das Virtudes', points: 30, description: 'Foco no caráter e na busca pela "vida boa" (eudaimonia) através da mediania.' },
    106: { name: 'Potência e Ato', points: 25, description: 'A distinção aristotélica entre o que uma coisa pode ser e o que ela atualmente é.' },
    107: { name: 'Estoicismo', points: 20, description: 'Filosofia que prega a aceitação do destino e o controle sobre as próprias paixões.' },

    // --- Conceitos Medievais (IDs 2xx) ---
    201: { name: 'Cidade de Deus', points: 25, description: 'A distinção agostiniana entre a cidade terrena (pecado) e a cidade celestial (salvação).' },
    202: { name: 'As Cinco Vias', points: 30, description: 'Os argumentos de Tomás de Aquino para provar a existência de Deus pela razão.' },

    // --- Conceitos Modernos (IDs 3xx) ---
    301: { name: 'Dúvida Metódica', points: 25, description: 'O processo cartesiano de duvidar de tudo para encontrar uma certeza fundamental.' },
    302: { name: 'Cogito, Ergo Sum', points: 35, description: '"Penso, logo existo." A primeira certeza inabalável de Descartes.' },
    303: { name: 'Panteísmo', points: 20, description: 'A crença de que Deus e o universo são a mesma coisa (Deus sive Natura).' },
    304: { name: 'Tábula Rasa', points: 20, description: 'A ideia de que a mente humana nasce como uma "folha em branco", sem ideias inatas.' },
    305: { name: 'Direitos Naturais', points: 25, description: 'Direitos inalienáveis (vida, liberdade, propriedade) que precedem o governo.' },
    306: { name: 'Ceticismo Radical', points: 30, description: 'A conclusão de Hume de que não podemos ter certeza sobre relações de causa e efeito.' },
    307: { name: 'Imperativo Categórico', points: 40, description: 'O princípio moral de Kant: "Aja de tal forma que sua ação possa ser uma lei universal."' },
    308: { name: 'Juízo Sintético a Priori', points: 35, description: 'O conhecimento que é universal (a priori) mas que também expande nosso saber (sintético).' },
    309: { name: 'Dialética Hegeliana', points: 30, description: 'O processo histórico de Tese, Antítese e Síntese que move o Espírito.' },

    // --- Conceitos Contemporâneos (IDs 4xx) ---
    401: { name: 'Luta de Classes', points: 25, description: 'O motor da história, segundo Marx, impulsionado pelo conflito entre burguesia e proletariado.' },
    402: { name: 'Alienação', points: 20, description: 'A separação do trabalhador do produto de seu trabalho no sistema capitalista.' },
    403: { name: 'Vontade de Poder', points: 30, description: 'A força fundamental que impulsiona todos os seres a se expandirem e dominarem.' },
    404: { name: 'Eterno Retorno', points: 35, description: 'O teste existencial de viver cada momento de sua vida como se fosse repeti-lo para sempre.' },
    405: { name: 'Angústia Existencial', points: 25, description: 'O sentimento de responsabilidade total que vem da liberdade radical do ser humano.' },
    406: { name: 'Má-fé', points: 20, description: 'A autoenganação de negar a própria liberdade e agir como um objeto determinado.' },
    407: { name: 'O Segundo Sexo', points: 30, description: 'A análise da condição da mulher como o "Outro" na sociedade patriarcal.' },
    408: { name: 'Microfísica do Poder', points: 30, description: 'A ideia de que o poder não é centralizado, mas sim difuso e exercido em todas as relações sociais.' },
    409: { name: 'Sociedade Disciplinar', points: 25, description: 'Uma sociedade baseada na vigilância e normalização dos corpos em instituições como prisões e escolas.' },
    410: { name: 'Desconstrução', points: 35, description: 'Método de análise que revela as hierarquias e pressupostos ocultos nos textos.' },
    411: { name: 'Indústria Cultural', points: 25, description: 'A padronização da arte e da cultura como mercadorias para o consumo em massa.' },
    412: { name: 'Sociedade do Desempenho', points: 30, description: 'A evolução da sociedade disciplinar para uma onde o indivíduo se torna seu próprio explorador.' },
};