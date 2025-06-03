# LegendsBot

LegendsBot is an experimental project for SAE students to make a bot that serves the needs of a university student. It's designed to be easy to understand, even for those new to programming. This document provides an overview of the setup, execution process, and project structure.

## Table of Contents

* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Running the Project](#running-the-project)
* [Project Structure](#project-structure)

---

## Getting Started

### Prerequisites

* [Python](https://www.python.org/downloads/) (e.g., v3.8 or newer)
* [pip](https://pip.pypa.io/en/stable/installation/) (Python package installer, usually comes with Python)
* [Visual Studio Code](https://code.visualstudio.com/) (Optional, but recommended for an easier experience with Python extensions)
* [Git](https://git-scm.com/downloads) (VS Code uses your system's Git installation)

### Installation

1. **Clone the repository (if you haven't already):**

   * **Option 1: Using the command line**

     ```bash
     git clone https://github.com/Mooshieblob1/LegendsBot # Replace with your Python bot's repository URL
     cd LegendsBot
     ```
   * **Option 2: Using Visual Studio Code**

     1. Open VS Code.
     2. If you see the "Welcome" page, click on "Clone Git Repository...".
     3. If you don't see the "Welcome" page, open the Command Palette (View > Command Palette or `Ctrl+Shift+P` / `Cmd+Shift+P`).
     4. Type `Git: Clone` and select it from the list.
     5. Paste your repository URL into the prompt and press Enter.
     6. Choose a local directory where you want to save the project.
     7. Once cloned, VS Code will ask if you want to open the cloned repository. Click "Open".

2. **Set up a virtual environment (recommended):**

   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

   *Tip: VS Code can often help manage virtual environments.*

3. **Install dependencies:** This will read the `requirements.txt` file and install all the necessary project dependencies into your virtual environment.

   ```bash
   python -m pip install -r requirements.txt
   ```

   *Tip: You can open a terminal directly in VS Code (Terminal > New Terminal or \`Ctrl+\`\`).*\\

4. **Set up environment variables (if applicable):** If the project uses a `.env.example` file, copy it to `.env` and fill in your specific configuration details (e.g., API keys, database URLs). The content for the `.env` file can be found as a pinned message in the SAE Legends Discord channel #uni-legends-bot.

   ```bash
   # If .env.example exists
   cp .env.example .env
   ```

   Then, open `.env` in a text editor and add your environment-specific values.

## Running the Project

Python is an interpreted language. The Python files are run directly by the Python interpreter. To run the bot (after activating the virtual environment and setting up `.env`):

```bash
python main.py
```

---

## Project Structure

This project follows a typical Python layout. Here’s what each folder and file does — explained simply for beginners:

---

### 📦 `venv/` or `.venv/`

This is a **virtual environment** — a separate space where all the tools (called *packages*) your bot needs are stored. It helps keep your project organized and avoids conflicts with other Python projects on your system.

> ⚠️ This folder should not be uploaded to GitHub — it’s usually listed in `.gitignore`.

---

### ⚙️ `commands/` or `cogs/`

This folder contains the **commands your bot can respond to** on Discord.

Each command gets its own file. For example:

* \`\` – Defines the `/add` command, which tells the bot to remember something (like a to-do task or reminder).
* \`\` – Handles the `/list` command. It shows everything the bot has saved using `/add`.
* \`\` – Handles the `/remove` command. It lets the bot forget something you've previously added.

---

### 📄 `requirements.txt`

This file lists what your project needs to work (called **dependencies**). It's a simple text file listing packages and their versions, typically managed with `pip`.

---

### 🔒 Pinned versions in `requirements.txt`

You can "pin" package versions like `discord.py==2.3.2` to ensure everyone working on the project uses the exact same version.

---

### 🐍 Python Files (e.g., `main.py`, `bot.py`, `deploy_commands.py`, `config.py`)

These are the core files that make the bot run:

* `or` – The *main engine* of the bot. It connects to Discord, loads your commands, and listens for activity.
* \`\` – A helper script that tells Discord which slash commands your bot offers. Run this when you add or update commands.
* \`\` – Stores project settings (like bot token or guild ID), though private stuff should go in `.env`.

---

### 🔐 `.env`

This file stores **private info** like your bot token or API keys.
Don’t share it or upload it to GitHub.

> ✅ If there’s a `.env.example`, use it to know what to include in your own `.env` file.

---

### 🚫 `.gitignore`

This tells Git which files/folders **not to upload** to GitHub — things like:

* `venv/` (your virtual environment)
* `__pycache__/` (auto-generated Python files)
* `.env` (your secrets)

---

### 📘 `README.md`

You’re looking at it!
This file explains what the project does and how to set it up.
