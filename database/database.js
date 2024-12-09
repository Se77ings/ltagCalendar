import * as SQLite from "expo-sqlite";

let db;

function initialize(databaseName = "ltagDatabase") {
  db = SQLite.openDatabaseSync(databaseName, {useNewConnection: true});
  if (db) {
    console.log("Banco de dados inicializado com sucesso.");
  } else {
    console.error("Erro ao inicializar o banco de dados.");
  }
}

function getDatabaseInstance() {
  if (!db) {
    initialize();
  }
  return db;
}

export { initialize, getDatabaseInstance };
