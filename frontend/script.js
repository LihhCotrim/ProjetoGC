function formatarNome(campo){

    campo.value = campo.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/(^|\s)\S/g, letra => letra.toUpperCase());

}

async function cadastrar(){

    const nomeDigitado = document.getElementById("nome").value;


const nome = nomeDigitado
    .toLowerCase()
    .split(" ")
    .map(palavra => {

        return palavra.charAt(0).toUpperCase() + palavra.slice(1);

    })
    .join(" ");

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if(!formatoEmail.test(email)){
    
        alert("Digite um email válido!");
    
        return;
    
    }

    const senhaValida = 
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /[0-9]/.test(senha);


    if(!senhaValida){

        alert(
        "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
        );

        return;

    }



    const resposta = await fetch("http://localhost:3000/cadastro", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },


        body:JSON.stringify({

            nome,
            email,
            senha

        })

    });



    const dados = await resposta.json();


    alert(dados.mensagem);

}