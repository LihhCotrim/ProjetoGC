console.log("cronograma.js carregado");

const respostasSalvas = localStorage.getItem("respostasGlowCare");
const usuarioSalvo = localStorage.getItem("usuario");

const titulo = document.getElementById("tituloCronograma");
const introducao = document.getElementById("introducaoCronograma");
const resumo = document.getElementById("resumoCronograma");
const manha = document.getElementById("rotinaManha");
const noite = document.getElementById("rotinaNoite");
const avisos = document.getElementById("avisosCronograma");
const botaoRefazer = document.getElementById("refazerRotina");

// Produtos existentes no catálogo do Glow Care
const produtos = {
    hidratante: {
        nome: "Hidratante",
        imagem: "imagens/hidratante.jpg",
        descricao: "Ajuda a manter a pele hidratada e confortável."
    },

    protetor: {
        nome: "Protetor Solar",
        imagem: "imagens/protetor.webp",
        descricao: "Use um protetor de amplo espectro, FPS 30 ou superior, conforme o rótulo."
    },

    vitaminaC: {
        nome: "Vitamina C",
        imagem: "imagens/vitamina-c.webp",
        descricao: "Produto complementar; não é obrigatório em uma rotina básica."
    },

    retinol: {
        nome: "Retinol",
        imagem: "imagens/retinol.jpg",
        descricao: "Não será recomendado automaticamente pelo questionário."
    },

    kit: {
        nome: "Kit Skincare",
        imagem: "imagens/kit-skincare.jpg",
        descricao: "Consulte os itens incluídos no kit antes de utilizá-lo."
    }
};

// Configurar botão para refazer o questionário
function configurarBotao() {
    botaoRefazer.textContent = "Refazer questionário";

    botaoRefazer.onclick = () => {
        window.location.href = "rotina.html";
    };
}

if (!respostasSalvas) {
    titulo.textContent = "Vamos conhecer sua pele 💜";
    introducao.textContent =
        "Responda ao questionário para montarmos sua rotina.";

    botaoRefazer.textContent = "Começar questionário";
    botaoRefazer.onclick = () => {
        window.location.href = "rotina.html";
    };

} else {
    try {
        const respostas = JSON.parse(respostasSalvas);

        if (!Array.isArray(respostas) || respostas.length < 5) {
            mostrarErro();
        } else {
            gerarCronograma(respostas);
        }
    } catch (erro) {
        mostrarErro();
    }
}

function mostrarErro() {
    titulo.textContent = "Vamos montar sua rotina novamente 💜";
    introducao.textContent =
        "Não conseguimos recuperar todas as respostas. Faça o questionário outra vez.";

    configurarBotao();
}

