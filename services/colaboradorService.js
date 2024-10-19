import CriarColaborador, { AtualizarColaborador, ObterColaboradores, ObterColaboradoresPorServico, RemoverColaborador } from "../database/colaboradorRepository";
import { DesvincularTodosServicosColaborador, ObterServicosPorColaborador, VincularServicoColaborador } from "../database/servicoRepository";

export default async function adicionarColaborador(colaborador) {
  try {
    validarColaborador(colaborador);

    let result = await CriarColaborador(colaborador);
    colaborador.servicos.forEach((servico) => {
      VincularServicoColaborador({ servicoId: servico, colaboradorId: result, afinidade: 1 });
    });
    console.log("Colaborador criado com sucesso.");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao criar Colaborador:", error);
    return {
      success: false,
      error: "Erro ao criar Colaborador: " + error,
    };
  }
}

function validarColaborador(colaborador) {
  const { nome } = colaborador;

  if (!nome) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
  }
}

export async function AtualizarColaboradorAsync(colaborador) {
  console.log("========== Atualizeei! ==========");
  console.log(colaborador);
  try {
    validarColaborador(colaborador);

    await AtualizarColaborador(colaborador);
    DesvincularTodosServicosColaborador({colaboradorId: colaborador.id});
    console.log("Colaborador Alterado com sucesso");
    colaborador.servicos.forEach((servico) => {
      VincularServicoColaborador({ servicoId: servico, colaboradorId: colaborador.id, afinidade: 1 });
    });

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao atualizar Colaborador:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao atualizar Colaborador: " + error,
    };
  }
}

export async function RemoverColaboradorAsync(id) {
  try {
    await RemoverColaborador(id);
    console.log("Colaborador removido com sucesso.");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao remover Colaborador:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao remover Colaborador: " + error,
    };
  }
}

export async function ObterColaboradoresPorServicoAsync(servicoid) {
  try {
    var allRows = await ObterColaboradoresPorServico(servicoId);

    return {
      success: true,
      data: allRows,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "Erro ao obter" + error,
    };
  }
}

export async function ObterTodosColaboradoresAsync() {
  try {
    var allRows = await ObterColaboradores();

    return {
      success: true,
      data: allRows,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "Erro ao obter" + error,
    };
  }
}

export async function ObterTodosColaboradoresComServicosAsync() {
  try {
    const colaboradores = await ObterColaboradores();
    const colaboradoresComServicos = await Promise.all(
      colaboradores.map(async (colaborador) => {
        const servicos = await ObterServicosPorColaborador(colaborador.id);
        return {
          ...colaborador,
          servicos: servicos,
        };
      })
    );

    return {
      success: true,
      data: colaboradoresComServicos,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao obter colaboradores com serviços:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao obter colaboradores com serviços: " + error,
    };
  }
}
