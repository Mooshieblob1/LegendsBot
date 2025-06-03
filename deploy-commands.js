/**
 * Discord Bot Command Deployment Script
 * 
 * This script automatically registers slash commands with Discord's API.
 * It reads all command files from the './commands' directory and uploads
 * them to Discord so users can use them in servers where the bot is present.
 * 
 * @fileoverview Deploys slash commands to Discord API
 * @author Your Name
 * @version 1.0.0
 */

// Import Discord.js REST client and Routes helper for API interactions
import { REST, Routes } from 'discord.js';
// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';
// Import Node.js file system module to read files and directories
import fs from 'fs';

// Load environment variables from .env file into process.env
dotenv.config();

/**
 * Array to store all processed command data that will be sent to Discord
 * @type {Array<Object>}
 */
const commands = [];

/**
 * Read all files in the './commands' directory
 * This gets a list of all command files that need to be registered
 * @type {string[]}
 */
const commandFiles = fs.readdirSync('./commands');

/**
 * Loop through each command file and process it
 * For each file:
 * 1. Import the command module dynamically
 * 2. Extract the command data and convert it to JSON format
 * 3. Add it to the commands array for registration
 */
for (const file of commandFiles) {
  /**
   * Dynamically import each command file
   * Uses ES6 dynamic import to load the command module
   * @type {Object}
   */
  const command = await import(`./commands/${file}`);
  
  /**
   * Extract the command data, convert to JSON, and add to commands array
   * command.default.data contains the SlashCommandBuilder data
   * toJSON() converts it to the format Discord API expects
   */
  commands.push(command.default.data.toJSON());
}

/**
 * Create a new REST client instance for making API calls to Discord
 * Sets API version to '10' (latest) and authenticates with bot token
 * @type {REST}
 */
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

/**
 * Try-catch block to handle the command registration process
 * This prevents the script from crashing if something goes wrong
 */
try {
  // Log that the registration process is starting
  console.log('⏳ Refreshing slash commands...');
  
  /**
   * Register all commands with Discord's API
   * Uses REST client to make PUT request to Discord's application commands endpoint
   * - Routes.applicationCommands() creates the correct API endpoint URL
   * - process.env.DISCORD_BOT_ID is your bot's unique application ID
   * - { body: commands } sends all command data in the request body
   */
  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_BOT_ID),
    { body: commands }
  );
  
  // Log success message when commands are successfully registered
  console.log('✅ Slash commands registered!');
} catch (error) {
  /**
   * If anything goes wrong during registration, log the error
   * This helps with debugging if commands fail to register
   */
  console.error(error);
}
