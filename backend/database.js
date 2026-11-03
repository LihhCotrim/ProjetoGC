const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database("./banco.db", (erro) => {

    if (erro) {
        console.log("Erro ao conectar ao banco:", erro);
    } else {
        console.log("Banco conectado 💜");
    }

});



db.run(`

CREATE TABLE IF NOT EXISTS usuarios (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nome TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    senha TEXT NOT NULL

)

`);



module.exports = db;