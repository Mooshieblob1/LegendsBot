import cron from 'node-cron';
import fs from 'fs';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const events = JSON.parse(fs.readFileSync('./data.json'));
    const toNotify = events.filter(e => {
      const diff = new Date(e.time) - now;
      return diff > 0 && diff < 60000;
    });

    for (const event of toNotify) {
      const channel = await client.channels.fetch(process.env.REMINDER_CHANNEL_ID);
      if (channel) channel.send(`🔔 Reminder: **${event.title}** is starting soon!`);
    }
  });

  console.log('🕒 Scheduler running');
});

client.login(process.env.DISCORD_TOKEN);
