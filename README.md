# Phone Wipe Insert

Standalone fullscreen insert for a phone data-wipe screen, built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, **Bun**, and a local **shadcn/ui-style design system**.

## Run locally

```bash
bun install
bun dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
bun build
bun start
```

## Touch controls for set

The insert is now usable on phones/tablets without a keyboard or mouse:

- Hidden fullscreen button: invisible tap zone in the **top-right corner**.
- Double tap on empty screen: restart the wipe process from the beginning.
- Triple tap on empty screen: exit fullscreen.
- `Space` / `Enter`: restart process from the beginning.
- `R`: reset to pre-start idle state.
- `F`: enter fullscreen.

## Pre-start settings

Before the process starts, open **Настройки**. Settings are stored in `localStorage` on the device and survive reloads/restarts until you press **Сбросить локальные настройки**.

Available controls:

- Show/hide the startup hint. By default the hint appears on every visit/reload.
- Light/dark mode. Default is **light**.
- Android-style color presets: Pixel, Samsung One UI, Xiaomi HyperOS, Huawei HarmonyOS, OPPO ColorOS, Nothing OS, Motorola My UX.
- Process duration and progress graph: linear, slow start, fast start, middle hold, custom checkpoints.
- Element/screen styles: Material Clean, Minimal, Glass, Cyberpunk, Terminal, Operative noir, Brutalist.
- UI font preset.
- Manual colors: accent, background, panels, text, secondary text, glow.
- Date, device ID and battery percent.
- Optional hard cut to a black reboot screen after 100%, with a fictional glowing **Droid** wordmark and a custom non-Android geometric logo.

## Structure

```text
app/                  Next.js App Router
components/insert/    Screen insert components
components/ui/        shadcn-compatible local UI library
components/providers/ Theme provider
hooks/                Shared React hooks
lib/                  Utilities, presets and insert settings
public/               Manifest, app icon and fictional Droid reboot logo
styles/               Style notes
types/                Shared declarations
```

The visual language is custom, not default shadcn gray: light Android-system base by default with cinematic wipe HUD controls on top.


## Local settings reset

Open **Настройки → Жесты → Сбросить локальные настройки**. This removes the saved settings key and returns the insert to default light theme settings.

## Reboot screen

Open **Настройки → Рестарт** and enable the hard cut. After the wipe reaches 100%, the screen switches sharply to black and shows `/public/droid-logo.svg` plus the configurable `Droid` wordmark. The logo is intentionally fictional and does not reuse the Android robot mark.
