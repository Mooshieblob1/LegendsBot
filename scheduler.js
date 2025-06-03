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
    /**
     * Filters events to find those that need to be notified about soon.
     * An event is considered ready for notification if it occurs within the next minute (60 seconds).
     * 
     * @type {Array} toNotify - Array of event objects that are scheduled to occur within the next 60 seconds
     * @description This filtering operation:
     *   - Calculates the time difference between each event's scheduled time and the current time
     *   - Includes events where the difference is positive (future events) and less than 60000ms (1 minute)
     *   - Excludes past events (diff <= 0) and events too far in the future (diff >= 60000ms)
     */
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
