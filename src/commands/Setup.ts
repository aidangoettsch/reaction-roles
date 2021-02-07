import Command from "./Command";
import Discord, {MessageEmbed} from "discord.js";
import quickDb from "quick.db"

const emojiRegex = /<:.+:([0-9]+)>/
const roleRegex = /<@&([0-9]+)>/

export default class Setup extends Command {
  info = {
    command: 'setup',
    alias: [],
    fullCommand: 'setup [messageId] [emoji] [role]',
    shortDescription: '',
    longDescription: ''
  }

  async execute(msg: Discord.Message, args: string[]): Promise<void> {
    console.log(args)
    if (args.length !== 3) {
      throw new Error(`Incorrect usage! ${this.commandHandler.prefix}${this.info.fullCommand}`)
    }

    const messageId = args[0]
    let emoji = args[1]
    const role = args[2]

    const roleMatch = role.match(roleRegex)
    if (!roleMatch) throw new Error(`Invalid role ${role}`)

    const roleId = roleMatch[1]

    const emojiMatch = emoji.match(emojiRegex)
    if (emojiMatch) {
      emoji = emojiMatch[1]
    }

    quickDb.set(`${messageId}.roles.${emoji}`, roleId)

    await msg.channel.send(new MessageEmbed({
      title: ':bulb: __❱❱ INFO ❱❱__',
      description: "Successfully added role",
      color: 5235199, // Light Blue
    }))
  }
}