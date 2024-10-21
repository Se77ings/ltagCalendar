import * as SQLite from "expo-sqlite";

export default async function CriarAgendamento(agendamento) {
  //TODO: no serviço, validar se tem ao menos um serviço no agendamento
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  const result = await db.runAsync("INSERT INTO agendamento (Nome, Telefone, Data, Hora, Finalizado) VALUES (?, ?, ?, ?, ?);", agendamento.nome, agendamento.telefone, agendamento.data, agendamento.hora, 0);

  return result.lastInsertRowId;
}

export async function RealizarAtendimento(request) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync("UPDATE agendamento SET Finalizado = 1 WHERE id = ?;", request.id);
}

export async function VincularAtendimentoColaboradores(agendamentoId, colaboradorId) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync("INSERT INTO AgendamentoColaborador (AgendamentoId, ColaboradorId) VALUES (?, ?);", agendamentoId, colaboradorId);
}

export async function DesvincularAtendimentoColaboradores(agendamentoId) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  await db.runAsync("DELETE FROM AgendamentoColaborador WHERE AgendamentoId = ?;", [agendamentoId]);
}

export async function DesvincularAgendamentoServicos(agendamentoId) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  await db.runAsync("DELETE FROM AgendamentoServicos WHERE AgendamentoId = ?;", [agendamentoId]);
}

export async function VincularAgendamentoServicos(agendamentoId, servicoId) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  await db.runAsync("INSERT INTO AgendamentoServicos (AgendamentoId, ServicoId) VALUES (?, ?);", agendamentoId, servicoId);
}

export async function ObterAgendamentos() {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const allRows = await db.getAllAsync("SELECT * FROM agendamento order by Data desc;");
  return allRows;
}

export async function obterServicosColaboradoresPorAgendamento(agendamentoId) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const servicos = await db.getAllAsync(`SELECT s.id, s.Nome, s.Descricao FROM AgendamentoServicos agServ LEFT JOIN servico s ON agServ.ServicoId = s.id WHERE agServ.AgendamentoId = ?;`, agendamentoId);
  const colaboradores = await db.getAllAsync(`SELECT agColab.ColaboradorId, c.Nome FROM AgendamentoColaborador agColab LEFT JOIN colaborador c ON agColab.ColaboradorId = c.id WHERE agColab.AgendamentoId = ?;`, agendamentoId);
  return { servicos: servicos, colaboradores: colaboradores };
}

export async function RemoverAgendamento(id) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync("DELETE FROM agendamento WHERE id = ?;", id);
}

export async function AtualizarAgendamento(agendamento) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync("UPDATE agendamento SET Nome = ?, Telefone = ?, data = ?, hora = ? WHERE id = ?;", agendamento.nome, agendamento.telefone, agendamento.data, agendamento.hora, agendamento.id);
}

export async function ObterAgendamentosPaginado(pagina = 1, limite = 2) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  const offset = (pagina - 1) * limite;

  const result = await db.getAllAsync(`SELECT * FROM agendamento ORDER BY Data DESC LIMIT ? OFFSET ?`, [limite, offset]);

  return result;
}

export async function VerificarDuplicados(data, hora, id = null) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  const query = id ? `SELECT COUNT(*) as total FROM agendamento WHERE data = ? AND hora = ? AND id != ?` : `SELECT COUNT(*) as total FROM agendamento WHERE data = ? AND hora = ?`;

  const params = id ? [data, hora, id] : [data, hora];

  const result = await db.getFirstAsync(query, params);

  return result != null && result.total > 0;
}
