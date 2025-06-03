import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const commands = [];
const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('⏳ Refreshing slash commands...');
  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_BOT_ID),
    { body: commands }
  );
  console.log('✅ Slash commands registered!');
} catch (error) {
  console.error(error);
}
