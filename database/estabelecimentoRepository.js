import * as SQLite from "expo-sqlite";

export async function CriarEstabelecimento(estabelecimento) {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const result = await db.runAsync(
    "INSERT INTO Estabelecimento (Nome, Telefone, Endereco, Logo) VALUES (?, ?, ?, ?);",
    estabelecimento.nome,
    estabelecimento.telefone,
    estabelecimento.endereco,
    estabelecimento.logo
  );
}

export async function ObterEstabelecimento() {
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const result = await db.getFirstAsync(
    "SELECT * FROM Estabelecimento;");
  return result;
}

export async function AtualizarEstabelecimento(estabelecimento) {
  
  const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync(
    "UPDATE Estabelecimento SET Nome = ?, Telefone = ?, Endereco = ?, Logo = ? WHERE id = ?;",
    estabelecimento.nome,
    estabelecimento.telefone,
    estabelecimento.endereco,
    estabelecimento.logo,
    estabelecimento.id
  );
}
