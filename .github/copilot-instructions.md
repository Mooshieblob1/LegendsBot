Overview

This repo is a small Discord bot implemented in Python with a minimal structure. The goal of this instruction file is to give AI coding agents enough targeted knowledge to be productive immediately: where the entry points are, common patterns, notable quirks, and safe modification areas.

Quick facts

- Entrypoint: `bot.py` (loads cogs from `commands/`).
- Commands folder: `commands/` contains per-command cogs: `add.py`, `list.py`, `remove.py`, `scheduler.py`.
- Simple persistent data: `data.json` exists but is currently unused by the code; `commands/add.py` uses an in-memory list named `tasks` to share state.
- Dependencies: listed in `requirements.txt` (includes `discord-py`, `python-dotenv`).

What to know about architecture and data flow

- bot.py is the application's main file. It configures the bot, loads every `.py` in `commands/` as an extension, and runs the bot using a `DISCORD_TOKEN` loaded via `python-dotenv`.
- Each file in `commands/` exposes a Cog and a `setup(bot)` function so the bot can load it as an extension. This is the primary plugin pattern used here.
- Shared state: `commands/add.py` defines a top-level list `tasks` and other command modules import it (e.g., `list.py` and `remove.py` import `from commands.add import tasks`). This is an explicit, intentional pattern in the repo and is relied upon by the other commands. Avoid changing it without updating all imports.
- `scheduler.py` registers a background loop on `on_ready` which reads `REMINDER_CHANNEL_ID` from environment variables and posts reminders once per minute.
- `data.json` currently contains an empty JSON array. It may be intended as persistent storage for tasks but is not wired into the command modules. If you add persistence, update all command modules to read/write `data.json` atomically.

Project-specific conventions / gotchas

- Mutable shared module-level state is the de-facto data-sharing mechanism (see `tasks` in `commands/add.py`). When editing, prefer to keep the same module-level contract or move to a central storage module and update imports across commands.
- Cogs use the classic `setup(bot)` pattern (not the newer `setup`/`async_setup` plugin pattern). Maintain that pattern when adding new command files.
- Environment variables are loaded with `python-dotenv` in code examples; `DISCORD_TOKEN` and `REMINDER_CHANNEL_ID` are referenced. Do not hard-code secrets in repo files.
- `commands/scheduler.py` uses `discord.ext.tasks.loop` and registers the loop via `on_ready`. Keep the same pattern to ensure the loop starts when the bot is ready.

Developer workflows & useful commands

- Install deps and create virtualenv (standard Python):

  python -m venv venv
  source venv/bin/activate
  python -m pip install -r requirements.txt

- Run the bot (after setting `.env` with `DISCORD_TOKEN` and optionally `REMINDER_CHANNEL_ID`):

  python bot.py

- Testing/debugging tips:
  - Add linting or run simple prints/logging — the bot prints `Logged in as ...` on ready.
  - To test command interactions locally, use a test Discord server and a bot token with appropriate intents.

Code examples and patterns to reference

- Loading extensions (in `bot.py`): iterate `./commands` and call `bot.load_extension(f"commands.{filename[:-3]}")` for each `.py` file.
- Shared list contract (in `commands/add.py`):

  tasks = []

  class Add(commands.Cog):
      @commands.command(name="add")
      async def add_task(self, ctx, *, task: str):
          tasks.append(task)

  Other modules import `tasks` with `from commands.add import tasks`.

- Scheduler pattern (in `commands/scheduler.py`): uses `@tasks.loop(minutes=1)` and starts the loop on `on_ready`.

Safe change guidance

- Safe areas: adding new commands as new cog files following the `setup(bot)` pattern; adding tests or CI configs; wiring `data.json` to provide optional persistence (but update imports to avoid doubling sources of truth).
- Risky areas: removing or refactoring the `tasks` module-level list without updating all importers; changing the extension loading mechanism in `bot.py` without verifying all cogs still load.

What an AI agent should do first

1. Run the bot locally (with a test token) to confirm the current behavior.
2. If adding persistence, implement a single new module (e.g., `storage.py`) and migrate `tasks` to it, then update commands to import from `storage` in one PR.
3. When modifying `scheduler.py`, be mindful of environment variable parsing (`REMINDER_CHANNEL_ID` must be int).

Files worth inspecting when changing behavior

- `bot.py` — entrypoint/extension loader
- `commands/add.py` — defines `tasks`, primary state holder
- `commands/list.py`, `commands/remove.py` — import `tasks` and show the usage contract
- `commands/scheduler.py` — background task and env usage
- `requirements.txt` — dependency pins

If you need more context

- Ask for the intended persistence model (should `data.json` replace in-memory `tasks`?), desired command semantics, or CI/test expectations.

---

If anything here is unclear or you'd like more examples (for example, a migration plan to persistent storage or a CI configuration), tell me which area to expand.