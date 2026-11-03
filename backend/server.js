const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");

const app = express();


// Permitir conexão com o site
app.use(cors());


// Permitir receber dados em JSON
app.use(express.json());



// Teste do servidor

app.get("/", (req, res) => {

    res.send("Glow Care API funcionando 💜");

});

// Cadastro de usuário

app.post("/cadastro", async (req, res) => {

    const { nome, email, senha } = req.body;
    
// Validação dos dados

if(!nome || !email || !senha){

    return res.status(400).json({

        mensagem:"Preencha todos os campos."

    });

}



const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if(!formatoEmail.test(email)){

    return res.status(400).json({

        mensagem:"Digite um email válido."

    });

}



if(senha.length < 8){

    return res.status(400).json({

        mensagem:"A senha deve ter pelo menos 8 caracteres."

    });

}

    const senhaCriptografada = await bcrypt.hash(senha, 10);


    db.run(
        `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
        `,
        [nome, email, senhaCriptografada],

        function(erro){

            if(erro){

                return res.status(400).json({
                    mensagem:"Esse email já está cadastrado."
                });

            }


            res.json({

                mensagem:"Usuário cadastrado com sucesso! 💜"

            });


        }

    );


});

// Login de usuário

app.post("/login", (req, res) => {

    const { email, senha } = req.body;


    db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],

        async (erro, usuario) => {


            if(erro){

                return res.status(500).json({

                    mensagem:"Erro no servidor."

                });

            }



            if(!usuario){

                return res.status(400).json({

                    mensagem:"Email ou senha incorretos."

                });

            }



            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );



            if(!senhaCorreta){

                return res.status(400).json({

                    mensagem:"Email ou senha incorretos."

                });

            }



            res.json({

                mensagem:"Login realizado com sucesso! 💜",

                usuario:{
                    nome:usuario.nome,
                    email:usuario.email
                }

            });


        }

    );


});

// Porta do servidor

const PORT = 3000;


app.listen(PORT, () => {

    console.log(`Servidor rodando na porta ${PORT}`);

});