from discord.ext import commands

tasks = []

class Add(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="add")
    async def add_task(self, ctx, *, task: str):
        tasks.append(task)
        await ctx.send(f"Task added: {task}")

def setup(bot):
    bot.add_cog(Add(bot))
