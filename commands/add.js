import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

/**
 * @file add.js
 * @description This file defines a Discord slash command for adding events.
 * It allows users to create new events with a title and a specific time.
 * The event data is stored in a JSON file.
 */

/**
 * @module addCommand
 * @description An object that represents the 'add' slash command.
 * This command is used to add new events to a list, which is stored in a JSON file.
 *
 * @property {object} data - This property holds the configuration for the slash command.
 * It's built using `SlashCommandBuilder` from the `discord.js` library.
 *   @property {string} data.name - The name of the command, which is 'add'. This is what users will type to invoke the command (e.g., /add).
 *   @property {string} data.description - A brief explanation of what the command does, shown to the user in Discord. Here, it's 'Add a class or event'.
 *   @property {function} data.addStringOption - This method is called twice to define the inputs (options) the command expects from the user.
 *     @param {object} opt1 - The first option configuration.
 *       @param {string} opt1.name - The internal name for this option, 'title'.
 *       @param {string} opt1.description - A description shown to the user for this option, 'Name of the event'.
 *       @param {boolean} opt1.required - A boolean indicating if this option must be provided by the user. `true` means it's mandatory.
 *     @param {object} opt2 - The second option configuration.
 *       @param {string} opt2.name - The internal name for this option, 'time'.
 *       @param {string} opt2.description - A description shown to the user for this option, 'Time (YYYY-MM-DD HH:mm)'.
 *       @param {boolean} opt2.required - A boolean indicating if this option must be provided by the user. `true` means it's mandatory.
 *
 * @property {function} execute - This is an asynchronous function that runs when a user executes the '/add' command.
 *   @param {object} interaction - An object representing the interaction with the command. It contains all the information about how the user invoked the command, including the options they provided.
 *   @returns {Promise<void>} A promise that resolves when the command execution is complete.
 *
 * @example
 * // User types in Discord: /add title: "Team Meeting" time: "2023-12-25 10:00"
 * // The execute function will then:
 * // 1. Get "Team Meeting" for 'title'.
 * // 2. Get "2023-12-25 10:00" for 'time'.
 * // 3. Read existing events from './data.json'.
 * // 4. Add { title: "Team Meeting", time: "2023-12-25 10:00" } to the events.
 * // 5. Write the updated events list back to './data.json'.
 * // 6. Reply to the user: "✅ Event **Team Meeting** added for **2023-12-25 10:00**".
 */
export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a class or event')
    .addStringOption(opt => opt.setName('title').setDescription('Name of the event').setRequired(true))
    .addStringOption(opt => opt.setName('time').setDescription('Time (YYYY-MM-DD HH:mm)').setRequired(true)),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const time = interaction.options.getString('time');
    const events = JSON.parse(fs.readFileSync('./data.json'));

    events.push({ title, time });
    fs.writeFileSync('./data.json', JSON.stringify(events, null, 2));

    await interaction.reply(`✅ Event **${title}** added for **${time}**`);
  }
};
