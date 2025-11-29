// data/study_content/anaximandro.js
/**
 * Study Content for Anaximandro de Mileto (ID: 22)
 * Contains detailed articles, quizzes, and comics for this philosopher.
 * @namespace Data
 */

/**
 * @memberof Data
 * @type {{
 *   realImage: string,
 *   totalPages: number,
 *   tableOfContents: Object.<number, string>,
 *   pages: Object.<string, string>,
 *   quiz: Array<{question: string, options: string[], answer: string}>,
 *   comic: string[]
 * }}
 */
export const anaximandroContent = {
    realImage: 'assets/game/images/philosophers/real/anaximandro.jpg',
    totalPages: 60,
    tableOfContents: {
        1: "Introdução: O Primeiro Escritor de Filosofia",
        4: "O Ápeiron: Além dos Elementos",
        7: "Por que o Infinito? A Lógica do Ápeiron",
        10: "O Fragmento: A Justiça Cósmica e o Tempo",
        13: "Cosmogonia: O 'Gonimon' e a Separação dos Opostos",
        16: "A Formação dos Céus: A Casca da Árvore e o Fogo",
        19: "Arquitetura Cósmica (I): A Terra como Tambor de Coluna",
        22: "O Equilíbrio da Terra: Por que ela não cai?",
        26: "Astronomia (I): As Rodas de Fogo e os Foles",
        29: "Astronomia (II): A Descoberta do Espaço e da Profundidade",
        32: "Astronomia (III): A Ordem Inversa e os Números (9, 18, 27)",
        36: "A Conexão Arquitetônica: O Templo e o Cosmos",
        40: "Meteorologia: Desmistificando o Trovão",
        43: "A Origem da Vida: Umidade e Cascas Espinhosas",
        46: "Antropogonia: Homens Nascidos de Peixes (Galeoi)",
        50: "Geografia: O Primeiro Mapa do Mundo (Pínax)",
        54: "A Geometria do Mapa: O Centro e a Oikoumene",
        57: "Legado: A Invenção da Natureza (Physis)"
    },
    pages: {
        '1': `<h1>Anaximandro de Mileto (c. 610-546 a.C.)</h1>
                <h2>Introdução: O Primeiro Escritor de Filosofia</h2>
                <p>Enquanto Tales é considerado o pai da filosofia, Anaximandro é, sem dúvida, o criador da <strong>prosa filosófica</strong>. Ele foi o primeiro grego a escrever um tratado "Sobre a Natureza" (<em>Peri Physeos</em>), estabelecendo um novo gênero literário distinto da poesia épica de Homero e Hesíodo.</p>
                <p>Segundo Temístio e a tradição doxográfica, Anaximandro foi o primeiro a ousar publicar um discurso escrito sobre a natureza. Isso não é um detalhe trivial; ao escrever em prosa, ele sinalizou uma ruptura com a narrativa mítica e a autoridade das musas, propondo uma exposição racional, crítica e pública de suas ideias <strong>(KAHN, p. 6-7)</strong>.</p>`,
        '2': `<blockquote>"Anaximandro, filho de Praxíades, de Mileto... disse que o princípio e elemento das coisas existentes era o Ápeiron, tendo sido o primeiro a introduzir este nome para o princípio." - Simplício, Física, 24, 13.</blockquote>
                <p>Ele foi associado, aluno e sucessor de Tales. A tradição o coloca como um homem de ação: liderou uma colônia para Apolônia, viajou para Esparta onde instalou um gnômon (relógio de sol) e desenhou o primeiro mapa do mundo conhecido. Sua obra reflete uma mente enciclopédica que uniu astronomia, geografia, biologia e cosmologia em um sistema unificado.</p>`,
        '3': `<p>Para estudiosos como Charles Kahn, Anaximandro é a figura central do pensamento do século VI a.C. Foi ele quem traçou as linhas mestras da ciência antiga: a busca por uma ordem geométrica no cosmos, a explicação dos fenômenos meteorológicos sem deuses e a ideia de leis naturais universais. Se Tales foi o iniciador, Anaximandro foi o arquiteto do sistema de pensamento jônico.</p>`,
        '4': `<h2>O Ápeiron: Além dos Elementos</h2>
                <p>Diferente de Tales, que escolheu a água, Anaximandro postulou que a <strong>Arché</strong> (o princípio originário e sustentador) não poderia ser nenhum dos elementos conhecidos (água, fogo, ar ou terra). Ele introduziu o conceito de <strong>Ápeiron</strong>.</p>
                <p>O termo <em>Ápeiron</em> é composto pelo prefixo privativo 'a-' e a raiz 'peras' (limite, fim, determinação). Pode ser traduzido como "O Ilimitado", "O Infinito" ou "O Indeterminado". Para Anaximandro, este princípio é uma massa enorme, inesgotável, que se estende infinitamente em todas as direções e que circunda o universo visível <strong>(KAHN, p. 231-233)</strong>.</p>`,
        '5': `<p>O Ápeiron não é apenas espacialmente infinito; ele é qualitativamente indefinido. Não é água, nem fogo. É uma natureza primordial anterior a essas distinções. Ele é descrito com atributos divinos: é "imortal e imperecível", "abarca todas as coisas" e "governa todas as coisas". No entanto, não é um deus pessoal como Zeus; é uma divindade cósmica impessoal.</p>`,
        '6': `<p>Aristóteles relata que Anaximandro escolheu o Ápeiron porque, se um dos elementos opostos (como a água) fosse infinito, ele destruiria os outros (como o fogo). A Arché precisava ser uma fonte neutra e inesgotável da qual todos os opostos pudessem emergir e para a qual pudessem retornar, sem que um dominasse o outro permanentemente.</p>`,
        '7': `<h2>Por que o Infinito? A Lógica do Ápeiron</h2>
                <p>A escolha do Ápeiron resolve vários problemas lógicos que a "Água" de Tales deixava em aberto. Anaximandro percebeu que a natureza é definida pelo conflito de opostos: quente vs. frio, seco vs. úmido.</p>
                <ul>
                    <li><strong>O Problema da Geração:</strong> Como o fogo (quente e seco) poderia nascer da água (fria e úmida)? Eles são inimigos mútuos. Se a Arché fosse água, o fogo jamais poderia existir.</li>
                    <li><strong>A Necessidade de Neutralidade:</strong> A fonte de tudo deve ser neutra para poder gerar qualidades opostas. O Ápeiron é o reservatório de onde "separam-se" os opostos.</li>
                    <li><strong>A Fonte Inesgotável:</strong> Para que a geração e a destruição continuem eternamente ("o vir a ser"), a fonte não pode se esgotar. Somente uma substância infinita pode sustentar um processo eterno.</li>
                </ul>`,
        '8': `<p>Essa abstração conceitual marca um salto gigantesco na capacidade de raciocínio humano. Anaximandro não olhou apenas para o que era visível (como a água), mas inferiu racionalmente o que <em>deveria</em> existir para explicar o visível.</p>`,
        '9': `<p>Como observa Charles Kahn, o Ápeiron é o ancestral do conceito de "Espaço Infinito" e também da "Matéria-Prima" aristotélica, embora para Anaximandro fosse uma substância ativa e divina, não passiva <strong>(KAHN, p. 238)</strong>.</p>`,
        '10': `<h2>O Fragmento: A Justiça Cósmica e o Tempo</h2>
                 <p>Temos a sorte de possuir uma frase direta de Anaximandro, preservada por Simplício, que é considerada o texto filosófico mais antigo do ocidente:</p>
                 <blockquote>"De onde as coisas têm o seu nascimento, para lá também devem perecer segundo a necessidade; pois pagam a pena e a reparação umas às outras pela sua injustiça, segundo a ordem do tempo."</blockquote>
                 <p>Este fragmento é denso de significado. Anaximandro aplica conceitos legais e morais (justiça, reparação, pena) ao mundo natural. O cosmos é visto como uma <em>Polis</em> (cidade-estado) governada por uma lei impessoal <strong>(KAHN, p. 166, 178-183)</strong>.</p>`,
        '11': `<p><strong>A Injustiça (Adikia):</strong> A existência de qualquer coisa individual ou qualidade (como o Verão/Calor) é vista como uma "agressão" ou invasão contra o seu oposto (o Inverno/Frio). O predomínio de um elemento é uma "injustiça" contra o outro.</p>
                 <p><strong>A Reparação (Tisis):</strong> A justiça cósmica exige que todo excesso seja punido. O calor do verão deve pagar a pena sendo destruído pelo frio do inverno. O nascimento é uma dívida que deve ser paga com a morte.</p>`,
        '12': `<p><strong>A Ordem do Tempo:</strong> O Tempo (Chronos) é personificado como o juiz que determina o prazo para essa reparação. Nada pode existir para sempre; o ciclo das estações e da vida/morte garante o equilíbrio eterno do todo. A anarquia dos elementos é contida por uma lei universal.</p>`,
        '13': `<h2>Cosmogonia: O 'Gonimon' e a Separação dos Opostos</h2>
                 <p>Como o mundo surgiu do Ápeiron? Anaximandro não usa mitos sexuais, mas processos biológicos e físicos. Segundo Pseudo-Plutarco, ele disse que:</p>
                 <blockquote>"Na geração deste mundo, separou-se do eterno aquilo que é produtor (<em>gonimon</em>) de quente e de frio."</blockquote>
                 <p>O termo <em>gonimon</em> sugere algo como um "germe", uma "semente" ou um "organismo fértil". O cosmos nasce como um ser vivo. Desse germe inicial, os opostos fundamentais — o Quente (Fogo) e o Frio (Ar/Umidade) — se separam <strong>(KAHN, p. 57, 85)</strong>.</p>`,
        '14': `<p>Esse processo de "separação" (<em>apokrisis</em>) é fundamental. O mundo não é criado por um artífice (como no Gênesis ou no Timeu de Platão), mas evolui ou se diferencia a partir de uma unidade primordial. É um processo evolutivo e imanente.</p>`,
        '15': `<p>Gerard Naddaf enfatiza que este modelo de cosmogonia é uma racionalização das teogonias de Hesíodo, onde o Caos gera divindades. Mas em Anaximandro, as "divindades" são forças físicas (Quente/Frio) e o processo é guiado pela necessidade natural, não por desejo ou vontade divina <strong>(NADDAF, p. 17, 40)</strong>.</p>`,
        '16': `<h2>A Formação dos Céus: A Casca da Árvore e o Fogo</h2>
                 <p>Após a separação, o Frio (umidade/ar) formou o centro, e o Quente (fogo) formou uma esfera ao redor dele, "como a casca em torno de uma árvore".</p>
                 <p>Essa imagem biológica da "casca" (<em>phloios</em>) é impressionante. O calor do fogo começou a secar a umidade central. O vapor resultante dessa evaporação criou uma pressão imensa. Eventualmente, essa pressão fez a esfera de fogo "explodir" ou se romper, dividindo-se em vários anéis circulares envoltos por ar condensado (névoa) <strong>(COUPRIE, p. 172; KAHN, p. 86-87)</strong>.</p>`,
        '17': `<p>Esses anéis de fogo, agora cobertos por nuvens escuras (ar), tornaram-se os corpos celestes. O que vemos como Sol, Lua e Estrelas são, na verdade, apenas "furos" ou "respiradouros" nesses anéis gigantescos, por onde o fogo escapa. É uma imagem mecânica e desmistificadora: os astros não são deuses, são mecanismos de fogo e ar.</p>`,
        '18': `<p>Este modelo explica as fases da Lua e os eclipses como o fechamento parcial ou total desses respiradouros. É uma explicação puramente física para fenômenos que causavam terror.</p>`,
        '19': `<h2>Arquitetura Cósmica (I): A Terra como Tambor de Coluna</h2>
                 <p>No centro desse sistema, flutua a Terra. Mas qual é a sua forma? Anaximandro rejeita a ideia de uma terra plana se estendendo infinitamente para baixo (raízes profundas). Ele descreve a Terra como um <strong>cilindro</strong>, ou mais especificamente, como um <strong>"tambor de coluna"</strong> de pedra (<em>lithou kioni</em>).</p>
                 <p>Robert Hahn argumenta de forma convincente que Anaximandro foi inspirado pela arquitetura monumental que estava surgindo em Mileto e Samos. A construção dos grandes templos (como o de Hera e Ártemis) envolvia o uso de colunas feitas de tambores cilíndricos empilhados. Anaximandro, observando os arquitetos, usou essa forma tecnológica familiar para modelar a Terra <strong>(HAHN, p. 78-82)</strong>.</p>`,
        '20': `<p>Nós vivemos em uma das superfícies planas desse cilindro. A altura do cilindro é um terço do seu diâmetro (proporção 3:1). Esta é a primeira tentativa de dar uma forma geométrica e proporções matemáticas precisas ao nosso planeta.</p>`,
        '21': `<p>Dirk Couprie ressalta que, para Anaximandro, a Terra ainda é plana no topo (onde habitamos), o que condiz com a observação do horizonte. Mas ao dar-lhe uma espessura finita e formato cilíndrico, ele a torna um objeto isolado no espaço, e não o chão infinito do universo.</p>`,
        '22': `<h2>O Equilíbrio da Terra: Por que ela não cai?</h2>
                 <p>Esta é talvez a ideia mais genial de Anaximandro. Tales disse que a Terra boiava na água. Anaxímenes dirá que ela flutua no ar. Anaximandro diz que ela <strong>não se apoia em nada</strong>.</p>
                 <p>Aristóteles relata o argumento: "A Terra permanece imóvel por causa da <strong>indiferença</strong> (<em>homoiotes</em>). Pois o que está situado no centro e tem igual relação com os extremos não tem razão para se mover para cima, para baixo ou para os lados" <strong>(Aristóteles, Do Céu, 295b)</strong>.</p>`,
        '23': `<p>Este é o princípio da <strong>Razão Suficiente</strong> aplicado à cosmologia. Se a Terra está no centro geométrico de um universo simétrico, não há "motivo" físico para ela ir em qualquer direção. Ela está em equilíbrio dinâmico. Couprie chama isso de "A descoberta do Espaço": a ideia de que "embaixo" não é uma direção absoluta, mas relativa ao centro da Terra <strong>(COUPRIE, p. 202-205)</strong>.</p>`,
        '24': `<p>Anaximandro removeu a necessidade de um suporte material (elefantes, tartarugas, água, ar) e substituiu por uma lei geométrica e racional. Karl Popper considerou esta "uma das ideias mais ousadas, revolucionárias e portentosas de toda a história do pensamento humano".</p>`,
        '25': `<p>Embora não tenha proposto a gravidade newtoniana, ele intuiu que a estrutura do cosmos é governada por relações espaciais e simetria, e não por suporte mecânico simples.</p>`,
        '26': `<h2>Astronomia (I): As Rodas de Fogo e os Foles</h2>
                 <p>Como mencionado, Anaximandro concebeu os corpos celestes não como esferas sólidas, mas como <strong>anéis ou rodas</strong> gigantescas (como aros de carruagem) cheias de fogo, feitas de ar denso/névoa.</p>
                 <p>O Sol não é um disco quente; é um furo na borda interna de um anel de fogo gigante que circunda a Terra. O anel gira, e o furo gira com ele, criando o movimento diurno. Eclipses ocorrem quando esse furo se fecha. A analogia usada é a de um <strong>fole</strong> de ferreiro: o ar comprime o fogo e o expele por um bocal (<em>presteros aulos</em>) <strong>(COUPRIE, p. 175-176)</strong>.</p>`,
        '27': `<p>Esta teoria explica mecanicamente:
                 1. Por que o fogo não cai sobre nós (está contido nos tubos de ar).
                 2. O movimento circular dos astros.
                 3. A luz (fogo escapando sob pressão).</p>`,
        '28': `<p>Dirk Couprie argumenta que Anaximandro visualizou isso em 3D. As rodas do Sol, Lua e Estrelas estão inclinadas em relação à Terra, explicando as trajetórias que vemos no céu. O Sol, por exemplo, é uma roda que desliza para norte e sul ao longo do ano, explicando as estações e solstícios <strong>(COUPRIE, p. 218-221)</strong>.</p>`,
        '29': `<h2>Astronomia (II): A Descoberta do Espaço e da Profundidade</h2>
                 <p>Antes de Anaximandro, o céu era visto como uma abóbada ou cúpula (hemisfério) sobre a terra plana. As estrelas, sol e lua estavam todos na mesma superfície dessa cúpula.</p>
                 <p>Anaximandro rompeu essa "tampa". Ao propor que os astros são anéis de diferentes tamanhos, ele introduziu a noção de <strong>profundidade radial</strong> no universo. Alguns astros estão mais longe, outros mais perto. Os anéis passam *por baixo* da Terra, o que implica que o espaço continua em todas as direções, não apenas acima.</p>`,
        '30': `<p>Couprie chama isso de "A quebra da abóbada celeste". O universo torna-se tridimensional, profundo e vasto. A Terra não é mais o piso de uma tenda, mas um corpo suspenso no abismo infinito. Esta é a verdadeira invenção do conceito ocidental de cosmos espacial <strong>(COUPRIE, p. 167-168)</strong>.</p>`,
        '31': `<h2>Astronomia (III): A Ordem Inversa e os Números (9, 18, 27)</h2>
                 <p>Anaximandro propôs distâncias específicas para os anéis celestes, baseando-se no diâmetro da Terra (vamos chamar de D):</p>
                 <ul>
                     <li><strong>Estrelas:</strong> Anel mais próximo (9 x D).</li>
                     <li><strong>Lua:</strong> Anel intermediário (18 x D).</li>
                     <li><strong>Sol:</strong> Anel mais distante (27 x D).</li>
                 </ul>
                 <p>Esta ordem (Estrelas-Lua-Sol) é o inverso da realidade e do que pensavam outros antigos, que colocavam as estrelas como o fundo mais distante. Por que Anaximandro fez isso? Couprie sugere que ele se baseou na <strong>brilho</strong>: o fogo mais forte (Sol) deve estar mais longe ou em um anel maior; as estrelas (luzes fracas) devem estar mais perto ou ser furos menores <strong>(COUPRIE, p. 210)</strong>.</p>`,
        '32': `<p>A série numérica 9, 18, 27 é fascinante. Robert Hahn demonstra que esses números não são arbitrários, nem puramente místicos (como 3 x 3, 3 x 6, 3 x 9), mas derivam de <strong>técnicas arquitetônicas</strong>.</p>
                 <p>Os arquitetos gregos usavam módulos para projetar templos. A coluna era frequentemente o módulo. Se a Terra é um "tambor de coluna", o universo é o "templo" construído ao redor dela. As proporções 9, 18, 27 refletem as proporções usadas para definir o diâmetro e altura das colunas e o espaçamento entre elas nos grandes templos jônicos. Anaximandro projetou o cosmos como um arquiteto projeta um santuário <strong>(HAHN, p. 145-148)</strong>.</p>`,
        '33': `<p>Esses números representam a primeira tentativa de matematizar a natureza, de aplicar uma lei de proporção ao universo físico.</p>`,
        '34': `<h2>A Conexão Arquitetônica: O Templo e o Cosmos</h2>
                 <p>Robert Hahn expande essa tese. Ele argumenta que a imaginação cosmológica de Anaximandro foi estruturada pelas tecnologias de construção de seu tempo. O uso de colunas modulares, a técnica de fundição de bronze (para fazer mapas e modelos), e a geometria prática usada para erguer o Templo de Hera em Samos influenciaram diretamente como Anaximandro visualizou a estrutura do mundo.</p>
                 <p>O universo de Anaximandro é uma <strong>"Arquitetura Cósmica"</strong>. A estabilidade da Terra, os anéis celestes, as proporções matemáticas — tudo reflete a mente de alguém que observa e entende como estruturas estáveis são construídas e mantidas <strong>(HAHN, p. 118)</strong>.</p>`,
        '35': `<p>Isso coloca a filosofia não apenas como uma evolução do mito ou da poesia, mas também da <em>techné</em> (técnica/arte). O filósofo é o arquiteto do intelecto.</p>`,
        '36': `<h2>Meteorologia: Desmistificando o Trovão</h2>
                 <p>Seguindo o racionalismo de Tales, Anaximandro atacou o domínio tradicional de Zeus: o raio e o trovão. Para ele, esses fenômenos eram causados pelo <strong>vento</strong>.</p>
                 <p>Quando o vento fica preso dentro de uma nuvem espessa e a rompe violentamente devido à pressão, o barulho do rompimento é o trovão. O brilho resultante (devido ao atrito ou "rasgo" no ar escuro) é o relâmpago. "O trovão é o som do choque; o relâmpago é o brilho do contraste" <strong>(KAHN, p. 100-102)</strong>.</p>`,
        '37': `<p>Ele explicou o que era divino e aterrorizante como um processo mecânico de compressão e expansão de ar. Essa explicação naturalista foi tão impactante que foi parodiada séculos depois por Aristófanes na peça "As Nuvens", onde Sócrates (representando a ciência jônica) diz que Zeus não existe e que o trovão é apenas o barulho das nuvens "peidando".</p>`,
        '38': `<h2>A Origem da Vida: Umidade e Cascas Espinhosas</h2>
                 <p>A biologia de Anaximandro é proto-evolutiva. Ele acreditava que a vida surgiu da umidade primordial aquecida pelo sol (limo). Os primeiros seres vivos não eram como os atuais; eles eram envoltos em <strong>cascas espinhosas</strong> (como ouriços do mar) para se protegerem.</p>
                 <p>À medida que a terra secava e esses seres emergiam para o seco, a casca se rompia e eles viviam "por pouco tempo" sob as novas condições. Isso mostra uma intuição sobre a adaptação e a mudança das formas de vida em resposta ao ambiente <strong>(NADDAF, p. 14-15; KAHN, p. 110)</strong>.</p>`,
        '39': `<h2>Antropogonia: Homens Nascidos de Peixes (Galeoi)</h2>
                 <p>Anaximandro fez uma observação brilhante sobre os humanos: seus bebês são desamparados e precisam de cuidados prolongados. Se os primeiros humanos tivessem nascido como bebês na natureza selvagem, a espécie teria se extinguido imediatamente.</p>
                 <p>Portanto, ele concluiu que os humanos devem ter se originado de animais de outra espécie. Ele sugeriu que os humanos cresceram dentro de grandes peixes ou criaturas semelhantes a tubarões (<em>galeoi</em>), protegidos até atingirem a puberdade e serem capazes de se sustentar. Só então foram "lançados" na terra.</p>`,
        '40': `<p>Naddaf destaca que Anaximandro pode ter se baseado na observação de certos tubarões que dão à luz filhotes vivos (vivíparos) e cuidam deles. Embora bizarra para nós, era uma hipótese racional para resolver o problema da fragilidade infantil sem recorrer à criação divina instantânea (como Adão e Eva) <strong>(NADDAF, p. 16)</strong>.</p>`,
        '41': `<h2>Geografia: O Primeiro Mapa do Mundo (Pínax)</h2>
                 <p>Agatêmero relata que Anaximandro foi "o primeiro a ousar desenhar a terra habitada (<em>oikoumene</em>) em uma tábua". Este mapa não era para navegação prática imediata, mas uma representação teórica e geométrica do mundo.</p>
                 <p>Anaximandro provavelmente desenhou a Terra como circular (o topo do cilindro), circundada pelo Oceano (como em Homero, mas esquematizado). Ele dividiu o mundo conhecido em três partes (Europa, Ásia, Líbia) separadas por grandes massas de água (Mediterrâneo, Nilo, Fásis/Tanais). O centro do mapa provavelmente era Delfos (o umbigo do mundo) ou Mileto <strong>(COUPRIE, p. 194-197; NADDAF, p. 32-35)</strong>.</p>`,
        '42': `<p>A importância disso é a <strong>visão sinóptica</strong>: a capacidade de ver o mundo "de cima", como um todo inteligível e mensurável. Naddaf argumenta que este mapa também tinha uma função política e histórica ("historia"), mostrando as relações entre os povos e a difusão da civilização a partir de centros antigos como o Egito <strong>(NADDAF, p. 49)</strong>.</p>`,
        '43': `<h2>A Geometria do Mapa: O Centro e a Oikoumene</h2>
                 <p>Heidel sugere que o mapa usava linhas de referência geométricas, análogas a um equador e meridianos rudimentares. Dirk Couprie reconstrói o mapa mostrando como ele reflete a simetria cosmológica de Anaximandro: a simetria do céu se reflete na simetria da terra.</p>
                 <p>Este mapa foi a base para o trabalho posterior de Hecateu de Mileto e iniciou a tradição da geografia matemática grega que culminaria em Eratóstenes e Ptolomeu.</p>`,
        '44': `<h2>Legado: A Invenção da Natureza (Physis)</h2>
                 <p>Anaximandro conceitualizou a <strong>Natureza (Physis)</strong> como um sistema autônomo, governado por leis imanentes (tempo, justiça, necessidade) e não pelo capricho dos deuses. Ele uniu o micro (vida, meteorologia) e o macro (astronomia) em uma única teoria coerente baseada no Ápeiron.</p>
                 <p>Sua ideia de um universo profundo (espaço), de uma Terra suspensa no vácuo e de leis matemáticas governando as distâncias celestes foi uma ruptura tão radical com o passado que levou séculos para ser totalmente assimilada e superada. Ele é o verdadeiro avô da ciência teórica.</p>`,
        '45': `<p>Como diz Kahn: "Em Anaximandro, vemos pela primeira vez um intelecto ocidental tentando explicar a totalidade da experiência - a terra, o céu, a vida e a história - como um sistema unificado e inteligível."</p>`,
        '46': `<h1>Fim do Estudo Detalhado sobre Anaximandro.</h1>
                 <p>Você explorou a arquitetura do cosmos, o infinito e a origem da vida segundo o gênio de Mileto. Agora, prove seu domínio sobre o Ápeiron no quiz a seguir.</p>`
    },
    quiz: [
        { question: "Qual foi a grande inovação de Anaximandro em relação à forma de apresentar suas ideias, diferenciando-o de Tales e dos poetas?", options: ["Escreveu em versos hexâmetros.", "Foi o primeiro a escrever um tratado em prosa sobre a natureza.", "Não escreveu nada, confiando apenas na tradição oral.", "Escreveu diálogos dramáticos."], answer: "Foi o primeiro a escrever um tratado em prosa sobre a natureza." },
        { question: "O que é o Ápeiron na filosofia de Anaximandro?", options: ["Uma mistura de água e terra.", "O ar infinito.", "Uma substância indefinida, infinita e divina que dá origem a tudo.", "O fogo primordial."], answer: "Uma substância indefinida, infinita e divina que dá origem a tudo." },
        { question: "Segundo o famoso fragmento de Anaximandro, o que as coisas fazem umas às outras ao longo do tempo?", options: ["Elas se amam e se fundem.", "Elas pagam pena e reparação por sua injustiça.", "Elas competem pela sobrevivência.", "Elas adoram o Ápeiron."], answer: "Elas pagam pena e reparação por sua injustiça." },
        { question: "Qual é a forma da Terra no modelo cosmológico de Anaximandro?", options: ["Uma esfera perfeita.", "Um disco plano flutuando na água.", "Um tambor de coluna (cilindro) com altura de 1/3 do diâmetro.", "Uma pirâmide."], answer: "Um tambor de coluna (cilindro) com altura de 1/3 do diâmetro." },
        { question: "Por que a Terra não cai, segundo Anaximandro?", options: ["Porque é sustentada pelo ar.", "Porque flutua na água.", "Devido à sua indiferença/equilíbrio, estando no centro de um universo simétrico.", "Porque Atlas a segura."], answer: "Devido à sua indiferença/equilíbrio, estando no centro de um universo simétrico." },
        { question: "Qual é a ordem dos corpos celestes a partir da Terra, segundo Anaximandro (do mais próximo ao mais distante)?", options: ["Lua, Sol, Estrelas.", "Estrelas, Lua, Sol.", "Sol, Lua, Estrelas.", "Estrelas, Sol, Lua."], answer: "Estrelas, Lua, Sol." },
        { question: "O que são os astros (Sol, Lua, Estrelas) na visão de Anaximandro?", options: ["Deuses viajando em carruagens.", "Pedras incandescentes.", "Furos ou aberturas em anéis de fogo cobertos por ar/névoa.", "Reflexos da Terra no céu."], answer: "Furos ou aberturas em anéis de fogo cobertos por ar/névoa." },
        { question: "Robert Hahn sugere que os números 9, 18 e 27 na cosmologia de Anaximandro derivam de:", options: ["Observações astronômicas precisas.", "Misticismo numerológico babilônico.", "Proporções arquitetônicas usadas na construção de templos gregos.", "Uma revelação divina."], answer: "Proporções arquitetônicas usadas na construção de templos gregos." },
        { question: "Como Anaximandro explicou a origem dos primeiros seres humanos?", options: ["Foram moldados do barro por deuses.", "Nasceram e cresceram dentro de peixes ou criaturas semelhantes a tubarões.", "Caíram do céu como sementes.", "Surgiram espontaneamente da terra seca."], answer: "Nasceram e cresceram dentro de peixes ou criaturas semelhantes a tubarões." },
        { question: "Dirk Couprie atribui a Anaximandro a 'descoberta' de qual conceito fundamental?", options: ["A gravidade.", "O espaço (profundidade do universo e a terra suspensa).", "A esfericidade da Terra.", "O átomo."], answer: "O espaço (profundidade do universo e a terra suspensa)." },
        { question: "O que causava o trovão segundo a meteorologia de Anaximandro?", options: ["A voz de Zeus.", "O choque de nuvens.", "O vento rompendo violentamente uma nuvem espessa.", "A queda de meteoros."], answer: "O vento rompendo violentamente uma nuvem espessa." },
        { question: "Segundo Naddaf, o processo de formação do cosmos (cosmogonia) em Anaximandro é uma racionalização de:", options: ["Mitos egípcios de ressurreição.", "Teogonias gregas (como a de Hesíodo), substituindo deuses por forças físicas.", "Observações navais.", "Matemática babilônica."], answer: "Teogonias gregas (como a de Hesíodo), substituindo deuses por forças físicas." },
        { question: "Anaximandro foi o primeiro a desenhar o quê?", options: ["Um mapa das estrelas.", "Um mapa da terra habitada (oikoumene).", "Um plano para um templo.", "Um diagrama do corpo humano."], answer: "Um mapa da terra habitada (oikoumene)." },
        { question: "Qual termo biológico/embriológico Anaximandro usou para descrever a origem do cosmos?", options: ["Sperma (semente).", "Gonimon (germe/produtor).", "Oon (ovo).", "Rhiza (raiz)."], answer: "Gonimon (germe/produtor)." },
        { question: "A analogia da 'casca da árvore' (phloios) foi usada para explicar:", options: ["A formação da pele humana.", "A proteção dos primeiros animais.", "A esfera de fogo que se formou ao redor do ar na origem do cosmos.", "A estrutura da Terra."], answer: "A esfera de fogo que se formou ao redor do ar na origem do cosmos." },
        { question: "Qual a razão principal para Anaximandro rejeitar a água (ou qualquer outro elemento) como Arché?", options: ["A água é muito pesada.", "Um elemento finito e com qualidades definidas (oposto a outros) não poderia gerar seus opostos sem destruí-los.", "Tales já tinha escolhido a água.", "O fogo é mais poderoso."], answer: "Um elemento finito e com qualidades definidas (oposto a outros) não poderia gerar seus opostos sem destruí-los." },
        { question: "Segundo Couprie, a ideia de que os astros fazem círculos completos (passando sob a Terra) implica necessariamente que:", options: ["A Terra é plana.", "A Terra flutua suspensa no espaço.", "O sol se apaga à noite.", "O oceano sustenta a Terra."], answer: "A Terra flutua suspensa no espaço." },
        { question: "O que explicava os eclipses e as fases da lua no modelo de Anaximandro?", options: ["A sombra da Terra.", "A vontade dos deuses.", "A obstrução (fechamento) das aberturas nos anéis de fogo.", "O movimento de nuvens escuras."], answer: "A obstrução (fechamento) das aberturas nos anéis de fogo." },
        { question: "Qual a relação proposta entre o mapa de Anaximandro e sua cosmologia?", options: ["Nenhuma relação.", "O mapa era plano, mas o cosmos esférico.", "Ambos buscavam uma visão sinóptica e geométrica, ordenando o espaço.", "O mapa foi feito para provar que a Terra era o centro do sistema solar."], answer: "Ambos buscavam uma visão sinóptica e geométrica, ordenando o espaço." },
        { question: "O 'Histoires' de Heródoto critica mapas antigos que provavelmente seguiam o modelo de Anaximandro. Qual era a crítica?", options: ["Eles desenhavam a Terra redonda como se feita com compasso e a Ásia do mesmo tamanho da Europa.", "Eles não mostravam a América.", "Eles não usavam cores.", "Eles eram muito detalhados."], answer: "Eles desenhavam a Terra redonda como se feita com compasso e a Ásia do mesmo tamanho da Europa." }
    ],
    comic: [
        'assets/comics/anaximandro/anaximandro_01.png',
        'assets/comics/anaximandro/anaximandro_02.png',
        'assets/comics/anaximandro/anaximandro_03.png',
        'assets/comics/anaximandro/anaximandro_04.png',
        'assets/comics/anaximandro/anaximandro_05.png',
        'assets/comics/anaximandro/anaximandro_06.png',
        'assets/comics/anaximandro/anaximandro_07.png',
        'assets/comics/anaximandro/anaximandro_08.png',
    ]
};