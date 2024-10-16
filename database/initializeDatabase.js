import * as SQLite from 'expo-sqlite';

export default async function initializaDatabase() {
  const db = await SQLite.openDatabaseAsync('ltagDatabase');

  await db.execAsync(`
    -- INSERT INTO servico (Nome, Descricao, Favorito) VALUES ('Corte de Cabelo', 'Corte de cabelo masculino e feminino', 1);
    -- INSERT INTO servico (Nome, Descricao, Favorito) VALUES ('Barba', 'Barba', 0);
    -- Descomentar caso queira zerar as tabelas (excluir antes de enviar para avaliação)
    -- Drop Table IF EXISTS agendamento;
    -- Drop Table IF EXISTS servico;
    -- Drop Table IF EXISTS colaborador;
    -- Drop Table IF EXISTS ServicosPorColaborador;
    -- Drop Table IF EXISTS AgendamentoColaborador;
    -- Drop Table IF EXISTS AgendamentoServicos; 

    CREATE TABLE IF NOT EXISTS agendamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nome TEXT NOT NULL,
      Telefone TEXT NOT NULL,
      Data TEXT NOT NULL, 
      Hora TEXT NOT NULL,
      Finalizado INTEGER NOT NULL CHECK (Finalizado IN (0, 1)) 
    );

    CREATE TABLE IF NOT EXISTS AgendamentoColaborador (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      AgendamentoId INTEGER NOT NULL,
      ColaboradorId INTEGER NOT NULL,
      FOREIGN KEY (AgendamentoId) REFERENCES agendamento(id),
      FOREIGN KEY (ColaboradorId) REFERENCES colaborador(id)
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
      Desabilitado INTEGER NOT NULL CHECK (Desabilitado IN (0, 1)),
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
    );
  `);
}

