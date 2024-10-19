import { useState, createContext, useContext, useEffect } from "react";

const AgendamentoContext = createContext();
const useAgendamento = () => useContext(AgendamentoContext);

const AgendamentoProvider = ({ children }) => {
  const [listaColaborador, setListaColaborador] = useState([]);
  const [listaServico, setListaServico] = useState([]);
  return <AgendamentoContext.Provider value={{ listaColaborador, setListaColaborador, listaServico, setListaServico }}>{children}</AgendamentoContext.Provider>;
};

export default AgendamentoProvider;
