console.log("login.js carregado");

async function login(){

    console.log("botão de login funcionando");

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;



    const resposta = await fetch("http://localhost:3000/login", {


        method:"POST",


        headers:{

            "Content-Type":"application/json"

        },


        body:JSON.stringify({

            email,

            senha

        })


    });



    const dados = await resposta.json();



    alert(dados.mensagem);



    if(resposta.ok){

        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );

        localStorage.setItem("usuarioNome", dados.usuario.nome);
        window.location.href="rotina.html";

    }


}

localStorage.setItem("usuario", JSON.stringify({
    nome: usuario.nome,
    email: usuario.email
}));

localStorage.setItem("usuarioNome", usuario.nome);