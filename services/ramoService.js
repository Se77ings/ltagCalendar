import CriarServico from "../database/servicoRepository";
//TODO: ver quais ramos e serviços vamos oferecer
export const ramosDeAtividade = [
    {
      id: 1,
      nome: "Barbearia",
      servicos: [
        { nome: "Barba", descricao: "Aparar ou fazer a barba", desabilitado: 0, favorito: 0 },
        { nome: "Corte de Cabelo", descricao: "Corte de cabelo masculino", desabilitado: 0, favorito: 1 },
        { nome: "Corte e Barba", descricao: "Corte de cabelo e barba", desabilitado: 0, favorito: 0 },
        { nome: "Corte Infantil", descricao: "Corte de cabelo para crianças", desabilitado: 0, favorito: 0 },
        { nome: "Escova", descricao: "Escova de cabelo masculina", desabilitado: 1, favorito: 0 },
        { nome: "Hidratação Capilar", descricao: "Hidratação para cabelos", desabilitado: 0, favorito: 1 },
        { nome: "Sobrancelha", descricao: "Aparar e modelar sobrancelhas", desabilitado: 0, favorito: 0 }
      ]
    },
    {
      id: 2,
      nome: "Beleza",
      servicos: [
        { nome: "Corte de Cabelo Feminino", descricao: "Corte de cabelo feminino", desabilitado: 0, favorito: 1 },
        { nome: "Corte e Hidratação", descricao: "Corte de cabelo com hidratação", desabilitado: 1, favorito: 0 },
        { nome: "Design de Sobrancelha", descricao: "Design e modelagem das sobrancelhas", desabilitado: 0, favorito: 1 },
        { nome: "Depilação", descricao: "Depilação com cera", desabilitado: 0, favorito: 0 },
        { nome: "Manicure", descricao: "Cuidados com as unhas", desabilitado: 0, favorito: 0 },
        { nome: "Maquiagem", descricao: "Aplicação de maquiagem para eventos", desabilitado: 0, favorito: 1 },
        { nome: "Pedicure", descricao: "Cuidados com os pés", desabilitado: 0, favorito: 0 }
      ]
    },
    {
      id: 3,
      nome: "Academia",
      servicos: [
        { nome: "Aula de Yoga", descricao: "Aula de yoga para relaxamento", desabilitado: 0, favorito: 1 },
        { nome: "Avaliação Física", descricao: "Avaliação física personalizada", desabilitado: 0, favorito: 0 },
        { nome: "Musculação", descricao: "Treinamento focado em musculação", desabilitado: 0, favorito: 0 },
        { nome: "Pilates", descricao: "Aula de pilates para flexibilidade e força", desabilitado: 0, favorito: 1 },
        { nome: "Plano Mensal", descricao: "Plano mensal de academia", desabilitado: 0, favorito: 0 },
        { nome: "Treinamento em Grupo", descricao: "Aulas em grupo com instrutor", desabilitado: 0, favorito: 0 },
        { nome: "Treinamento Personalizado", descricao: "Aula com personal trainer", desabilitado: 0, favorito: 1 }
      ]
    }
  ];
  
  export async function cadastrarServicosPorRamo(ramoId) {    
    const ramoSelecionado = ramosDeAtividade.find((ramo) => ramo.id === ramoId);
    console.log(ramoSelecionado);

    if (!ramoSelecionado) {
      throw new Error("Ramo de atividade não encontrado.");
    }    
  
    for (const servico of ramoSelecionado.servicos) {
      await CriarServico(servico);
    }
  
    console.log("Serviços cadastrados com sucesso!");
  }