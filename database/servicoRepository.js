import * as SQLite from 'expo-sqlite';


export default async function CriarServico(servico) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    await db.runAsync('INSERT INTO servico (Nome, Descricao, Favorito) VALUES (?, ?, ?);',
        servico.nome, servico.descricao, servico.favorito);
  }
  
  export async function ObterServicosPorFavorito() {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const allRows = await db.getAllAsync('SELECT * FROM servicos order by Favorito desc;');

    return allRows;
}

export async function ObterServicosPorColaborador(colaboradorId) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const result = await db.getAllAsync(`
        SELECT 
            s.*,
            sc.Afinidade 
        FROM servicos s
        INNER JOIN ServicosPorColaborador sc ON s.id = sc.ServicoId
        WHERE sc.ColaboradorId = ?
        ORDER BY sc.Afinidade DESC;
    `, [colaboradorId]);

    return result;
}

export async function ExisteAtendimentoComServico(servicoId) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const result = await db.getAsync('SELECT COUNT(*) as total FROM AtendimentoServicos WHERE ServicoId = ?;', [servicoId]);

    return result.total > 0;
}

export async function RemoverServico(id) { //TODO: no ServicoService preciso validar se tem algum atendimento com esse serviço
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('DELETE FROM servico WHERE id = ?;', id);
}

export async function AtualizarServico(servico) { //TODO: no ServicoService preciso validar se tem algum atendimento com esse serviço
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('UPDATE servico SET Nome = ?, Descricao = ?, Favorito = ? WHERE id = ?;',
        servico.nome, servico.descricao, servico.favorito, servico.id);
}

export async function VincularServicoColaborador(request) { 
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    await db.runAsync('INSERT INTO ServicosPorColaborador (ServicoId, ColaboradorId, Afinidade) VALUES (?, ?, ?);',
        request.servicoId, request.colaboradorId, request.afinidade);
}