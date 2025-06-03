from discord.ext import commands
from commands.add import tasks

class List(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="list")
    async def list_tasks(self, ctx):
        if not tasks:
            await ctx.send("No tasks saved.")
        else:
            await ctx.send("Saved tasks:\n" + "\n".join(f"- {t}" for t in tasks))

def setup(bot):
    bot.add_cog(List(bot))
