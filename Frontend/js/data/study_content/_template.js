// data/study_content/_template.js
/**
 * TEMPLATE: Study Content for [Philosopher Name] (ID: [ID])
 * 
 * INSTRUCTIONS:
 * 1. Copy this file and rename it to the philosopher's name (lowercase, e.g., "socrates.js")
 * 2. Replace [Philosopher Name] and [ID] with the actual values
 * 3. Update the export name (e.g., talesContent -> socratesContent)
 * 4. Fill in all sections with content
 * 5. Import this file in study_content.js and add to STUDY_CONTENT_DATA
 */

/**
 * @type {{
 *   realImage: string,
 *   totalPages: number,
 *   tableOfContents: Object.<number, string>,
 *   pages: Object.<string, string>,
 *   quiz: Array<{question: string, options: string[], answer: string}>,
 *   comic: string[]
 * }}
 */
export const templateContent = {
    // Path to the real photograph/portrait of the philosopher
    realImage: 'assets/game/images/philosophers/real/[philosopher_name].jpg',

    // Total number of pages in the study module (for progress calculation)
    totalPages: 10,

    // Table of contents: maps page numbers to chapter titles
    tableOfContents: {
        1: "Introdução: [Título do Capítulo 1]",
        3: "[Título do Capítulo 2]",
        5: "[Título do Capítulo 3]",
        7: "[Título do Capítulo 4]",
        9: "Legado e Conclusão"
    },

    // Page content: HTML strings for each page
    pages: {
        '1': `<h1>[Nome do Filósofo] ([Datas])</h1>
                <h2>Introdução</h2>
                <p>Conteúdo introdutório sobre o filósofo...</p>`,

        '2': `<h2>[Título da Seção]</h2>
                <p>Mais conteúdo...</p>
                <blockquote>"Uma citação famosa do filósofo."</blockquote>`,

        '3': `<h2>[Contexto Histórico]</h2>
                <p>Informações sobre o contexto histórico...</p>
                <ul>
                    <li>Ponto importante 1</li>
                    <li>Ponto importante 2</li>
                </ul>`,

        '4': `<h2>[Conceito Principal 1]</h2>
                <p>Explicação detalhada do conceito...</p>`,

        '5': `<h2>[Conceito Principal 2]</h2>
                <p>Explicação detalhada do conceito...</p>`,

        '6': `<h2>[Influências e Predecessores]</h2>
                <p>Discussão sobre as influências do filósofo...</p>`,

        '7': `<h2>[Obras Principais]</h2>
                <p>Descrição das obras mais importantes...</p>`,

        '8': `<h2>[Impacto e Críticas]</h2>
                <p>Análise do impacto e das críticas recebidas...</p>`,

        '9': `<h2>Legado</h2>
                <p>Discussão sobre o legado do filósofo...</p>`,

        '10': `<h1>Fim do Estudo sobre [Nome do Filósofo]</h1>
                 <p>Você concluiu o material de estudo. Agora, teste seu conhecimento com o quiz.</p>`
    },

    // Quiz questions (minimum 5, recommended 10-20)
    quiz: [
        {
            question: "Qual foi a principal contribuição de [Nome] para a filosofia?",
            options: [
                "Opção A (incorreta)",
                "Opção B (correta)",
                "Opção C (incorreta)",
                "Opção D (incorreta)"
            ],
            answer: "Opção B (correta)"
        },
        {
            question: "Em que período histórico [Nome] viveu?",
            options: [
                "Antiguidade",
                "Idade Média",
                "Modernidade",
                "Contemporaneidade"
            ],
            answer: "Antiguidade"
        },
        // Add more questions...
    ],

    // Comic panel images (optional, can be empty array)
    comic: [
        'assets/comics/[philosopher_name]/panel_1.png',
        'assets/comics/[philosopher_name]/panel_2.png',
        'assets/comics/[philosopher_name]/panel_3.png',
    ]
};
