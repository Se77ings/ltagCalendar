import * as SQLite from 'expo-sqlite';
import { getDatabaseInstance } from "./database";

const db = getDatabaseInstance();


export default async function CriarServico(servico) {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
    
         
    await db.runAsync('INSERT INTO servico (Nome, Descricao, Favorito, Desabilitado) VALUES (?, ?, ?, ?);',
        servico.nome, servico.descricao, servico.favorito, 0);
}

export async function ObterServicosPorFavorito() {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const allRows = await db.getAllAsync('SELECT * FROM servico order by Favorito desc;');

    return allRows;
}

export async function ObterServicosFavoritosAtivos() {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
    const allRows = await db.getAllAsync('SELECT * FROM servico WHERE Desabilitado = 0 ORDER BY Favorito DESC, Nome ASC ;');

    return allRows;
}
  

export async function ObterServicosPorColaborador(colaboradorId) {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const result = await db.getAllAsync(`
        SELECT 
            s.*,
            sc.Afinidade 
        FROM servico s
        INNER JOIN ServicosPorColaborador sc ON s.id = sc.ServicoId
        WHERE sc.ColaboradorId = ?
        ORDER BY sc.Afinidade DESC;
    `, [colaboradorId]);

    return result;
}

export async function ExisteAtendimentoComServico(servicoId) {

    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const result = await db.getAllAsync('SELECT COUNT(*) as total FROM AgendamentoServicos WHERE ServicoId = ?;', [servicoId]);
    return result;
}

export async function DesabilitarServico(id) { //TODO: no ServicoService preciso validar se tem algum atendimento com esse serviço
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('UPDATE servico SET Desabilitado = 1 WHERE id = ?;', id);
}

export async function AtualizarServico(servico) { //TODO: no ServicoService preciso validar se tem algum atendimento com esse serviço
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('UPDATE servico SET Nome = ?, Descricao = ?, Favorito = ? WHERE id = ?;',
        servico.nome, servico.descricao, servico.favorito, servico.id);
}

export async function VincularServicoColaborador(request) { 
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('INSERT INTO ServicosPorColaborador (ServicoId, ColaboradorId, Afinidade) VALUES (?, ?, ?);',
        request.servicoId, request.colaboradorId, request.afinidade);
}

export async function DesvincularServicoColaborador(request) {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
    await db.runAsync('DELETE FROM ServicosPorColaborador WHERE ServicoId = ? AND ColaboradorId = ?;', 
        [request.servicoId, request.colaboradorId]);
}

export async function DesvincularTodosServicosColaborador(request){
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true });
    await db.runAsync('DELETE FROM ServicosPorColaborador WHERE ColaboradorId = ?;', 
        [request.colaboradorId]);
}

export async function ExisteServicoComColaborador(servicoId) {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );        
    const result = await db.getFirstAsync('SELECT COUNT(*) as total FROM ServicosPorColaborador WHERE ServicoId = ?;', servicoId);
    
    return result.total > 0;
}

export async function ExisteServicoAtivo(nome) {
    // const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );        
    const result = await db.getFirstAsync('SELECT COUNT(*) as total FROM servico WHERE Nome = ? and Desabilitado = 0;', nome);
    
    return result.total > 0;
}
