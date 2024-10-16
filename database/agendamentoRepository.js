import * as SQLite from 'expo-sqlite';

export default async function CriarAgendamento(agendamento) { //TODO: no serviço, validar se tem ao menos um serviço no agendamento
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    const result = await db.runAsync('INSERT INTO agendamento (Nome, Telefone, Data, Hora, Finalizado) VALUES (?, ?, ?, ?, ?);',
        agendamento.nome, agendamento.telefone, agendamento.data, agendamento.hora, 0);

    return result.lastInsertRowId;
  }

  export async function RealizarAtendimento(request) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    await db.runAsync('UPDATE agendamento SET Finalizado = 1 WHERE id = ?;',
        request.colaboradorId, request.agendamentoId);
  }

export async function VincularAtendimentoColaboradores(request) { 
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    await db.runAsync('INSERT INTO AgendamentoColaborador (AgendamentoId, ColaboradorId) VALUES (?, ?);',
      request.agendamentoId, request.colaboradorId);
  }

  export async function DesvincularAtendimentoColaboradores(agendamentoId, colaboradorId) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
  
    await db.runAsync('DELETE FROM AgendamentoColaborador WHERE AgendamentoId = ? AND ColaboradorId = ?;', 
      [agendamentoId, colaboradorId]);
  }
  
export async function DesvincularAgendamentoServicos(agendamentoId, servicoId) {
  const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });

  await db.runAsync('DELETE FROM AgendamentoServicos WHERE AgendamentoId = ? AND ServicoId = ?;', 
    [agendamentoId, servicoId]);
}

  export async function VincularAgendamentoServicos(request) { 
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    await db.runAsync('INSERT INTO AgendamentoServicos (AgendamentoId, ServicoId) VALUES (?, ?);',
      request.agendamentoId, request.servicoId);
  }

export async function ObterAgendamentos() {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const allRows = await db.getAllAsync('SELECT * FROM agendamento order by Data desc;');

    return allRows;
}

export async function RemoverAgendamento(id) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('DELETE FROM agendamento WHERE id = ?;', id);
}

export async function AtualizarAgendamento(agendamento) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('UPDATE agendamento SET Nome = ?, Telefone = ?, data = ?, hora = ?, Servico = ?, Prestador = ? WHERE id = ?;',
        agendamento.nome, agendamento.telefone, agendamento.data, agendamento.hora, agendamento.servico, agendamento.prestador, agendamento.id);
}

 

export async function ObterAgendamentosPaginado(pagina = 1, limite = 2) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
    
    const offset = (pagina - 1) * limite;
  
    const result = await db.getAllAsync(
      `SELECT * FROM agendamento ORDER BY Data DESC LIMIT ? OFFSET ?`, 
      [limite, offset]
    );
  
    return result;
  }

  export async function VerificarDuplicados(data, hora, id = null) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
  
    const query = id 
      ? `SELECT COUNT(*) as total FROM agendamento WHERE data = ? AND hora = ? AND id != ?`
      : `SELECT COUNT(*) as total FROM agendamento WHERE data = ? AND hora = ?`;
  
    const params = id ? [data, hora, id] : [data, hora];
    
    const result = await db.getFirstAsync(query, params);
    
    return result != null && result.total > 0;
  }
  