function gerarCronograma(respostas) {
    const tipoPele = respostas[0];
    const objetivo = respostas[1];
    const reacao = respostas[2];
    const tempo = respostas[3];
    const experiencia = respostas[4];

    let usuario = null;

    try {
        usuario = JSON.parse(usuarioSalvo || "null");
    } catch (erro) {
        usuario = null;
    }

    const nome = localStorage.getItem("usuarioNome")
        || usuario?.nome
        || "";

    titulo.textContent = nome
        ? `Sua rotina, ${nome}! 💜`
        : "Sua rotina personalizada 💜";

    introducao.textContent =
        "Uma sugestão de cuidados básicos baseada nas suas respostas.";

    // Adaptar a orientação de hidratação ao tipo de pele informado
    let orientacaoHidratante =
        "Escolha um hidratante facial adequado à sua pele.";

    if (tipoPele === "Oleosa") {
        orientacaoHidratante =
            "Prefira uma textura leve e adequada à pele oleosa.";
    } else if (tipoPele === "Seca") {
        orientacaoHidratante =
            "Prefira um hidratante que ajude a reduzir o ressecamento.";
    } else if (tipoPele === "Mista") {
        orientacaoHidratante =
            "Escolha uma fórmula confortável para as diferentes áreas do rosto.";
    } else if (tipoPele === "Não sei") {
        orientacaoHidratante =
            "Comece com um hidratante suave e observe como sua pele responde.";
    }

    // Rotina da manhã
    const passosManha = [
        {
            nome: "1. Limpeza suave",
            produto: {
                nome: "Limpador facial suave",
                imagem: null
            },
            descricao:
                "Lave o rosto delicadamente, sem esfregar. Esse produto ainda não está cadastrado individualmente no catálogo.",
            duracao: 1
        },
        {
            nome: "2. Hidratação",
            produto: produtos.hidratante,
            descricao: orientacaoHidratante,
            duracao: 1
        },
        {
            nome: "3. Proteção solar",
            produto: produtos.protetor,
            descricao:
                "Aplique conforme as instruções do rótulo antes da exposição solar e reaplique conforme indicado.",
            duracao: 2
        }
    ];

    // Rotina da noite
    const passosNoite = [
        {
            nome: "1. Limpeza",
            produto: {
                nome: "Limpador facial suave",
                imagem: null
            },
            descricao:
                "Remova resíduos do dia e maquiagem, se houver, sem esfregar a pele.",
            duracao: 1
        },
        {
            nome: "2. Hidratação",
            produto: produtos.hidratante,
            descricao: orientacaoHidratante,
            duracao: 1
        }
    ];

    // Personalizar a orientação conforme o objetivo
    let mensagemObjetivo = "";

    if (objetivo === "Hidratação") {
        mensagemObjetivo =
            "Seu foco é a hidratação. Observe se a pele fica confortável após o uso dos produtos.";
    } else if (objetivo === "Controlar a oleosidade") {
        mensagemObjetivo =
            "Seu foco é controlar a oleosidade. Evite lavar o rosto excessivamente ou tentar ressecar a pele.";
    } else if (objetivo === "Cuidados com acne") {
        mensagemObjetivo =
            "Seu foco são os cuidados com acne. Esta rotina é básica e não substitui orientação dermatológica se a acne persistir ou incomodar.";
    } else if (objetivo === "Manter a pele saudável") {
        mensagemObjetivo =
            "Seu foco é manter a pele saudável. A regularidade dos cuidados básicos é mais importante do que usar muitos produtos.";
    } else if (objetivo === "Criar o hábito de skincare") {
        mensagemObjetivo =
            "Seu foco é criar um hábito. Comece com estes passos simples e mantenha uma rotina que caiba no seu dia.";
    }

    // Organizar avisos sem juntar mensagens sem espaço
    const mensagens = [];

    if (
        reacao === "Costuma apresentar irritação" ||
        reacao === "Às vezes fica sensível"
    ) {
        mensagens.push(
            "Como sua pele pode apresentar sensibilidade, introduza produtos novos um de cada vez. Interrompa o uso se houver irritação e procure orientação profissional se a reação persistir."
        );
    }

    if (experiencia === "Não, estou começando agora") {
        mensagens.push(
            "Como você está começando, mantenha os cuidados simples e evite adicionar vários produtos de uma só vez."
        );
    }

    if (reacao === "Não sei") {
        mensagens.push(
            "Observe como sua pele responde aos produtos e siga as instruções dos rótulos."
        );
    }

    if (tipoPele === "Não sei") {
        mensagens.push(
            "Como você ainda não conhece seu tipo de pele, prefira produtos suaves e observe como ela se comporta."
        );
    }

    mensagens.push(
        "Vitamina C e retinol não são necessários para começar. Não adicione ativos automaticamente: confira a indicação, a fórmula e as orientações adequadas à sua idade e à sua pele."
    );

    if (mensagemObjetivo) {
        mensagens.unshift(mensagemObjetivo);
    }

    avisos.replaceChildren();

    mensagens.forEach((mensagem) => {
        const paragrafo = document.createElement("p");
        paragrafo.textContent = mensagem;
        avisos.appendChild(paragrafo);
    });

    // Mostrar as rotinas
    renderizarPeriodo("☀️ Rotina da manhã", passosManha, manha);
    renderizarPeriodo("🌙 Rotina da noite", passosNoite, noite);

    // Mostrar o resumo
    resumo.replaceChildren();

    adicionarResumo(`${calcularTempo(passosManha)} min`, "Rotina da manhã");
    adicionarResumo(`${calcularTempo(passosNoite)} min`, "Rotina da noite");
    adicionarResumo(tipoPele || "Não informado", "Tipo de pele informado");

    configurarBotao();
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

    const tituloPeriodoElemento = document.createElement("h2");
    tituloPeriodoElemento.textContent = tituloPeriodo;
    container.appendChild(tituloPeriodoElemento);

    const lista = document.createElement("ol");
    lista.className = "lista-passos";

    passos.forEach((passo) => {
        const item = document.createElement("li");
        item.className = "passo-cronograma";

        const nome = document.createElement("h3");
        nome.textContent = passo.nome;

        const produto = document.createElement("p");
        produto.textContent = `Produto: ${passo.produto.nome}`;

        item.append(nome);

        // Exibir a imagem apenas quando houver uma imagem cadastrada
        if (passo.produto.imagem) {
            const imagem = document.createElement("img");
            imagem.src = passo.produto.imagem;
            imagem.alt = passo.produto.nome;
            imagem.loading = "lazy";
            imagem.className = "imagem-produto-cronograma";

            item.appendChild(imagem);

            const link = document.createElement("a");
            link.href = "produtos.html";
            link.textContent = "Ver produto no catálogo";
            link.className = "link-produto-cronograma";

            item.appendChild(link);
        } else {
            const observacao = document.createElement("p");
            observacao.textContent =
                "Consulte o catálogo para ver os produtos disponíveis.";
            item.appendChild(observacao);
        }

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