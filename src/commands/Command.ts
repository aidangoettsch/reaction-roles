import Discord from "discord.js";
import CommandHandler from "../CommandHandler";

export interface CommandInfo {
  command: string
  alias: string[]
  fullCommand: string
  shortDescription: string
  longDescription: string
}

export default abstract class Command {
  public abstract info: CommandInfo

  constructor(protected commandHandler: CommandHandler) {}

  abstract execute(msg: Discord.Message, args: string[]): Promise<void>
}
