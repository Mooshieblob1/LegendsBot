/**
 * Discord slash command for listing upcoming events
 * @fileoverview This module exports a Discord.js slash command that reads event data from a JSON file and displays it to users
 */

// Import the SlashCommandBuilder class from discord.js library to create slash commands
import { SlashCommandBuilder } from 'discord.js';
// Import the file system module to read files from the local filesystem
import fs from 'fs';

/**
 * Discord slash command object for listing events
 * @type {Object}
 * @property {SlashCommandBuilder} data - The command configuration and metadata
 * @property {Function} execute - The function that runs when the command is executed
 */
export default {
  /**
   * Command configuration using Discord.js SlashCommandBuilder
   * Sets up the command name, description, and any parameters
   * @type {SlashCommandBuilder}
   */
  data: new SlashCommandBuilder()
    // Set the command name that users will type (e.g., /list)
    .setName('list')
    // Set the description that appears in Discord's command help
    .setDescription('List all upcoming events'),

  /**
   * Executes the list command when a user runs /list
   * Reads event data from data.json file and formats it for display
   * @async
   * @param {Object} interaction - Discord interaction object containing command details and response methods
   * @returns {Promise<void>} Promise that resolves when the interaction response is sent
   */
  async execute(interaction) {
    /**
     * Read and parse the events data from the JSON file
     * Synchronously reads './data.json' file and converts JSON string to JavaScript object
     * @type {Array<Object>} Array of event objects from the JSON file
     */
    const events = JSON.parse(fs.readFileSync('./data.json'));
    
    /**
     * Check if there are no events in the array
     * If empty, immediately reply to user and exit the function
     */
    if (!events.length) return interaction.reply('No events found.');

    /**
     * Format the events array into a readable string
     * Maps each event object to a formatted string with bullet point, title, and time
     * Then joins all formatted strings with newline characters
     * @type {string} Formatted string containing all events, one per line
     */
    const formatted = events.map(e => `• **${e.title}** at ${e.time}`).join('\n');
    
    /**
     * Send the formatted events list as a reply to the Discord interaction
     * This message will be visible to the user who ran the command
     */
    await interaction.reply(formatted);
  }
};
