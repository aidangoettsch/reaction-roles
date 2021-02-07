import Discord, {MessageEmbed} from "discord.js"
import Command from "./Command";

export default class Help extends Command {
  info = {
    command: 'help',
    alias: [],
    fullCommand: 'help [command]',
    shortDescription: '',
    longDescription: ''
  }

  async execute(msg: Discord.Message, args: string[]): Promise<void> {
    if (args.length === 0) {
      await msg.channel.send(new MessageEmbed({
        title: ':blue_book: __❱❱ ALL COMMANDS ❱❱__',
        description: `To get specific command help, use **${this.commandHandler.prefix}help [command]**`,
        color: 3530163, // Light Aqua Green
        fields: this.commandHandler.commands.map(e => {
          return {
            name: this.commandHandler.prefix + e.info.fullCommand,
            value: (e.info.shortDescription) ? e.info.shortDescription : `[No description]`
          }
        }),
      }))
    } else if (args.length === 1) {
      const command = this.commandHandler.commandMap.get(args[0].toLowerCase())
      if (!command) {
          throw new Error(`Command not found! Use **${this.commandHandler.prefix}help** to get a list of commands.`)
      }

      await msg.channel.send(new MessageEmbed({
        title: ':blue_book: __❱❱ COMMAND HELP ❱❱__',
        description: `Listing help documentation for command: **${args[0].toLowerCase()}**`,
        color: 3530163, // Light Aqua Green
        fields: [
          {
            name: 'Full Usage',
            value: this.commandHandler.prefix + command.info.fullCommand
          },
          {
            name: 'Full Description',
            value: command.info.longDescription || '(Empty)'
          },
          {
            name: 'Aliases',
            value: command.info.alias.join(', ') || '(None)'
          }
        ]
      }))
    } else throw new Error(`Invalid usage: **${this.commandHandler.prefix}help [command]**`)
  }
}
