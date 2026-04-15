import { Command } from "../app.js";
import { SlashCommandBuilder } from "discord.js";

export const rollCommand: Command = {
  builder: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a random number")
    .addIntegerOption((option: any) =>
      option.setName("min").setDescription("Minimum number").setRequired(true),
    )
    .addIntegerOption((option: any) =>
      option.setName("max").setDescription("Maximum number").setRequired(true),
    ),
  async run(interaction: any) {
    const min = interaction.options.getInteger("min");
    const max = interaction.options.getInteger("max");
    console.log("roll command received")
    if (min > max) {
      return await interaction.reply("❌ Min cannot be greater than max");
    }
    const res = Math.random() * (max - min) + min;
    return await interaction.reply(`🎲 You rolled: ${res}`);
  },
};
