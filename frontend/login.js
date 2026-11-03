console.log("login.js carregado");

async function login() {
    console.log("botão de login funcionando");

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Não foi possível fazer login.");
            return;
        }

        if (!dados.usuario) {
            alert("Login realizado, mas os dados do usuário não foram recebidos.");
            return;
        }

        // Salva os dados do usuário no navegador
        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );

        localStorage.setItem(
            "usuarioNome",
            dados.usuario.nome || ""
        );

        alert(dados.mensagem || "Login realizado com sucesso!");

        window.location.href = "rotina.html";

    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        alert("Não foi possível conectar ao servidor. Verifique se ele está ligado.");
    }
} 