import CriarAgendamento, { AtualizarAgendamento, ObterAgendamentos, ObterAgendamentosPaginado, RemoverAgendamento, VerificarDuplicados } from "../database/agendamentoRepository";

export default async function adicionarAgendamento(agendamento) {
  try {
    validarAgendamento(agendamento);
    
    await CriarAgendamento(agendamento);
    console.log('Agendamento criado com sucesso.');
    
    return {
      success: true,
      data: null,
      error: null
    }; 
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao criar agendamento: ' + error
    }; 
  }
}

function validarAgendamento(agendamento) {
  const { nome, telefone, data, hora, servico } = agendamento;

  if (!nome || !telefone || !data || !hora || !servico) {
    throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
  }

  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(data)) {
    throw new Error('A data deve estar no formato YYYY-MM-DD.');
  }

  const horaRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!horaRegex.test(hora)) {
    throw new Error('A hora deve estar no formato HH:MM.');
  }

  const telefoneRegex = /^\d{10,11}$/;
  if (!telefoneRegex.test(telefone)) {
    throw new Error('O telefone deve conter 10 ou 11 dígitos.');
  }
}

export async function VerificarDuplicadosAsync(data, hora) {
    try {
      var result = VerificarDuplicados(data, hora);

      return {
        success: true,
        data: result,
        error: null
      }; 
    } catch(error) {
      return {
        success: false,
        data: null,
        error: error
      }; 
    }
}

export async function AtualizarAgendamentoAsync(agendamento) {
  try {
    validarAgendamento(agendamento);
    
    await AtualizarAgendamento(agendamento);
    console.log('Agendamento Alterado com sucesso');
    
    return {
      success: true,
      data: null,
      error: null
    }; 
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao atualizar agendamento: ' + error
    };
  }
}

export async function obterAgendamentos() {
  try {
    var allRows = await ObterAgendamentos();

    return {
      success: true,
      data: allRows,
      error: null
    }; 
  } catch (error) {
    console.error('Erro ao obter agendamento:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao obter agendamentos'
    };
  }
}


export async function ObterAgendamentosPaginadoAsync(limit, offset) {
  try {
    var allRows = await ObterAgendamentosPaginado(limit, offset);

    return {
      success: true,
      data: allRows,
      error: null
    }; 
  } catch (error) {
    console.error('Erro ao obter agendamento:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao obter agendamentos'
    };
  }
}

export async function RemoverAgendamentoAsync(id) {
  try {
    await RemoverAgendamento(id);
    console.log('Agendamento removido com sucesso.');
    
    return {
      success: true,
      data: null,
      error: null
    }; 
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    return {
      success: false,
      data: null,
      error: 'Erro ao remover agendamento: ' + error
    };
  }
}