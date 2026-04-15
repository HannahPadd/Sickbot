import "dotenv/config";
import {
  getMagic8BallAnswer,
  getMagic8BallAnswerDutch,
  getTransEggEmoji,
} from "./toy.js";
import {
  ApplicationCommandType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Client,
  ContextMenuCommandBuilder,
  GatewayIntentBits,
  MessageContextMenuCommandInteraction,
  REST,
  Routes,
  SlashCommandOptionsOnlyBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { reactSpellWord } from "./emoji.js";
import { rollCommand } from "./commands/roll.js";

const { APP_ID, DISCORD_TOKEN, PUBLIC_KEY, GUILD_ID } = process.env;
if (!DISCORD_TOKEN || !APP_ID || !PUBLIC_KEY || !GUILD_ID) {
  throw new Error("Missing required environment variables");
}

interface Credentials {
  token: string;
  client: string;
  publicKey: string;
  guildId: string;
}

const auth: Credentials = {
  token: DISCORD_TOKEN,
  client: APP_ID,
  publicKey: PUBLIC_KEY,
  guildId: GUILD_ID
};

interface ContainsBuilder {
  builder: unknown;
}

export interface Command {
  builder: SlashCommandOptionsOnlyBuilder;
  run: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface ContextMenu<
  T extends ContextMenuCommandBuilder = ContextMenuCommandBuilder,
> {
  builder: T;
  run: (
    interaction: T["type"] extends ApplicationCommandType.User
      ? UserContextMenuCommandInteraction
      : MessageContextMenuCommandInteraction,
  ) => Promise<void>;
}

const commands = [rollCommand];
const contexts: any = [];

const rest = new REST({ version: "10" }).setToken(auth.token);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationGuildCommands(auth.client, auth.guildId), {
    body: (commands as ContainsBuilder[])
      .concat(contexts)
      .map((x) => x.builder),
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

let clientId: string;

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = commands.find((x) => x.builder.name === interaction.commandName);

  if (cmd) {
    await cmd.run(interaction);
  }
});

client.on("clientReady", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
  clientId = client.user.id;
});

client.on("messageCreate", async (msg) => {
  await msg.fetch();

  const lowercase = msg.content.toLowerCase();

  // Response to asking if this is real
  if (msg.mentions.users.has(clientId) && lowercase.includes("is this real")) {
    return await msg.reply(getMagic8BallAnswer());
  }

  // Is dit echt?
  if (msg.mentions.users.has(clientId) && lowercase.includes("is dit echt")) {
    return await msg.reply(getMagic8BallAnswerDutch());
  }

  // Ei
  if (
    msg.mentions.users.has(clientId) &&
    lowercase.includes("are you an egg")
  ) {
    return await msg.react(getTransEggEmoji());
  }

  if (lowercase.includes("sick")) {
    await reactSpellWord(msg, "sick");
  }
});

client.login(auth.token);
