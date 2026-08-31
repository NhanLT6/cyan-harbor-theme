# Ocean Harbor — oh-my-posh Prompt

Minimal two-line terminal prompt inspired by the Ocean Harbor color palette.

## Requirements

- [oh-my-posh](https://ohmyposh.dev/docs/installation/windows) v3+
- A Nerd Font — [JetBrains Mono NF](https://www.nerdfonts.com/font-downloads) recommended

## Install

### Windows — PowerShell

1. Install oh-my-posh:
   ```powershell
   winget install JanDeDobbeleer.OhMyPosh
   ```

2. Set your terminal font to **JetBrains Mono NF** in Windows Terminal settings.

3. Add to your PowerShell profile (`$PROFILE`):
   ```powershell
   oh-my-posh init pwsh --config "C:\path\to\prompt\ocean-harbor.omp.json" | Invoke-Expression
   ```
   Replace `C:\path\to` with the actual path to this repo.

### Linux / Fedora — Bash

1. Install oh-my-posh:
   ```bash
   curl -s https://ohmyposh.dev/install.sh | bash -s
   ```

2. Add to `~/.bashrc`:
   ```bash
   eval "$(oh-my-posh init bash --config ~/path/to/prompt/ocean-harbor.omp.json)"
   ```

## Preview

Run the preview script to see the prompt rendered in your terminal with actual glyphs:

```powershell
pwsh prompt/preview.ps1
```

## IDE terminals

Git branch is automatically hidden inside **Rider** and **VS Code** terminals — detected via `TERMINAL_EMULATOR=JetBrains-JediTerm` and `TERM_PROGRAM=vscode`.

## Features

- 3-line layout: ocean surface → info line → connector
- Ocean surface: flat reflection pattern using `_` in 6 water tones, sail boat `󰻈` near left edge
- Path: git root folder bright, subdirs dim
- Branch name truncated to 20 chars
- `╰❯` turns to `󰅚` with exit code on failure
- Transient prompt: previous prompts collapse to `╰❯` in scrollback
