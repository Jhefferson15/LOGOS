/**
 * tales_cards.js
 * Flashcards expandidos para Tales de Mileto (ID: 21)
 * Cobre biografia, arché, cosmologia, astronomia, matemática e legado.
 */

export const talesCards = [
    // --- CONCEITOS BÁSICOS E BIOGRAFIA ---
    {
        id: 'tales_1',
        type: 'write',
        front: 'Em qual cidade da Jônia nasceu Tales, considerada o berço da filosofia?',
        answer: ['Mileto', 'Miletus'],
        back: 'Mileto era uma próspera cidade portuária e comercial, propícia para o intercâmbio de ideias.',
        difficulty: 1
    },
    {
        id: 'tales_2',
        type: 'match',
        front: 'Associe os termos gregos aos seus significados no contexto de Tales:',
        pairs: [
            { term: 'Arché', def: 'Princípio/Origem' },
            { term: 'Physis', def: 'Natureza' },
            { term: 'Scholé', def: 'Ócio criativo' },
            { term: 'Logos', def: 'Razão/Discurso Racional' }
        ],
        difficulty: 2
    },
    {
        id: 'tales_3',
        type: 'truefalse',
        front: 'Temos acesso a diversos livros escritos pelo próprio Tales de Mileto.',
        back: 'Falso. Tales não deixou escritos conhecidos. O que sabemos vem de fontes indiretas (doxógrafos), principalmente Aristóteles.',
        answer: false,
        difficulty: 1
    },

    // --- A ARCHÉ (ÁGUA) ---
    {
        id: 'tales_4',
        type: 'normal',
        front: 'Segundo Aristóteles, quais observações biológicas levaram Tales a escolher a Água como Arché?',
        back: 'A observação de que o alimento de tudo é úmido, o calor vital nasce da umidade e as sementes de todas as coisas têm natureza úmida.',
        difficulty: 2
    },
    {
        id: 'tales_5',
        type: 'quiz',
        front: 'Como a teoria da água de Tales se diferencia dos mitos egípcios e babilônicos que também citam a água?',
        options: [
            'Tales dizia que a água era o deus Poseidon.',
            'Tales tratou a água como substância física material, removendo a agência divina.',
            'Tales copiou exatamente o mito sem alterações.',
            'Tales dizia que a água era feita de fogo.'
        ],
        answer: 1,
        back: 'A inovação foi a despersonalização: explicar a natureza por processos naturais, não por vontade de deuses.',
        difficulty: 3
    },
    {
        id: 'tales_6',
        type: 'normal',
        front: 'Qual é o termo filosófico para a doutrina de que a realidade é constituída por um único princípio fundamental?',
        back: 'Monismo.',
        difficulty: 3
    },

    // --- COSMOLOGIA E TERRA ---
    {
        id: 'tales_7',
        type: 'quiz',
        front: 'Qual era a explicação de Tales para a ocorrência de terremotos?',
        options: [
            'A ira de Poseidon batendo seu tridente.',
            'O movimento de placas tectônicas.',
            'A agitação da água primordial sobre a qual a Terra flutua.',
            'Ventos subterrâneos escapando de cavernas.'
        ],
        answer: 2,
        back: 'Ele comparava a Terra a um navio flutuando na água; quando a água se agitava, a Terra tremia.',
        difficulty: 2
    },
    {
        id: 'tales_8',
        type: 'match',
        front: 'Associe o estado da matéria ao processo de transformação da água (Teoria Cíclica):',
        pairs: [
            { term: 'Evaporação', def: 'Água vira Ar/Névoa' },
            { term: 'Condensação', def: 'Ar vira Chuva' },
            { term: 'Sedimentação', def: 'Água vira Terra/Lodo' }
        ],
        difficulty: 3
    },

    // --- HILOZOÍSMO (ALMA E MOVIMENTO) ---
    {
        id: 'tales_9',
        type: 'normal',
        front: 'O que Tales quis demonstrar ao usar o exemplo do Ímã (pedra de Magnésia) e do Âmbar?',
        back: 'Que a matéria não é inerte, mas possui uma "alma" ou força motriz interna capaz de gerar movimento (Hilozoísmo).',
        difficulty: 2
    },
    {
        id: 'tales_10',
        type: 'truefalse',
        front: 'Para Tales, a frase "tudo está cheio de deuses" significava que devemos adorar estátuas em todos os lugares.',
        back: 'Falso. Significava que o princípio da vida e do movimento permeia toda a natureza e matéria.',
        answer: false,
        difficulty: 1
    },

    // --- ASTRONOMIA ---
    {
        id: 'tales_11',
        type: 'write',
        front: 'Qual fenômeno astronômico Tales previu para o ano de 585 a.C., interrompendo uma batalha?',
        answer: ['Eclipse', 'Eclipse Solar', 'Eclipse do Sol'],
        back: 'Ele previu um eclipse solar total, provavelmente observando padrões cíclicos de registros antigos.',
        difficulty: 2
    },
    {
        id: 'tales_12',
        type: 'normal',
        front: 'Qual instrumento Tales utilizou para determinar os solstícios e calcular a altura das pirâmides?',
        back: 'O Gnômon (uma haste vertical que projeta sombra).',
        difficulty: 2
    },
    {
        id: 'tales_13',
        type: 'quiz',
        front: 'Qual foi a contribuição de Tales para o calendário?',
        options: [
            'Criou o ano bissexto.',
            'Determinou a duração do ano em 365 dias baseando-se nos solstícios.',
            'Dividiu o dia em 24 horas iguais.',
            'Nomeou os meses do ano.'
        ],
        answer: 1,
        back: 'Ele observou o intervalo entre solstícios de verão consecutivos para chegar a esse número.',
        difficulty: 3
    },

    // --- MATEMÁTICA ---
    {
        id: 'tales_14',
        type: 'normal',
        front: 'Como Tales mediu a altura da Grande Pirâmide do Egito?',
        back: 'Ele esperou o momento do dia em que o comprimento de sua própria sombra era igual à sua altura. Por semelhança, a sombra da pirâmide também seria igual à sua altura.',
        difficulty: 2
    },
    {
        id: 'tales_15',
        type: 'truefalse',
        front: 'A grande inovação matemática de Tales foi transformar a geometria prática egípcia em uma ciência abstrata e dedutiva.',
        back: 'Verdadeiro. Ele buscou provar teoremas universais (ex: o diâmetro bissecta o círculo) em vez de apenas medir terras.',
        answer: true,
        difficulty: 2
    },
    {
        id: 'tales_16',
        type: 'match',
        front: 'Relacione os Teoremas de Tales às suas descrições:',
        pairs: [
            { term: 'Diâmetro', def: 'Bissecta o círculo' },
            { term: 'Triângulo Isósceles', def: 'Ângulos da base são iguais' },
            { term: 'Opostos pelo Vértice', def: 'Ângulos são iguais' },
            { term: 'Ângulo no Semicírculo', def: 'É sempre reto (90°)' }
        ],
        difficulty: 3
    },

    // --- LEGADO E ESCOLA DE MILETO ---
    {
        id: 'tales_17',
        type: 'quiz',
        front: 'Qual característica das teorias de Tales permitiu o surgimento da ciência?',
        options: [
            'Erem dogmas religiosos inquestionáveis.',
            'Eram escritas em verso poético.',
            'Eram explicativas, racionais e falseáveis (sujeitas a crítica).',
            'Eram baseadas apenas na autoridade do faraó.'
        ],
        answer: 2,
        back: 'Ao propor explicações naturais, ele permitiu que outros (como Anaximandro) discordassem e propusessem teorias melhores.',
        difficulty: 2
    },
    {
        id: 'tales_18',
        type: 'normal',
        front: 'Quem foi o aluno e sucessor de Tales que criticou a teoria da Água e propôs o Ápeiron?',
        back: 'Anaximandro.',
        difficulty: 3
    },
    {
        id: 'tales_19',
        type: 'write',
        front: 'O método de preferir a explicação mais simples e econômica (um único princípio em vez de muitos deuses) é conhecido como Princípio da...',
        answer: ['Parcimônia', 'Parcimonia'],
        back: 'Também conhecido como Navalha de Ockham (embora o termo seja posterior, Tales aplicou o conceito).',
        difficulty: 3
    },
    {
        id: 'tales_20',
        type: 'truefalse',
        front: 'A geometria de Tales servia apenas para fins teóricos e não tinha aplicação prática.',
        back: 'Falso. Ele usou a geometria (semelhança de triângulos) para calcular a distância de navios no mar, algo vital para o comércio de Mileto.',
        answer: false,
        difficulty: 2
    }
];