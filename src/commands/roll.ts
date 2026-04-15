import { Command } from "../app.js";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const rollCommand: Command = {
  builder: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a random number")
    .addIntegerOption((option) =>
      option.setName("min").setDescription("Minimum number").setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("max").setDescription("Maximum number").setRequired(true),
    ),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const min = interaction.options.getInteger("min", true);
    const max = interaction.options.getInteger("max", true);

    console.log("roll command received");

    if (min > max) {
      await interaction.editReply("❌ Min cannot be greater than max");
      return;
    }
    const res = Math.floor(Math.random() * (max - min + 1)) + min;

    await interaction.editReply(`🎲 You rolled: ${res}`);
  },
};
