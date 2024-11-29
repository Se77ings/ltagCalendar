// import * as SQLite from "expo-sqlite";

// // Inicializando DB

// export const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

import * as SQLite from "expo-sqlite";

// Inicializa e exporta a conexão com o banco
export const db = SQLite.openDatabaseSync("ltagDatabase");
