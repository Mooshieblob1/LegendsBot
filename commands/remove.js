/**
 * Discord slash command for removing events from the data storage.
 * This module exports a command object that can be registered with a Discord bot.
 * 
 * @fileoverview Remove command - Allows users to delete events by title from the bot's data store
 * @requires discord.js - Discord.js library for creating slash commands
 * @requires fs - Node.js file system module for reading and writing files
 */

/**
 * @typedef {Object} SlashCommand
 * @property {SlashCommandBuilder} data - The command structure and metadata
 * @property {Function} execute - The function that runs when the command is used
 */

/**
 * @typedef {Object} Event
 * @property {string} title - The title/name of the event
 * @property {...*} [otherProperties] - Other event properties that may exist
 */

/**
 * Default export containing the remove slash command configuration and execution logic
 * @type {SlashCommand}
 */
export default {
  /**
   * Slash command builder that defines the command structure
   * Creates a command named 'remove' that accepts a required string parameter 'title'
   * @type {SlashCommandBuilder}
   */
  data: new SlashCommandBuilder()
    .setName('remove') // Sets the command name that users will type (/remove)
    .setDescription('Remove an event by title') // Description shown in Discord's command help
    .addStringOption(opt => opt.setName('title').setDescription('Title to remove').setRequired(true)), // Adds a required text input field

  /**
   * Executes the remove command when a user runs it in Discord
   * Removes all events with the specified title from the data.json file
   * 
   * @async
   * @param {import('discord.js').CommandInteraction} interaction - The Discord interaction object containing user input and response methods
   * @returns {Promise<void>} - Promise that resolves when the command execution is complete
   * @throws {Error} - May throw errors if file operations fail or interaction response fails
   */
  async execute(interaction) {
    /**
     * Extracts the 'title' parameter value that the user provided
     * @type {string}
     */
    const title = interaction.options.getString('title');
    
    /**
     * Reads and parses the events data from the JSON file
     * Synchronously reads the entire file and converts JSON string to JavaScript array
     * @type {Event[]}
     */
    let events = JSON.parse(fs.readFileSync('./data.json'));
    
    /**
     * Stores the original number of events before filtering
     * Used later to determine if any events were actually removed
     * @type {number}
     */
    const originalLength = events.length;
    
    /**
     * Filters out events that match the specified title
     * Creates a new array containing only events whose title does NOT match the input
     * @type {Event[]}
     */
    events = events.filter(e => e.title !== title);
    
    /**
     * Writes the updated events array back to the JSON file
     * Converts the array to formatted JSON string with 2-space indentation
     */
    fs.writeFileSync('./data.json', JSON.stringify(events, null, 2));

    /**
     * Checks if no events were removed (array length unchanged)
     * If true, sends error message and exits function early
     */
    if (events.length === originalLength)
      return interaction.reply('❌ No event with that title found.');
    
    /**
     * Sends success message to Discord indicating the event was removed
     * Uses await to ensure the reply is sent before function completes
     */
    await interaction.reply(`🗑️ Event **${title}** removed.`);
  }
};
