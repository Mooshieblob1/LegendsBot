import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import './scheduler.js';

dotenv.config();

/**
 * @file /home/blob/Repositories/LegendsBot/index.js
 * @description This file is the main entry point for the LegendsBot.
 * It initializes the Discord client and sets up its intents.
 */

/**
 * @const {Client} client
 * @description This line declares a constant variable named `client`.
 * A constant means its value cannot be changed after it's set.
 * It's being assigned a new instance of the `Client` class.
 *
 * `new Client({ ... })` creates a new "bot" object.
 * Think of `Client` as a blueprint from the discord.js library that defines what a bot is and can do.
 * `new` is a keyword that creates an actual, usable bot object from that blueprint.
 *
 * The `{ intents: [GatewayIntentBits.Guilds] }` part is an options object passed to the `Client` when creating it.
 * - `intents`: This property is crucial for telling Discord what kind of information (or "events") your bot wants to receive.
 *   Without specifying intents, your bot might not get updates about things happening on Discord.
 * - `[GatewayIntentBits.Guilds]`: This is an array specifying which particular intents your bot needs.
 *   - `GatewayIntentBits.Guilds`: This specific intent tells Discord that your bot is interested in events related to "guilds".
 *     In Discord terminology, a "guild" is a server. So, this allows your bot to know when it joins a server,
 *     when a server's details change, when channels are created in a server, etc.
 *     `GatewayIntentBits` is an object (or enum) provided by discord.js that lists all available intents.
 *
 * In simpler terms: We are creating our bot and telling it, "Hey, please pay attention to events happening in the servers you are part of."
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

client.once('ready', () => {
  console.log(`🟢 Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: 'There was an error.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
