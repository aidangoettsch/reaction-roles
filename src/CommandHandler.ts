import Discord from "discord.js"
import Help from "./commands/Help";
import Command from "./commands/Command";
import Setup from "./commands/Setup";
import debugBase from "debug";

const debug = debugBase('reaction-roles:commands')

const commands = [
    Help,
    Setup
]

export default class CommandHandler {
    public commands: Command[]
    public commandMap: Map<string, Command> = new Map()
    constructor(public prefix: string) {
        this.commands = commands.map(c => new c(this))

        for (const command of this.commands) {
            this.commandMap.set(command.info.command, command)
            command.info.alias.forEach(a => this.commandMap.set(a, command))
        }
    }

    execute(commandName: string, msg: Discord.Message, args: string[]): Promise<void> {
        const command = this.commandMap.get(commandName)
        if (!command) return Promise.reject(new Error("No such command"))
        debug(`Running command ${commandName} ${args.join(' ')}`)
        return command.execute(msg, args)
    }
}
