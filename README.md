# Phone Wipe Insert

Standalone fullscreen insert for a phone data-wipe screen, built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, **Bun**, and a local **shadcn/ui-style design system**.

The default interface language is now **English**. Russian localization can be enabled from the pre-start settings screen.

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

## Start behavior

The wipe no longer starts immediately. By default, the insert waits for an explicit destructive action:

- default start mode: **DELETE button**;
- the button is red in every theme by default;
- the DELETE button color is configurable in settings;
- wipe elements appear only after the button is pressed;
- the DELETE button disappears when the wipe UI enters the active state.

Alternative mode:

- **Tap to start** can be enabled in settings;
- in this mode, a single tap on the idle screen starts the wipe process.

Fullscreen remains available in the idle state through the invisible top-right fullscreen area.

## Startup control hint

On every visit or page reload, the insert shows a pre-start hint with both touch gestures and keyboard keybinds. It can be disabled in **Settings → Gestures / Keys** before the process starts.

Touch-only devices:

- Hidden fullscreen button: invisible tap zone in the **top-right corner**.
- Double tap on empty screen: restart the wipe process from the beginning.
- Triple tap on empty screen: exit fullscreen.

Keyboard / desktop devices:

- `Space` / `Enter` / `Delete`: start or restart the process.
- `R`: reset to the pre-start idle state.
- `F`: enter fullscreen.

## Motion presets

Animations are now controlled by presets:

- **Reduced** — calmer motion for older phones or cleaner camera capture;
- **Balanced** — default preset;
- **Enhanced** — stronger motion, faster rings, brighter scanning and more visible transitions.

The selected animation preset affects the DELETE button sparkle, live UI reveal, scan/ring motion, and completion wave timing.

## Pre-start settings

Before the process starts, open **Settings**. Settings are stored in `localStorage` on the device and survive reloads/restarts until you press **Reset local settings**.

Available controls:

- Language: English / Russian.
- Start mode: DELETE button / screen tap.
- Animation preset: Reduced / Balanced / Enhanced.
- DELETE button color.
- Show/hide the startup hint. By default the hint appears on every visit/reload.
- Light/dark mode. Default is **light**.
- Android-style color presets: Pixel, Samsung One UI, Xiaomi HyperOS, Huawei HarmonyOS, OPPO ColorOS, Nothing OS, Motorola My UX.
- Process duration and progress graph: linear, slow start, fast start, middle hold, custom checkpoints. Default is the fastest available config: 8 seconds with an aggressive custom curve.
- Element/screen styles: Material Clean, Minimal, Glass, Cyberpunk, Terminal, Operative noir, Brutalist.
- UI font preset.
- Manual colors: accent, background, panels, text, secondary text, glow.
- Date, device ID and battery percent.
- Optional hard cut to a black reboot screen after 100%, with a fictional glowing **Droid** wordmark and a custom non-Android geometric logo.

## Fast default process

The default wipe process uses the fastest available settings from the existing config:

- duration: **8 seconds**;
- progress profile: **custom**;
- custom checkpoints: **45% at 25% time**, **85% at 60% time**, **98% at 90% time**;
- settings storage key bumped to `phone-wipe-insert-settings-v6-start-controls`, so new defaults are applied even on devices that previously saved older local settings.

You can still slow the animation down from **Settings → Speed** if the shot needs a longer rhythm.

## Completion wave

At 100%, the insert shows a meaningful completion animation: a final control wave expands from the center, cross-axis lines lock onto the cleared storage state, and the confirmation card reports that residual signatures were suppressed. This keeps the ending readable on camera without turning it into random decoration.

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
