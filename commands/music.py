import asyncio
import os
import yt_dlp
from discord.ext import commands
import discord

# Simple music cog using yt-dlp to extract audio and FFmpeg for playback.
# Commands: join, leave, play, stop

YTDL_OPTIONS = {
    'format': 'bestaudio/best',
    'outtmpl': 'downloads/%(id)s.%(ext)s',
    'noplaylist': True,
    'quiet': True,
}
FFMPEG_OPTIONS = {
    'options': '-vn'
}

class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)
        self.data = data
        self.title = data.get('title')
        self.url = data.get('url')

    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        ytdl = yt_dlp.YoutubeDL(YTDL_OPTIONS)

        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))

        if 'entries' in data:
            data = data['entries'][0]

        filename = data['url'] if stream else ytdl.prepare_filename(data)
        return cls(discord.FFmpegPCMAudio(filename, **FFMPEG_OPTIONS), data=data)

class Music(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='join')
    async def join(self, ctx):
        if ctx.author.voice is None:
            await ctx.send('You are not connected to a voice channel.')
            return
        channel = ctx.author.voice.channel
        if ctx.voice_client is not None:
            await ctx.voice_client.move_to(channel)
            return
        await channel.connect()
        await ctx.send(f'Joined {channel.name}')

    @commands.command(name='leave')
    async def leave(self, ctx):
        if ctx.voice_client is None:
            await ctx.send('Not connected to any voice channel.')
            return
        await ctx.voice_client.disconnect()
        await ctx.send('Disconnected.')

    @commands.command(name='play')
    async def play(self, ctx, *, query: str):
        """Play from a YouTube URL or search query."""
        if ctx.author.voice is None:
            await ctx.send('You are not connected to a voice channel.')
            return
        if ctx.voice_client is None:
            await ctx.author.voice.channel.connect()

        async with ctx.typing():
            # If query is URL, pass through; otherwise use yt-dlp to search
            url = query
            if not (query.startswith('http://') or query.startswith('https://')):
                # use yt-dlp to search
                ytdl = yt_dlp.YoutubeDL({'quiet': True, 'noplaylist': True})
                info = ytdl.extract_info(f"ytsearch:{query}", download=False)['entries'][0]
                url = info['webpage_url']

            player = await YTDLSource.from_url(url, loop=self.bot.loop, stream=True)
            ctx.voice_client.stop()
            ctx.voice_client.play(player, after=lambda e: print('Player error: %s' % e) if e else None)

        await ctx.send(f'Now playing: {player.title}')

    @commands.command(name='stop')
    async def stop(self, ctx):
        if ctx.voice_client is None or not ctx.voice_client.is_playing():
            await ctx.send('Nothing is playing right now.')
            return
        ctx.voice_client.stop()
        await ctx.send('Stopped playback.')


def setup(bot):
    bot.add_cog(Music(bot))
