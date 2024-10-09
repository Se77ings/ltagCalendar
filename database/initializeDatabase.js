import * as SQLite from 'expo-sqlite';

export default async function initializaDatabase() {
  const db = await SQLite.openDatabaseAsync('ltagDatabase');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS agendamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL,
      Telefone TEXT NOT NULL,
      Data TEXT NOT NULL, 
      Hora TEXT NOT NULL,
      ColaboradorId INTEGER NOT NULL,
      Finalizado INTEGER NOT NULL CHECK (finalizado IN (0, 1)),
      FOREIGN KEY (colaborador_id) REFERENCES colaborador(id)
    );

    CREATE TABLE IF NOT EXISTS AgendamentoServicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      AgendamentoId INTEGER,
      ServicoId INTEGER,
      FOREIGN KEY (AgendamentoId) REFERENCES agendamento(id),
      FOREIGN KEY (ServicoId) REFERENCES servico(id)
    );

     CREATE TABLE IF NOT EXISTS servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL,
      Descricao TEXT NOT NULL,
      Favorito INTEGER NOT NULL CHECK (Favorito IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS colaborador (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL  
    );

    CREATE TABLE IF NOT EXISTS ServicosPorColaborador (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ServicoId INTEGER,
      ColaboradorId INTEGER,
      Afinidade INTEGER NOT NULL CHECK (Afinidade IN (0, 1)),
      UNIQUE (ServicoId, ColaboradorId),
      FOREIGN KEY (ServicoId) REFERENCES servico(id),
      FOREIGN KEY (ColaboradorId) REFERENCES colaborador(id)
    );`);
}
