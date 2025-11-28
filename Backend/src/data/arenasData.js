/**
 * arenasData.js
 * 
 * Backend version of the arenas database.
 */

const { SCHOOLS } = require('./philosophersData');

const arenas = [
    {
        id: 1,
        name: "Berço do Pensamento",
        description: "A costa da Jônia e as colônias gregas, onde os primeiros filósofos ousaram trocar o mito pelo logos. Batalhas aqui são sobre encontrar o princípio (Arché) de todas as coisas.",
        trophyReq: 0,
        schools: [
            SCHOOLS.PRE_SOCRATICO_MILETO,
            SCHOOLS.PRE_SOCRATICO_ELEIA,
            SCHOOLS.PITAGORISMO,
            SCHOOLS.PRE_SOCRATICO_PLURALISTA
        ],
        image: "assets/arenas/berco_do_pensamento.png"
    },
    {
        id: 2,
        name: "Ágora de Atenas",
        description: "O coração da pólis, o palco do debate público. Aqui, a retórica afiada dos Sofistas enfrenta o método implacável de Sócrates. A verdade é forjada no fogo do diálogo.",
        trophyReq: 400,
        schools: [
            SCHOOLS.SOFISMO,
            SCHOOLS.GREGA
        ],
        image: "assets/arenas/atenas.png"
    },
    {
        id: 3,
        name: "Jardim de Epicuro",
        description: "Longe do barulho da política, um refúgio para buscar a ataraxia. Nesta arena, Estoicos, Epicuristas e Cínicos duelam sobre o verdadeiro caminho para a felicidade e a paz de espírito.",
        trophyReq: 800,
        schools: [
            SCHOOLS.EPICURISMO,
            SCHOOLS.ESTOICISMO,
            SCHOOLS.CINISMO,
            SCHOOLS.CETISCISMO
        ],
        image: "assets/arenas/jardim_de_epicuro.png"
    },
    {
        id: 4,
        name: "Biblioteca de Alexandria",
        description: "O último bastião do saber antigo. Sob a luz da grande biblioteca, os Neoplatônicos tecem complexos sistemas metafísicos, preparando a transição para uma nova era do pensamento.",
        trophyReq: 1100,
        schools: [
            SCHOOLS.NEOPLATONISMO
        ],
        image: "assets/arenas/biblioteca_alexandria.png"
    },
    {
        id: 5,
        name: "Catedral Escolástica",
        description: "Nas sombras imponentes das grandes catedrais, a fé busca o intelecto. Aqui, os mestres da Escolástica usam a lógica aristotélica para construir as fundações da teologia e da filosofia medieval.",
        trophyReq: 1400,
        schools: [
            SCHOOLS.ESCOLASTICA
        ],
        image: "assets/arenas/catedral_escolastica.png"
    },
    {
        id: 6,
        name: "Salão do Iluminismo",
        description: "A luz da razão contra as sombras do dogma. Racionalistas e Empiristas duelam para definir os limites do conhecimento humano, abrindo caminho para a era das revoluções.",
        trophyReq: 1700,
        schools: [
            SCHOOLS.RACIONALISMO,
            SCHOOLS.EMPIRISMO,
            SCHOOLS.ILUMINISMO
        ],
        image: "assets/arenas/salao_iluminismo.png"
    },
    {
        id: 7,
        name: "Cume do Idealismo",
        description: "O auge dos grandes sistemas filosóficos. No topo da montanha do pensamento alemão, a Dialética de Hegel desafia todos a compreenderem o desdobrar do Espírito Absoluto na história.",
        trophyReq: 2000,
        schools: [
            SCHOOLS.IDEALISMO_ALEMAO
        ],
        image: "assets/arenas/cume_idealismo.png"
    },
    {
        id: 8,
        name: "Fábrica da Revolução",
        description: "O chão de fábrica torna-se o campo de batalha das ideias. O Materialismo Histórico analisa as engrenagens da sociedade, prevendo um confronto inevitável que mudará o mundo.",
        trophyReq: 2600,
        schools: [
            SCHOOLS.MATERIALISMO
        ],
        image: "assets/arenas/fabrica_revolucao.png"
    },
    {
        id: 9,
        name: "Café Existencialista",
        description: "No coração da angústia e da liberdade do século XX. Entre a fumaça e o café, filósofos debatem a existência, o nada e a responsabilidade radical de criar a si mesmo.",
        trophyReq: 3800,
        schools: [
            SCHOOLS.EXISTENCIALISMO,
            SCHOOLS.FENOMENOLOGIA
        ],
        image: "assets/arenas/cafe_existencialista.png"
    },
    {
        id: 10,
        name: "Torre da Crítica",
        description: "Uma arena contemporânea onde as estruturas do poder, do conhecimento e da linguagem são implacavelmente desconstruídas. Nada é o que parece sob o olhar da Teoria Crítica e do Pós-Estruturalismo.",
        trophyReq: 4200,
        schools: [
            SCHOOLS.ESCOLA_DE_FRANKFURT,
            SCHOOLS.ESTRUTURALISMO,
            SCHOOLS.POS_ESTRUTURALISMO
        ],
        image: "assets/arenas/torre_da_critica.png"
    }
];

module.exports = { arenas };
