import CriarServico, { AtualizarServico, ExisteAtendimentoComServico, ExisteServicoComColaborador, ObterServicosPorColaborador, ObterServicosPorFavorito, RemoverServico, VincularServicoColaborador } from "../database/servicoRepository";

export default async function adicionarServico(servico) {
    try {
      validarServico(servico);
      
      await CriarServico(servico);
       
      console.log('Serviço criado com sucesso.');
      
      return {
        success: true,
        error: null
      }; 
    } catch (error) {
      console.error('Erro ao criar Serviço:', error);
      return {
        success: false,
        error: 'Erro ao criar Serviço: ' + error
      }; 
    }
  }

  function validarServico(servico) {
    const { nome, descricao } = servico;
  
    if (!nome || !descricao ) { 
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }   
  }

  export async function AtualizarServicoAsync(servico) {
    console.log("entrei no atualizar")
    try {
      validarServico(servico);
      
      await AtualizarServico(servico);
      console.log('Serviço Alterado com sucesso');
      
      return {
        success: true,
        data: null,
        error: null
      }; 
    } catch (error) {
      console.error('Erro ao atualizar Serviço:', error);
      return {
        success: false,
        data: null,
        error: 'Erro ao atualizar Serviço: ' + error
      };
    }
  }

  
export async function RemoverServicoAsync(id) {
  console.log("entrei no excluir");
  try {
        await RemoverServico(id);
        console.log('Serviço removido com sucesso.');
        
        return {
            success: true,
            data: null,
            error: null
        }; 
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Erro ao remover Serviço: ' + error
      };
    }
  }

  export async function VincularServicoColaboradorAsync(servicoId, colaboradorId, afinidade) {
    try {
        const request = {
            servicoId: servicoId,
            colaboradorId: colaboradorId,
            afinidade: afinidade
        };

        await VincularServicoColaborador(request);
        
        return {
          success: true,
          data: null,
          error: null
        }; 
      } catch (error) {
        return {
          success: false,
          data: null,
          error: 'Erro ao vincular Serviço e Colaborador: ' + error
        };
      }
  }

  export async function ObterServicosPorColaboradorAsync(colaboradorId) {
    try {
      var allRows = await ObterServicosPorColaborador(colaboradorId);
  
      return {
        success: true,
        data: allRows,
        error: null
      }; 
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Erro ao obter' + error
      };
    }
  }

  export async function ObterTodosServicosAsync() {
    try {
      var allRows = await ObterServicosPorFavorito();
      return {
        success: true,
        data: allRows,
        error: null
      }; 
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Erro ao obter: ' + error
      };
    }
  }

  //Usem essa função antes de chamar Remover e Atualizar, pois precisa de confirmação caso for verdadeiro
  export async function ExisteAtendimentoComServicoAsync(servicoId) {
    try {
      var result = await ExisteAtendimentoComServico(servicoId);
  
      return {
        success: true,
        data: result,
        error: null
      }; 
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error
      }
    }
}

export async function ExisteServicoComColaboradorAsync(colaboradorId) {
  try {
    var result = await ExisteServicoComColaborador(colaboradorId);

    return {
      success: true,
      data: result,
      error: null
    }; 
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error
    }
  }
}