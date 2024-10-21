import CriarAgendamento, {
  AtualizarAgendamento,
  DesvincularAgendamentoServicos,
  DesvincularAtendimentoColaboradores,
  ObterAgendamentos,
  ObterAgendamentosPaginado,
  obterServicosColaboradoresPorAgendamento,
  RealizarAtendimento,
  RemoverAgendamento,
  VerificarDuplicados,
  VincularAgendamentoServicos,
  VincularAtendimentoColaboradores,
} from "../database/agendamentoRepository";
import { RemoverServico } from "../database/servicoRepository";

export default async function adicionarAgendamento(agendamento) {
  try {
    validarAgendamento(agendamento);

    var agendamentoid = await CriarAgendamento(agendamento);
    agendamento.servico.forEach((servico) => {
      DesvincularAgendamentoServicos(agendamentoid, servico.id);
      VincularAgendamentoServicos(agendamentoid, servico.id);
    });

    agendamento.Colaboradores.forEach((colaborador) => {
      DesvincularAtendimentoColaboradores(agendamentoid, colaborador.id);
      VincularAtendimentoColaboradores(agendamentoid, colaborador.id);
    });

    console.log("Agendamento criado com sucesso.");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return {
      success: false,
      error: "Erro ao criar agendamento: " + error,
    };
  }
}

export async function RealizarAtendimentoAsync(request) {
  try {
    await RealizarAtendimento(request);

    request.servicos.forEach((servico) => {
      DesvincularAgendamentoServicos(request.Id, servico.Id);
      VincularAgendamentoServicos(request, servico.Id);
    });

    request.Colaboradores.forEach((colaborador) => {
      DesvincularAtendimentoColaboradores(request.Id, colaborador.Id);
      VincularAtendimentoColaboradores(request.Id, colaborador.Id);
    });

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao realizar atendimento:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao realizar atendimento: " + error,
    };
  }
}

function validarAgendamento(agendamento) {
  //Serviço agora é um array de ids, precisa ter ao menos um id nesse array.
  const { nome, telefone, data, hora, servico } = agendamento;

  if (!nome || !telefone || !data || !hora || !Array.isArray(servico) || servico.length === 0) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos, incluindo pelo menos um serviço.");
  }

  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(data)) {
    throw new Error("A data deve estar no formato YYYY-MM-DD.");
  }

  const horaRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!horaRegex.test(hora)) {
    throw new Error("A hora deve estar no formato HH:MM.");
  }

  const telefoneRegex = /^\d{10,11}$/;
  if (!telefoneRegex.test(telefone)) {
    throw new Error("O telefone deve conter 10 ou 11 dígitos.");
  }
}

export async function VerificarDuplicadosAsync(data, hora) {
  try {
    var result = VerificarDuplicados(data, hora);

    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error,
    };
  }
}

export async function AtualizarAgendamentoAsync(agendamento) {
  try {
    validarAgendamento(agendamento); // ver se vai passar na validação.

    await AtualizarAgendamento(agendamento);

    DesvincularAtendimentoColaboradores(agendamento.id);
    DesvincularAgendamentoServicos(agendamento.id);
    agendamento.servico.forEach(async (servico) => {
      console.log(`Vinculando o servico : ${servico.id} do agendamento ${agendamento.id}`);
      VincularAgendamentoServicos(agendamento.id, servico.id);
    });

    agendamento.Colaboradores.forEach(async (colaborador) => {
      console.log(`Vinculando o colaborador : ${colaborador.id} do agendamento ${agendamento.id}`);

      VincularAtendimentoColaboradores(agendamento.id, colaborador.id);
    });

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao atualizar agendamento: " + error,
    };
  }
}

export async function obterAgendamentos() {
  try {
    var allRows = await ObterAgendamentos();

    return {
      success: true,
      data: allRows,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao obter agendamento:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao obter agendamentos",
    };
  }
}

export async function obterServicosColaboradoresPorAgendamentoAsync(id) {
  try {
    results = await obterServicosColaboradoresPorAgendamento(id);
    console.log(" = ======= AgendamentoService =========== = ");
    console.log(results);
    console.log("============================================");
    return {
      success: true,
      data: results,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao obter agendamento:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao obter agendamentos",
    };
  }
}

export async function ObterAgendamentosPaginadoAsync(limit, offset) {
  try {
    var allRows = await ObterAgendamentosPaginado(limit, offset);

    return {
      success: true,
      data: allRows,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao obter agendamento:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao obter agendamentos",
    };
  }
}

export async function RemoverAgendamentoAsync(id) {
  try {
    await RemoverAgendamento(id);
    console.log("Agendamento removido com sucesso.");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao remover agendamento:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao remover agendamento: " + error,
    };
  }
}
