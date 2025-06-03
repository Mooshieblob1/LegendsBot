import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove an event by title')
    .addStringOption(opt => opt.setName('title').setDescription('Title to remove').setRequired(true)),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    let events = JSON.parse(fs.readFileSync('./data.json'));
    const originalLength = events.length;
    events = events.filter(e => e.title !== title);
    fs.writeFileSync('./data.json', JSON.stringify(events, null, 2));

    if (events.length === originalLength)
      return interaction.reply('❌ No event with that title found.');
    await interaction.reply(`🗑️ Event **${title}** removed.`);
  }
};
