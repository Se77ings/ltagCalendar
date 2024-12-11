import { AtualizarEstabelecimento, AtualizarTheme, CriarEstabelecimento, ObterEstabelecimento, ObterTheme } from "../database/estabelecimentoRepository";


export default async function adicionarEstabelecimentoAsync(estabelecimento) {
    try {
        validarEstabelecimento(estabelecimento);
  
         await CriarEstabelecimento(estabelecimento);      
        console.log("Estabelecimento criado com sucesso.");
  
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error("Erro ao criar Estabelecimento:", error);
      return {
        success: false,
        error: "Erro ao criar Estabelecimento: " + error,
      };
    }
  }

  export async function ObterThemeAsync(){
	const result = await ObterTheme();
	return result;
  }

  export async function AtualizarThemeAsync(theme){
	await AtualizarTheme(theme);
  }

  function validarEstabelecimento(estabelecimento) {
    const { nome, telefone } = estabelecimento;
  
    if (!nome || !telefone) {
      throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
    }

    const telefoneRegex = /^\d{10,11}$/;
	if (!telefoneRegex.test(telefone)) {
		throw new Error("O telefone deve conter 10 ou 11 dígitos.");
	}
  }

  
export async function ObterEstabelecimentoAsync() {
	try {
		var result = await ObterEstabelecimento();

		return {
			success: true,
			data: result,
			error: null,
		};
	} catch (error) {
		return{
			success: false,
			data: null,
			error: "Erro ao obter Estabelecimento",
		}
		// console.error("Erro ao obter Estabelecimento:", error);
		return {
			success: false,
			data: null,
			error: "Erro ao obter Estabelecimento",
		};
	}
}

export async function AtualizarEstabelecimentoAsync(estabelecimento) {
	try {
        validarEstabelecimento(estabelecimento);
		await AtualizarEstabelecimento(estabelecimento);		
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