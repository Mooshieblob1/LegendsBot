import asyncio
import os
from discord.ext import tasks
from dotenv import load_dotenv

load_dotenv()
REMINDER_CHANNEL_ID = int(os.getenv("REMINDER_CHANNEL_ID"))

def setup(bot):
    @bot.event
    async def on_ready():
        reminder_loop.start(bot)

    @tasks.loop(minutes=1)
    async def reminder_loop(bot):
        channel = bot.get_channel(REMINDER_CHANNEL_ID)
        if channel:
            await channel.send("⏰ Reminder: Stay hydrated and check your tasks!")
