console.log("cronograma.js carregado");

// Respostas salvas pelo questionário
const respostasSalvas = localStorage.getItem("respostasGlowCare");
const usuarioSalvo = localStorage.getItem("usuario");

// Elementos da página
const titulo = document.getElementById("tituloCronograma");
const introducao = document.getElementById("introducaoCronograma");
const resumo = document.getElementById("resumoCronograma");
const manha = document.getElementById("rotinaManha");
const noite = document.getElementById("rotinaNoite");
const avisos = document.getElementById("avisosCronograma");
const botaoRefazer = document.getElementById("refazerRotina");

// Produtos já existentes e categorias complementares
const produtos = {
    limpeza: {
        nome: "Limpador facial suave",
        imagem: null
    },
    hidratante: {
        nome: "Hidratante facial",
        imagem: "imagens/hidratante.jpg"
    },
    protetor: {
        nome: "Protetor Solar",
        imagem: "imagens/protetor.webp"
    },
    vitaminaC: {
        nome: "Vitamina C (opcional)",
        imagem: "imagens/vitamina-c.webp"
    },
    orientacaoAcne: {
        nome: "Orientação para cuidados com acne",
        imagem: null
    }
};

function irParaQuestionario() {
    window.location.href = "rotina.html";
}

function mostrarErro() {
    titulo.textContent = "Vamos conhecer sua pele 💜";
    introducao.textContent =
        "Não encontramos respostas válidas. Responda ao questionário para montar sua rotina.";

    resumo.replaceChildren();
    manha.replaceChildren();
    noite.replaceChildren();
    avisos.replaceChildren();

    botaoRefazer.textContent = "Começar questionário";
    botaoRefazer.onclick = irParaQuestionario;
}

function criarPasso(nome, produto, descricao, duracao = 1) {
    return { nome, produto, descricao, duracao };
}

function calcularTempo(passos) {
    return passos.reduce((total, passo) => total + passo.duracao, 0);
}

function adicionarResumo(valor, legenda) {
    const item = document.createElement("div");
    item.className = "item-resumo";

    const destaque = document.createElement("strong");
    destaque.textContent = valor;

    const texto = document.createElement("span");
    texto.textContent = legenda;

    item.append(destaque, texto);
    resumo.appendChild(item);
}

function renderizarPeriodo(tituloPeriodo, passos, container) {
    container.replaceChildren();

    const tituloElemento = document.createElement("h2");
    tituloElemento.textContent = tituloPeriodo;
    container.appendChild(tituloElemento);

    const lista = document.createElement("ol");
    lista.className = "lista-passos";

    passos.forEach((passo) => {
        const item = document.createElement("li");
        item.className = "passo-cronograma";

        const nome = document.createElement("h3");
        nome.textContent = passo.nome;
        item.appendChild(nome);

        if (passo.produto.imagem) {
            const imagem = document.createElement("img");
            imagem.src = passo.produto.imagem;
            imagem.alt = passo.produto.nome;
            imagem.loading = "lazy";
            imagem.className = "imagem-produto-cronograma";
            imagem.onerror = () => imagem.remove();
            item.appendChild(imagem);

            const link = document.createElement("a");
            link.href = "produtos.html";
            link.textContent = "Consultar catálogo";
            link.className = "link-produto-cronograma";
            item.appendChild(link);
        }

        const produto = document.createElement("p");
        produto.textContent = `Produto sugerido: ${passo.produto.nome}`;

        const descricao = document.createElement("p");
        descricao.textContent = passo.descricao;

        const duracao = document.createElement("span");
        duracao.className = "tempo-passo";
        duracao.textContent = `Tempo estimado: ${passo.duracao} min`;

        item.append(produto, descricao, duracao);
        lista.appendChild(item);
    });

    container.appendChild(lista);
}

