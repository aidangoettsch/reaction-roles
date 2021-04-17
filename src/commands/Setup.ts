import Command from "./Command";
import Discord, {MessageEmbed, Permissions} from "discord.js";
import quickDb from "quick.db"
import debugBase from "debug";

const debug = debugBase('reaction-roles:setup')

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
    if (!msg.member) throw new Error(`Command can only be used in a guild`)
    if (!msg.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) throw new Error(`You don't have permission to use this command`)

    if (args.length !== 3) {
      throw new Error(`Incorrect usage! ${this.commandHandler.prefix}${this.info.fullCommand}`)
    }

    if (!msg.guild) {
      throw new Error(`This command needs to be run in a guild`)
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
    debug(`Registered ${emoji} to ${roleId} for ${messageId}`)

    await Promise.all(msg.guild.channels.cache.map(async channel => {
      if (channel.isText()) {
        try {
          const message = await channel.messages.fetch(messageId)
          debug(`Found ${messageId} in #${channel.name}`)
          await message.react(emoji)
        } catch {}
      }
    }))

    await msg.channel.send(new MessageEmbed({
      title: ':bulb: __❱❱ INFO ❱❱__',
      description: "Successfully added role",
      color: 5235199, // Light Blue
    }))
  }
}
