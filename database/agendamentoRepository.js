import * as SQLite from "expo-sqlite";
import { getDatabaseInstance } from "./database";


const db = getDatabaseInstance();

export default async function CriarAgendamento(agendamento) {
  //TODO: no serviço, validar se tem ao menos um serviço no agendamento
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  const result = await db.runAsync("INSERT INTO agendamento (Nome, Telefone, Data, Hora, Finalizado) VALUES (?, ?, ?, ?, ?);", agendamento.nome, agendamento.telefone, agendamento.data, agendamento.hora, 0);

  return result.lastInsertRowId;
}

export async function RealizarAtendimento(request) {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync("UPDATE agendamento SET Finalizado = 1 WHERE id = ?;", request.id);
}

export async function VincularAtendimentoColaboradores(agendamentoId, colaboradorId) {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync("INSERT INTO AgendamentoColaborador (AgendamentoId, ColaboradorId) VALUES (?, ?);", agendamentoId, colaboradorId);
}

export async function DesvincularAtendimentoColaboradores(agendamentoId) {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  await db.runAsync("DELETE FROM AgendamentoColaborador WHERE AgendamentoId = ?;", [agendamentoId]);
}

export async function DesvincularAgendamentoServicos(agendamentoId) {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });

  await db.runAsync("DELETE FROM AgendamentoServicos WHERE AgendamentoId = ?;", [agendamentoId]);
}

export async function VincularAgendamentoServicos(agendamentoId, servicoId) {
  await db.runAsync("INSERT INTO AgendamentoServicos (AgendamentoId, ServicoId) VALUES (?, ?);", agendamentoId, servicoId);
}

export async function ObterAgendamentos() {
  const allRows = await db.getAllAsync("SELECT * FROM agendamento ORDER BY Data DESC, Hora ASC;");
  return allRows;
}

export async function obterServicosColaboradoresPorAgendamento(agendamentoId) {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const servicos = await db.getAllAsync(`SELECT s.id, s.Nome, s.Descricao FROM AgendamentoServicos agServ LEFT JOIN servico s ON agServ.ServicoId = s.id WHERE agServ.AgendamentoId = ? AND s.Desabilitado = 0;`, agendamentoId);
  const colaboradores = await db.getAllAsync(`SELECT agColab.ColaboradorId, c.Nome FROM AgendamentoColaborador agColab LEFT JOIN colaborador c ON agColab.ColaboradorId = c.id WHERE agColab.AgendamentoId = ?;`, agendamentoId);
  return { servicos: servicos, colaboradores: colaboradores };
}

export async function obterServicosPorAgendamento(agendamentoId) {  
  const servicos = await db.getAllAsync(`SELECT s.Nome FROM AgendamentoServicos agServ LEFT JOIN servico s ON agServ.ServicoId = s.id WHERE agServ.AgendamentoId = ?`, agendamentoId);
  return servicos.map(servico => servico.Nome);
}

export async function RemoverAgendamento(id) {
  await db.runAsync("DELETE FROM agendamento WHERE id = ?;", id);
}

export async function AtualizarAgendamento(agendamento) {
  await db.runAsync("UPDATE agendamento SET Nome = ?, Telefone = ?, data = ?, hora = ? WHERE id = ?;", agendamento.nome, agendamento.telefone, agendamento.data, agendamento.hora, agendamento.id);
}

export async function ObterAgendamentosPaginado(pagina = 1, limite = 2) {
  const offset = (pagina - 1) * limite;

  const result = await db.getAllAsync(`SELECT * FROM agendamento ORDER BY Data DESC LIMIT ? OFFSET ?`, [limite, offset]);

  return result;
}

export async function VerificarDuplicados(data, hora, id = null) {
  const query = id ? `SELECT COUNT(*) as total FROM agendamento WHERE data = ? AND hora = ? AND id != ?` : `SELECT COUNT(*) as total FROM agendamento WHERE data = ? AND hora = ?`;

  const params = id ? [data, hora, id] : [data, hora];

  const result = await db.getFirstAsync(query, params);

  return result != null && result.total > 0;
}
export async function obterClientes(
  filtro,
  dataInicio = null,
  dataFim = null,
  nomeCliente = null,
  incluirFinalizados = true
) {
  let query = "SELECT * FROM agendamento";
  const params = [];

  if (!incluirFinalizados) {
    query += " WHERE Finalizado = 0";
  } else {
    query += " WHERE 1 = 1"; 
  }

  const hoje = new Date();

  switch (filtro) {
    case "todo": 
      break;

    case "ultimaSemana": 
      const ultimaSemana = new Date();
      ultimaSemana.setDate(hoje.getDate() - 7);
      query += " AND Data >= ?";
      params.push(ultimaSemana.toISOString().split("T")[0]);
      break;

    case "ultimos30Dias": 
      const ultimos30Dias = new Date();
      ultimos30Dias.setDate(hoje.getDate() - 30);
      query += " AND Data >= ?";
      params.push(ultimos30Dias.toISOString().split("T")[0]);
      break;

    case "ultimos3Meses": 
      const tresMesesAtras = new Date();
      tresMesesAtras.setMonth(hoje.getMonth() - 3);
      query += " AND Data >= ?";
      params.push(tresMesesAtras.toISOString().split("T")[0]);
      break;

    case "anoPassado": 
      const anoAtual = hoje.getFullYear();
      const inicioAnoPassado = new Date(anoAtual - 1, 0, 1);
      const fimAnoPassado = new Date(anoAtual - 1, 11, 31);
      query += " AND Data BETWEEN ? AND ?";
      params.push(
        inicioAnoPassado.toISOString().split("T")[0],
        fimAnoPassado.toISOString().split("T")[0]
      );
      break;

    case "personalizado": 
      if (!dataInicio || !dataFim) {
        throw new Error("Intervalo personalizado requer data de início e fim.");
      }      
      const dataInicioFormatada = new Date(dataInicio).toISOString().split("T")[0];
      const dataFimFormatada = new Date(dataFim).toISOString().split("T")[0];
      query += " AND Data BETWEEN ? AND ?";
      console.log(query);
      params.push(dataInicioFormatada, dataFimFormatada);
      break;

    default:
      throw new Error("Filtro inválido.");
  }

  if (nomeCliente) {
    query += " AND Nome LIKE ?";
    params.push(`%${nomeCliente}%`);
  }

  return await db.getAllAsync(query, params);
}
