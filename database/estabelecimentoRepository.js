import * as SQLite from "expo-sqlite";
import { getDatabaseInstance } from "./database";

const db = getDatabaseInstance();

export async function CriarEstabelecimento(estabelecimento) {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const result = await db.runAsync(
    "INSERT INTO Estabelecimento (Nome, Telefone, Endereco, Logo, Theme) VALUES (?, ?, ?, ?, ?);",
    estabelecimento.nome,
    estabelecimento.telefone,
    estabelecimento.endereco,
    estabelecimento.logo,
    estabelecimento.theme
  );
}

export async function ObterEstabelecimento() {
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  const result = await db.getFirstAsync(
    "SELECT * FROM Estabelecimento;");
  return result;
}

export async function ObterTheme() {  
  const result = await db.getFirstAsync(
    "SELECT Theme FROM Estabelecimento;");
  return result.Theme;
}

export async function AtualizarTheme(theme) {
  await db.runAsync(
    "UPDATE Estabelecimento SET Theme = ?;",
    theme
  );
}


export async function AtualizarEstabelecimento(estabelecimento) {
  
  // const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
  await db.runAsync(
    "UPDATE Estabelecimento SET Nome = ?, Telefone = ?, Endereco = ?, Logo = ? WHERE id = ?;",
    estabelecimento.nome,
    estabelecimento.telefone,
    estabelecimento.endereco,
    estabelecimento.logo,
    estabelecimento.id
  );
}
