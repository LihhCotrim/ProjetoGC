const perguntas = [
    {
        titulo: "Qual é o seu tipo de pele?",
        opcoes: [
            "Oleosa",
            "Seca",
            "Mista",
            "Normal",
            "Não sei"
        ]
    },
    {
        titulo: "Qual é seu principal objetivo?",
        opcoes: [
            "Hidratação",
            "Controlar a oleosidade",
            "Cuidados com acne",
            "Manter a pele saudável",
            "Criar o hábito de skincare"
        ]
    },
    {
        titulo: "Como sua pele reage a produtos novos?",
        opcoes: [
            "Geralmente não apresenta reação",
            "Às vezes fica sensível",
            "Costuma apresentar irritação",
            "Não sei"
        ]
    },
    {
        titulo: "Quanto tempo você tem para sua rotina?",
        opcoes: [
            "5 minutos",
            "10 minutos",
            "15 minutos",
            "20 minutos ou mais"
        ]
    },
    {
        titulo: "Você já possui uma rotina de skincare?",
        opcoes: [
            "Sim, todos os dias",
            "Às vezes",
            "Não, estou começando agora"
        ]
    }
];

let etapaAtual = 0;

let respostas = [];

const pergunta = document.getElementById("pergunta");
const opcoes = document.getElementById("opcoes");
const numero = document.getElementById("numeroPergunta");
const barra = document.getElementById("barraProgresso");

const voltar = document.getElementById("voltar");
const proximo = document.getElementById("proximo");

const nome = localStorage.getItem("usuarioNome");

if (nome) {
    document.getElementById("boasVindas").textContent =
        "Bem-vinda, " + nome + "! 💜";
}

// MOSTRAR PERGUNTA

function mostrarPergunta() {

    const atual = perguntas[etapaAtual];

    pergunta.textContent = atual.titulo;

    numero.textContent =
        `Pergunta ${etapaAtual + 1} de ${perguntas.length}`;

    barra.style.width =
        ((etapaAtual + 1) / perguntas.length * 100) + "%";

    opcoes.innerHTML = "";

    atual.opcoes.forEach(opcao => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.classList.add("opcao");
        botao.textContent = opcao;

        // Verificar se já foi selecionada
        if (atual.multipla) {

            if (respostas[etapaAtual]?.includes(opcao)) {
                botao.classList.add("selecionada");
            }

        } else {

            if (respostas[etapaAtual] === opcao) {
                botao.classList.add("selecionada");
            }
        }

        botao.onclick = () => {

            if (atual.multipla) {

                // Criar lista de respostas
                if (!Array.isArray(respostas[etapaAtual])) {
                    respostas[etapaAtual] = [];
                }

                const lista = respostas[etapaAtual];

                if (lista.includes(opcao)) {

                    respostas[etapaAtual] =
                        lista.filter(item => item !== opcao);

                } else {

                    // Evitar conflito entre opções de horário
                    if (etapaAtual === 3) {

                        if (opcao === "Manhã e noite") {
                            respostas[etapaAtual] = [opcao];
                        } else {
                            respostas[etapaAtual] =
                                lista.filter(item => item !== "Manhã e noite");

                            respostas[etapaAtual].push(opcao);
                        }

                    } else {
                        lista.push(opcao);
                    }
                }

            } else {

                respostas[etapaAtual] = opcao;

            }

            mostrarPergunta();
        };

        opcoes.appendChild(botao);
    });

    voltar.style.visibility =
        etapaAtual === 0 ? "hidden" : "visible";

    proximo.textContent =
        etapaAtual === perguntas.length - 1
        ? "Criar minha rotina"
        : "Próximo";
}

// PRÓXIMA PERGUNTA

proximo.onclick = () => {

    if (
        !respostas[etapaAtual] ||
        (Array.isArray(respostas[etapaAtual]) &&
         respostas[etapaAtual].length === 0)
    ) {
        alert("Selecione pelo menos uma opção para continuar!");
        return;
    }

    if (etapaAtual < perguntas.length - 1) {

        etapaAtual++;
        mostrarPergunta();

    } else {

        criarRotina();

    }
};

// VOLTAR

voltar.onclick = () => {

    if (etapaAtual > 0) {
        etapaAtual--;
        mostrarPergunta();
    }
};

// RESULTADO

function criarRotina() {
    // Salvar todas as respostas do questionário
    localStorage.setItem(
        "respostasGlowCare",
        JSON.stringify(respostas)
    );

    // Ir para a página do cronograma
    window.location.href = "cronograma.html";
}

// INICIAR

mostrarPergunta();