import * as SQLite from 'expo-sqlite';

export default async function CriarColaborador(colaborador) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );
         
    await db.runAsync('INSERT INTO colaborador (Nome, Descricao, Favorito) VALUES (?);',
        colaborador.nome);
  }


  export async function ObterColaboradoresPorServico(servicoId) {
    const db = await SQLite.openDatabaseAsync('ltagDatabase', { useNewConnection: true} );         
    const result = await db.getAllAsync(`
        SELECT 
            c.*
        FROM colaborador c
        INNER JOIN ServicosPorColaborador sc ON c.id = sc.ColaboradorId
        WHERE sc.ServicoId = ?
        ORDER BY sc.Afinidade DESC;
    `, [servicoId]);

    return result;
}