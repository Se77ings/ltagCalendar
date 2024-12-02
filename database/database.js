// import * as SQLite from "expo-sqlite";

// // Inicializando DB

// export const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

import * as SQLite from "expo-sqlite";
let db = "";
function initialize() {
    console.log("\t\t Initialize database chamado!!!!");
	db = SQLite.openDatabaseSync("ltagDatabase");
    if(db){
        console.log("is db open ");
    }else{
        console.log("db is null");
    }
}
initialize();

// Inicializa e exporta a conexão com o banco
export { db, initialize };
