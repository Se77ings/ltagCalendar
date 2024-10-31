import * as SQLite from "expo-sqlite";

export default async function CriarColaborador(colaborador) {
	const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
	let insertedId = await db.runAsync("INSERT INTO colaborador (Nome) VALUES (?);", colaborador.nome);
	return insertedId.lastInsertRowId;
}

export async function ObterColaboradoresPorServico(servicoId) {
	const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
	const result = await db.getAllAsync(
		`
        SELECT 
            c.*
        FROM colaborador c
        INNER JOIN ServicosPorColaborador sc ON c.id = sc.ColaboradorId
        WHERE sc.ServicoId = ?
        ORDER BY sc.Afinidade DESC;
    `,
		[servicoId]
	);

	return result;
}

// CREATE TABLE IF NOT EXISTS ServicosPorColaborador (
// 	id INTEGER PRIMARY KEY AUTOINCREMENT,
// 	ServicoId INTEGER,
// 	ColaboradorId INTEGER,
// 	Afinidade INTEGER NOT NULL CHECK (Afinidade IN (0, 1)),
// 	UNIQUE (ServicoId, ColaboradorId),
// 	FOREIGN KEY (ServicoId) REFERENCES servico(id),
// 	FOREIGN KEY (ColaboradorId) REFERENCES colaborador(id)
//   );


export async function ObterColaboradores() {
	const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
	const result = await db.getAllAsync(
		`
        SELECT 
            *
        FROM colaborador c
		LEFT JOIN ServicosPorColaborador sc ON c.id = sc.ColaboradorId
		ORDER BY c.Nome;
    `,
		[]
	);

	return result;
}

export async function RemoverColaborador(id) {
	const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
	await db.runAsync("DELETE FROM colaborador WHERE id = ?;", id);
}

export async function AtualizarColaborador(colaborador) {
	const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
	await db.runAsync("UPDATE colaborador SET Nome = ? WHERE id = ?;", colaborador.nome, colaborador.id);
}
