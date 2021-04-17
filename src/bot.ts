import quickDb from "quick.db"
import {Client, MessageEmbed, Permissions, Snowflake} from "discord.js"
import dotenv from "dotenv"
import util from "util";
import CommandHandler from "./CommandHandler";
import debugBase from "debug";

dotenv.config()

const prefix = process.env.PREFIX || "&"
const debug = debugBase('reaction-roles:reactions')

interface MessageInfo {
  roles: {[emoji: string]: Snowflake}
}

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const commandHandler = new CommandHandler(prefix)
const permissions = new Permissions()

permissions.add(Permissions.FLAGS.ADD_REACTIONS)
permissions.add(Permissions.FLAGS.SEND_MESSAGES)
permissions.add(Permissions.FLAGS.MANAGE_MESSAGES)
permissions.add(Permissions.FLAGS.MANAGE_ROLES)

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching a message: ', error);
      return;
    }
  }

  if (user.bot) return

  const message = reaction.message
  const messageInfo = quickDb.get(`${message.id}`) as MessageInfo

  if (!messageInfo) return
  const emoji = reaction.emoji.id || reaction.emoji.name
  const roleId = messageInfo.roles[emoji]
  if (!roleId) {
    await reaction.remove()
    debug(`Invalid reaction ${emoji} on ${message.id}`)
    return
  }

  debug(`Added role ${roleId} to ${user.username}#${user.discriminator} due to reaction ${emoji} on ${message.id}`)

  message.guild?.member(user.id)?.roles.add(roleId)
})

client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching a message: ', error);
      return;
    }
  }

  if (user.bot) return

  const message = reaction.message
  const messageInfo = quickDb.get(`${message.id}`) as MessageInfo

  if (!messageInfo) return
  const emoji = reaction.emoji.id || reaction.emoji.name
  const roleId = messageInfo.roles[emoji]
  if (!roleId) {
    await reaction.remove()
    return
  }

  debug(`Removed role ${roleId} from ${user.username}#${user.discriminator} due to reaction ${emoji} on ${message.id}`)

  message.guild?.member(user.id)?.roles.remove(roleId)
})

function errorEmbed(content: string): MessageEmbed {
  return new MessageEmbed({
    title: ':warning: __❱❱ ERROR ❱❱__',
    description: content,
    color: 16731983, // Light Red
  })
}

client.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return
  if (!msg.guild) {
    await msg.channel.send(new MessageEmbed(errorEmbed("Commands can only be used in a guild!")))
    return
  }

  const split = msg.content.split(' ').filter(a => a !== "")
  const baseCmd = split[0]
  commandHandler.execute(baseCmd.slice(prefix.length).toLowerCase(), msg, split.slice(1))
      .catch(async (error: Error) => {
        await msg.channel.send(new MessageEmbed(errorEmbed(error.message)))
        console.error(`Error processing message ${msg.content}`)
        console.error(util.inspect(error))
      })
})


client.on('ready', () => {
  if (!client.user) throw new Error("Failed to authenticate")
  console.log(`Invite Link: https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions.bitfield}&scope=bot`)
})

client.login(process.env.TOKEN).catch((e) => {
  console.error(e)
  process.exit(1)
})
