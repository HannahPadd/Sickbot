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
  Events,
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
  guildId: GUILD_ID,
};

export interface Command {
  builder: SlashCommandOptionsOnlyBuilder;
  run: (interaction: ChatInputCommandInteraction) => Promise<any>;
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

const commands: Command[] = [rollCommand];
const contexts: ContextMenu[] = [];

const rest = new REST({ version: "10" }).setToken(auth.token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(auth.client, auth.guildId), {
      body: [
        ...commands.map((c) => c.builder.toJSON()),
        ...contexts.map((c) => c.builder.toJSON()),
      ],
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(`Interaction received: ${interaction.commandName}`);

  const cmd = commands.find((x) => x.builder.name === interaction.commandName);

  if (!cmd) {
    console.log(`No command handler found for: ${interaction.commandName}`);
    return;
  }

  try {
    await cmd.run(interaction);
  } catch (error) {
    console.error(`Error running command ${interaction.commandName}:`, error);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("There was an error executing this command.");
    } else {
      await interaction.reply({
        content: "There was an error executing this command.",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.ClientReady, (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) return;

  const lowercase = msg.content.toLowerCase();
  const botId = client.user?.id;

  if (botId && msg.mentions.users.has(botId)) {
    if (lowercase.includes("is this real")) {
      return await msg.reply(getMagic8BallAnswer());
    }
    if (lowercase.includes("is dit echt")) {
      return await msg.reply(getMagic8BallAnswerDutch());
    }
    if (lowercase.includes("are you an egg")) {
      return await msg.react(getTransEggEmoji());
    }
  }

  if (lowercase.includes("sick")) {
    await reactSpellWord(msg, "sick");
  }
});

client.login(auth.token);
