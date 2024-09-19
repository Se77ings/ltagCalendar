import * as SQLite from 'expo-sqlite';


export default async function initializaDatabase() {
  const db = await SQLite.openDatabaseAsync('ltagDatabase');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS agendamento (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Nome TEXT NOT NULL,
          Telefone TEXT NOT NULL,
          DataHora TEXT NOT NULL, 
          Servico TEXT NOT NULL,
          Prestador TEXT NULL
        );
        `);       
};