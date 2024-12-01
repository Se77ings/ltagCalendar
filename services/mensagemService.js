import { CriarMensagem, EditarMensagem, ExcluirMensagem, GarantirMensagemPadrao, ObterMensagem } from "../database/mensagemRepository";
import { obterServicosPorAgendamentoAsync } from "./agendamentoService";

export async function adicionarMensagem(mensagem) {
  try {
    validarMensagem(mensagem);
    await CriarMensagem(mensagem);
    console.log("Mensagem criada com sucesso.");
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    return {
      success: false,
      error: "Erro ao criar mensagem: " + error,
    };
  }
}

export async function AtualizarMensagemAsync(mensagem) {
  try {
    validarMensagem(mensagem);
    await EditarMensagem(mensagem);
    console.log("Mensagem atualizada com sucesso.");
    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao atualizar mensagem:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao atualizar mensagem: " + error,
    };
  }
}
    
export async function ObterMensagemAsync() {
  try {
    let mensagem = await ObterMensagem();
    
    return {
      success: true,
      data: mensagem,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao obter mensagem:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao obter mensagem.",
    };
  }
}

async function buscarServicos(id) {
  var servicos = await obterServicosPorAgendamentoAsync(id);
  return servicos.data;
}

function substituirVariaveis(mensagem, atendimento) {
  return mensagem
    .replace('{Nome}', atendimento.Nome)
    .replace('{Data}', atendimento.Data)
    .replace('{Hora}', atendimento.Hora);
}

function formatarServicos(servicos) {
  if (servicos.length === 1) {
    return servicos[0]; 
  } else {
    const ultimoServico = servicos.pop(); 
    return `${servicos.join(", ")} e ${ultimoServico}`; 
  }
}

export async function ObterMensagemFormatadaAsync(atendimento) {
  try {
    console.log(atendimento);
    let mensagem = await ObterMensagem();

    if (mensagem && mensagem.includes('{Serviço}')) {
      const servicos = await buscarServicos(atendimento.id);

      const servicosConcatenados = formatarServicos(servicos);
      console.log(servicosConcatenados);
      mensagem = mensagem.replace('{Serviço}', servicosConcatenados);

    }

    if (mensagem) {
      mensagem = substituirVariaveis(mensagem, atendimento);
    }

    return {
      success: true,
      data: mensagem,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao obter mensagem:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao obter mensagem.",
    };
  }
}


export async function ExcluirMensagemAsync() {
  try {
    await ExcluirMensagem();
    console.log("Mensagem excluída com sucesso.");
    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao excluir mensagem:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao excluir mensagem: " + error,
    };
  }
}

export async function GarantirMensagemPadraoAsync() {
  try {
    await GarantirMensagemPadrao();
    console.log("Mensagem padrão garantida.");
    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao garantir mensagem padrão:", error);
    return {
      success: false,
      data: null,
      error: "Erro ao garantir mensagem padrão: " + error,
    };
  }
}

function validarMensagem(mensagem) {
  if (!mensagem || typeof mensagem !== "string" || mensagem.trim() === "") {
    throw new Error("A mensagem não pode estar vazia.");
  }
}
