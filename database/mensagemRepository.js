import { getDatabaseInstance } from "./database";

const db = getDatabaseInstance();

export async function CriarMensagem(mensagem) {
  await db.runAsync("INSERT INTO MensagemAgendamento (Mensagem) VALUES (?);", mensagem);
}

export async function EditarMensagem(mensagem) {
  await db.runAsync("UPDATE MensagemAgendamento SET Mensagem = ? WHERE id = 1;", mensagem);
}

export async function ObterMensagem() {
  const result = await db.getFirstAsync("SELECT * FROM MensagemAgendamento WHERE id = 1");
  return result ? result.Mensagem : null;
}

export async function ExcluirMensagem() {
  await db.runAsync("DELETE FROM MensagemAgendamento WHERE id = 1;");
}

export async function GarantirMensagemPadrao() {
  const result = await db.getFirstAsync("SELECT * FROM MensagemAgendamento WHERE id = 1");

  if (!result) {
    await db.runAsync("INSERT INTO MensagemAgendamento (Mensagem) VALUES (?);", "Mensagem padrão de agendamento.");
  }
}
