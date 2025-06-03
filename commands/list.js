import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all upcoming events'),

  async execute(interaction) {
    const events = JSON.parse(fs.readFileSync('./data.json'));
    if (!events.length) return interaction.reply('No events found.');

    const formatted = events.map(e => `• **${e.title}** at ${e.time}`).join('\n');
    await interaction.reply(formatted);
  }
};
