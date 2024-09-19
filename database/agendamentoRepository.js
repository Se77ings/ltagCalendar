import * as SQLite from 'expo-sqlite';

export default async function CriarAgendamento(agendamento) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    await db.runAsync('INSERT INTO agendamento (Nome, Telefone, DataHora, Servico, Prestador) VALUES (?, ?, ?, ?, ?);',
        agendamento.nome, agendamento.telefone, agendamento.dataHora, agendamento.servico, agendamento.prestador);
  }


  export async function ObterAgendamentos() {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const allRows = await db.getAllAsync('SELECT * FROM agendamento order by DataHora desc;');

    return allRows;
}

export async function RemoverAgendamento(id) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('DELETE FROM agendamento WHERE id = ?;', id);
}

export async function AtualizarAgendamento(agendamento) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('UPDATE agendamento SET Nome = ?, Telefone = ?, DataHora = ?, Servico = ?, Prestador = ? WHERE id = ?;',
        agendamento.nome, agendamento.telefone, agendamento.dataHora, agendamento.servico, agendamento.prestador, agendamento.id);
}

export async function ObterAgendamentosPaginado(pagina = 1, limite = 2) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
    
    const offset = (pagina - 1) * limite;
  
    const result = await db.getAllAsync(
      `SELECT * FROM agendamento ORDER BY DataHora DESC LIMIT ? OFFSET ?`, 
      [limite, offset]
    );
  
    return result;
  }