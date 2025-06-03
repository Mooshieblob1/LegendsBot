from discord.ext import commands
from commands.add import tasks

class Remove(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="remove")
    async def remove_task(self, ctx, *, task: str):
        if task in tasks:
            tasks.remove(task)
            await ctx.send(f"Removed: {task}")
        else:
            await ctx.send("Task not found.")

def setup(bot):
    bot.add_cog(Remove(bot))
