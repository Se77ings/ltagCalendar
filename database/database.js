// import * as SQLite from "expo-sqlite";
// let db = "";
// function initialize() {
//   console.log("\t\t Initialize database chamado!!!!");
//   db = SQLite.openDatabaseSync("ltagDatabase");
//   if (db) {
//     console.log("is db open ");
//   } else {
//     console.log("db is null");
//   }
// }
// initialize();

// export { db, initialize };

import * as SQLite from "expo-sqlite";

let db;

function initialize(databaseName = "ltagDatabase") {
  console.log("\t\t Initialize database chamado!!!!");
  db = SQLite.openDatabaseSync(databaseName, {useNewConnection: true});
  if (db) {
    console.log("Banco de dados inicializado com sucesso.");
  } else {
    console.error("Erro ao inicializar o banco de dados.");
  }
}

function getDatabaseInstance() {
  if (!db) {
    console.log("Banco de dados não inicializado. Chamando initialize.");
    initialize();
  }
  return db;
}

export { initialize, getDatabaseInstance };