function gerarCronograma(respostas) {
    const [tipoPele, objetivo, reacao, tempo, experiencia] = respostas;

    let usuario = null;

    try {
        usuario = JSON.parse(usuarioSalvo || "null");
    } catch (erro) {
        usuario = null;
    }

    const nome =
        localStorage.getItem("usuarioNome") ||
        usuario?.nome ||
        "";

    titulo.textContent = nome
        ? `Sua rotina, ${nome}! 💜`
        : "Sua rotina personalizada 💜";

    const peleSensivel =
        reacao === "Às vezes fica sensível" ||
        reacao === "Costuma apresentar irritação";

    const iniciante =
        experiencia === "Não, estou começando agora";

    const rotinaCurta = tempo === "5 minutos";

    const rotinaAmpliada =
        tempo === "15 minutos" ||
        tempo === "20 minutos ou mais";

    const mensagens = [];

    let passosManha = [];
    let passosNoite = [];

    // Personalização da hidratação conforme o tipo de pele
    let descricaoHidratante;

    switch (tipoPele) {
        case "Oleosa":
            descricaoHidratante =
                "Prefira uma textura leve e confortável. Pele oleosa também precisa de hidratação.";
            break;

        case "Seca":
            descricaoHidratante =
                "Priorize um hidratante que ajude a manter a pele confortável e a reduzir a sensação de ressecamento.";
            break;

        case "Mista":
            descricaoHidratante =
                "Escolha uma fórmula confortável para o rosto. Observe as áreas que ficam mais secas ou oleosas.";
            break;

        case "Normal":
            descricaoHidratante =
                "Mantenha a hidratação de acordo com a necessidade da sua pele, sem acrescentar produtos desnecessários.";
            break;

        default:
            descricaoHidratante =
                "Como você ainda não sabe seu tipo de pele, comece com uma fórmula suave e observe como sua pele reage.";
    }

// ETAPAS BÁSICAS — instruções detalhadas

const limpezaManha = criarPasso(
    "1. Limpeza da manhã",
    produtos.limpeza,
    "Como fazer: umedeça o rosto com água em temperatura confortável. Aplique o limpador facial suave conforme as instruções do rótulo, massageando delicadamente com as pontas dos dedos, sem esfregar. Enxágue bem e seque encostando uma toalha limpa, sem friccionar. Evite água muito quente.",
    2
);

const hidratacaoManha = criarPasso(
    "2. Hidratação",
    produtos.hidratante,
    "Como fazer: com a pele limpa, aplique uma camada fina de hidratante no rosto e espalhe suavemente. Use a quantidade indicada no rótulo e evite a região dos olhos, a menos que o produto seja apropriado para ela. Aguarde o produto se acomodar antes da próxima etapa.",
    1
);

const protecaoSolar = criarPasso(
    "3. Proteção solar",
    produtos.protetor,
    "Como fazer: aplique protetor solar de amplo espectro, FPS 30 ou superior, nas áreas expostas, incluindo rosto, orelhas e pescoço. Use quantidade suficiente conforme o rótulo, sem esquecer áreas próximas à linha do cabelo. Aplique antes da exposição solar e reaplique conforme as instruções do produto, especialmente após suor intenso, banho ou contato com água.",
    2
);

const limpezaNoite = criarPasso(
    "1. Limpeza noturna",
    produtos.limpeza,
    "Como fazer: lave as mãos e umedeça o rosto. Utilize o limpador facial suave conforme o rótulo, massageando delicadamente para remover resíduos, oleosidade e maquiagem leve, se houver. Enxágue completamente e seque sem esfregar. Se usar maquiagem resistente à água, escolha um removedor adequado e siga as instruções dele.",
    2
);

const hidratacaoNoite = criarPasso(
    "2. Hidratação noturna",
    produtos.hidratante,
    "Como fazer: após a limpeza, aplique uma camada fina de hidratante no rosto, seguindo a quantidade indicada no rótulo. Espalhe com movimentos suaves, sem esfregar. Dê atenção às áreas que costumam ficar ressecadas, sem aplicar mais produto do que o necessário.",
    1
);

passosManha = [
    limpezaManha,
    hidratacaoManha,
    protecaoSolar
];

passosNoite = [
    limpezaNoite,
    hidratacaoNoite
]

    // PERSONALIZAÇÃO 1: objetivo principal
    switch (objetivo) {
        case "Hidratação":
            introducao.textContent =
                "Sua rotina prioriza o conforto da pele e a manutenção da hidratação.";

            hidratacaoManha.descricao =
                `${descricaoHidratante} Aplique de maneira uniforme, respeitando as instruções do produto.`;

            hidratacaoNoite.descricao =
                "À noite, mantenha a hidratação e observe se a pele continua confortável após o uso.";

            if (!rotinaCurta && !peleSensivel && !iniciante) {
                passosNoite.push(
                    criarPasso(
                        "Cuidado com áreas ressecadas",
                        produtos.hidratante,
                        "Se alguma área continuar ressecada, siga as instruções do hidratante e evite aplicar vários produtos ao mesmo tempo.",
                        1
                    )
                );
            }
            break;

        case "Controlar a oleosidade":
            introducao.textContent =
                "Sua rotina foi adaptada para cuidar da oleosidade sem ressecar excessivamente a pele.";

            limpezaManha.descricao =
                "Faça uma limpeza suave. Evite lavar o rosto repetidamente ou usar produtos agressivos para retirar o brilho.";

            hidratacaoManha.descricao =
                "Prefira um hidratante de textura leve e não deixe de hidratar a pele por ela ser oleosa.";

            limpezaNoite.descricao =
                "Retire os resíduos do dia com suavidade. Uma pele completamente sem oleosidade não é o objetivo.";

            if (!rotinaCurta && !peleSensivel && !iniciante) {
                passosNoite.push(
                    criarPasso(
                        "Observar a oleosidade",
                        produtos.hidratante,
                        "Observe em quais momentos o brilho aparece e se os produtos usados deixam a pele confortável. Não é necessário acrescentar um tratamento só por causa do brilho.",
                        1
                    )
                );
            }
            break;

        case "Cuidados com acne":
            introducao.textContent =
                "Sua rotina prioriza cuidados básicos e delicados, sem transformar o cronograma em um tratamento médico.";

            limpezaManha.descricao =
                "Use um limpador suave. Evite espremer espinhas, esfregar a pele ou combinar muitos produtos antiacne.";

            limpezaNoite.descricao =
                "Limpe o rosto delicadamente para retirar resíduos. Não esfregue nem tente remover as lesões durante a limpeza.";

            if (!rotinaCurta && !peleSensivel && !iniciante) {
                passosNoite.push(
                    criarPasso(
                        "Atenção aos cuidados com acne",
                        produtos.orientacaoAcne,
                        "Observe se os produtos causam desconforto. Se a acne persistir ou incomodar, procure orientação de um dermatologista antes de iniciar tratamentos específicos.",
                        1
                    )
                );
            }
            break;

        case "Manter a pele saudável":
            introducao.textContent =
                "Sua rotina prioriza a consistência dos cuidados básicos e a atenção às necessidades da pele.";

            limpezaManha.descricao =
                "Comece o dia com uma limpeza suave, sem exagerar na frequência ou na intensidade.";

            hidratacaoNoite.descricao =
                "Mantenha a hidratação e observe se o produto continua adequado e confortável para sua pele.";

            if (rotinaAmpliada && !peleSensivel && !iniciante) {
                passosNoite.push(
                    criarPasso(
                        "Conferência dos produtos",
                        produtos.hidratante,
                        "Confira a validade, as instruções e a conservação dos produtos. Ter mais tempo não significa precisar de mais etapas.",
                        1
                    )
                );
            }
            break;

        case "Criar o hábito de skincare":
            introducao.textContent =
                "Sua rotina foi organizada para ajudar você a criar um hábito simples, realista e consistente.";

            limpezaManha.descricao =
                "Comece com uma limpeza delicada. O importante é estabelecer uma rotina que você consiga manter.";

            protecaoSolar.descricao =
                "Finalize os cuidados da manhã com protetor solar. Siga o rótulo e reaplique conforme as instruções.";

            limpezaNoite.descricao =
                "Reserve um momento para limpar o rosto com calma, retirando resíduos do dia sem esfregar.";

            hidratacaoNoite.descricao =
                "Finalize com o hidratante. Priorize a regularidade dos cuidados básicos, sem se cobrar por uma rotina longa.";

            passosNoite = [limpezaNoite, hidratacaoNoite];
            break;

        default:
            introducao.textContent =
                "Esta é uma sugestão básica de cuidados para o seu perfil.";
    }

    // PERSONALIZAÇÃO 2: tipo de pele
    if (tipoPele === "Oleosa") {
        hidratacaoManha.descricao =
            "Prefira uma textura leve e confortável. A hidratação continua importante mesmo quando a pele apresenta brilho.";
    } else if (tipoPele === "Seca") {
        hidratacaoManha.descricao =
            "Dê atenção ao conforto da pele e escolha um hidratante que ajude a reduzir a sensação de ressecamento.";
    } else if (tipoPele === "Mista") {
        hidratacaoManha.descricao =
            "Observe as diferentes áreas do rosto e escolha um hidratante confortável para a pele como um todo.";
    } else if (tipoPele === "Não sei") {
        mensagens.push(
            "Você ainda não sabe seu tipo de pele. Observe seu comportamento ao longo do tempo, sem tirar conclusões com base em um único dia."
        );
    }

    // PERSONALIZAÇÃO 3: tempo disponível
    if (rotinaCurta) {
        passosManha = [
            limpezaManha,
            hidratacaoManha,
            protecaoSolar
        ];

        passosNoite = [
            limpezaNoite,
            hidratacaoNoite
        ];

        mensagens.push(
            "Rotina expressa: priorizamos os cuidados básicos para facilitar a sua organização diária."
        );
    } else if (tempo === "10 minutos") {
        mensagens.push(
            "Rotina intermediária: você tem tempo para realizar os cuidados básicos com calma, sem precisar acrescentar etapas."
        );
    } else if (rotinaAmpliada) {
        mensagens.push(
            "Você dispõe de mais tempo. Use-o para realizar os cuidados com calma, não para acumular produtos ou tratamentos."
        );
    }

    // PERSONALIZAÇÃO 4: sensibilidade e experiência
    if (peleSensivel) {
        passosNoite = [
            limpezaNoite,
            hidratacaoNoite
        ];

        mensagens.push(
            "Como você relatou sensibilidade ou irritação, mantenha os cuidados simples. Introduza produtos novos com cautela e interrompa o uso se houver reação. Se a irritação persistir, converse com um profissional de saúde."
        );
    }

    if (iniciante) {
        passosNoite = [
            limpezaNoite,
            hidratacaoNoite
        ];

        mensagens.push(
            "Como você está começando agora, concentre-se nos cuidados básicos antes de pensar em etapas complementares."
        );
    }

    if (
        experiencia === "Sim, todos os dias" &&
        !peleSensivel &&
        !iniciante
    ) {
        mensagens.push(
            "Como você já tem o hábito de cuidar da pele, mantenha os produtos que são adequados para você. Não é necessário mudar uma rotina que funciona apenas para acrescentar etapas."
        );
    }

    // Orientações específicas para objetivos
    if (objetivo === "Cuidados com acne") {
        mensagens.push(
            "Este cronograma não trata acne. Evite iniciar ativos ou medicamentos por conta própria; procure orientação dermatológica se precisar de tratamento."
        );
    }

   // Exibir orientações em uma seção organizada
avisos.replaceChildren();

const tituloAvisos = document.createElement("h2");
tituloAvisos.textContent = "Orientações para sua rotina";

const listaAvisos = document.createElement("div");
listaAvisos.className = "lista-orientacoes";

mensagens.forEach((mensagem) => {
    const card = document.createElement("div");
    card.className = "card-orientacao";

    const texto = document.createElement("p");
    texto.textContent = mensagem;

    card.appendChild(texto);
    listaAvisos.appendChild(card);
});

avisos.append(tituloAvisos, listaAvisos);

    // Exibir rotinas e resumo
    renderizarPeriodo("☀️ Rotina da manhã", passosManha, manha);
    renderizarPeriodo("🌙 Rotina da noite", passosNoite, noite);

    resumo.replaceChildren();

    adicionarResumo(
        `${calcularTempo(passosManha)} min`,
        "Tempo estimado pela manhã"
    );

    adicionarResumo(
        `${calcularTempo(passosNoite)} min`,
        "Tempo estimado à noite"
    );

    adicionarResumo(tipoPele, "Tipo de pele informado");

    botaoRefazer.textContent = "Refazer questionário";
    botaoRefazer.onclick = irParaQuestionario;
}

const opcoesValidas = [
    ["Oleosa", "Seca", "Mista", "Normal", "Não sei"],
    [
        "Hidratação",
        "Controlar a oleosidade",
        "Cuidados com acne",
        "Manter a pele saudável",
        "Criar o hábito de skincare"
    ],
    [
        "Geralmente não apresenta reação",
        "Às vezes fica sensível",
        "Costuma apresentar irritação",
        "Não sei"
    ],
    ["5 minutos", "10 minutos", "15 minutos", "20 minutos ou mais"],
    ["Sim, todos os dias", "Às vezes", "Não, estou começando agora"]
];

if (!respostasSalvas) {
    mostrarErro();
} else {
    try {
        const respostas = JSON.parse(respostasSalvas);

        const respostasValidas =
            Array.isArray(respostas) &&
            respostas.length === 5 &&
            opcoesValidas.every((opcoes, indice) =>
                opcoes.includes(respostas[indice])
            );

        if (respostasValidas) {
            gerarCronograma(respostas);
        } else {
            console.error("Respostas inválidas:", respostas);
            mostrarErro();
        }
    } catch (erro) {
        console.error("Erro ao ler as respostas:", erro);
        mostrarErro();
    }
}