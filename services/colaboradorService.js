import CriarColaborador, { AtualizarColaborador, ObterColaboradores, ObterColaboradoresPorServico, RemoverColaborador } from "../database/colaboradorRepository";

export default async function adicionarColaborador(colaborador) {
    try {
      validarColaborador(colaborador);
      
      await CriarColaborador(colaborador);
     
      console.log('Colaborador criado com sucesso.');
      
      return {
        success: true,
        error: null
      }; 
    } catch (error) {
      console.error('Erro ao criar Colaborador:', error);
      return {
        success: false,
        error: 'Erro ao criar Colaborador: ' + error
      }; 
    }
  }

  function validarColaborador(colaborador) {
    const { nome } = colaborador;
  
    if (!nome) { 
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }   
  }

  export async function AtualizarColaboradorAsync(colaborador) {
    console.log(colaborador)
    try {
      validarColaborador(colaborador);
      
      await AtualizarColaborador(colaborador);
      console.log('Colaborador Alterado com sucesso');
      
      return {
        success: true,
        data: null,
        error: null
      }; 
    } catch (error) {
      console.error('Erro ao atualizar Colaborador:', error);
      return {
        success: false,
        data: null,
        error: 'Erro ao atualizar Colaborador: ' + error
      };
    }
  }

  
export async function RemoverColaboradorAsync(id) {
    try {
      await RemoverColaborador(id);
      console.log('Colaborador removido com sucesso.');
      
      return {
        success: true,
        data: null,
        error: null
      }; 
    } catch (error) {
      console.error('Erro ao remover Colaborador:', error);
      return {
        success: false,
        data: null,
        error: 'Erro ao remover Colaborador: ' + error
      };
    }
  }

  export async function ObterColaboradoresPorServicoAsync(servicoid) {
    try {
      var allRows = await ObterColaboradoresPorServico(servicoId);
  
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

  export async function ObterTodosColaboradoresAsync() {
    try {
      var allRows = await ObterColaboradores();
  
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