function obterUsuarioLogado() {
    try {
        const usuario = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

        if (usuario) {
            return usuario;
        }
    } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
    }

    // Compatibilidade com o nome salvo separadamente
    const nomeSalvo = localStorage.getItem("usuarioNome");

    if (nomeSalvo) {
        return { nome: nomeSalvo };
    }

    return null;
}

function sairDaConta() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuarioNome");

    window.location.href = "login.html";
}

function atualizarSessao() {
    const usuario = obterUsuarioLogado();

    const areaUsuario = document.getElementById("areaUsuario");
    const nomeUsuario = document.getElementById("nomeUsuario");
    const botaoSair = document.getElementById("botaoSair");
    const linkLogin = document.getElementById("linkLogin");

    if (usuario) {
        if (areaUsuario) {
            areaUsuario.hidden = false;
        }

        if (nomeUsuario) {
            nomeUsuario.textContent =
                `Olá, ${usuario.nome || usuario.nomeUsuario || "usuário"}! 💜`;
        }

        if (botaoSair) {
            botaoSair.onclick = sairDaConta;
        }

        if (linkLogin) {
            linkLogin.hidden = true;
        }
    } else {
        if (areaUsuario) {
            areaUsuario.hidden = true;
        }

        if (linkLogin) {
            linkLogin.hidden = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", atualizarSessao);