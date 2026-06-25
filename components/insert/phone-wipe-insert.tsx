"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  elementStyles,
  fontOptions,
  presets,
  progressForProfile,
  progressProfiles,
  rgba,
  sanitizeSettings,
  settingsWithPreset,
  toneFromPreset,
  type ElementStyle,
  type FontId,
  type InsertSettings,
  type PresetId,
  type ProgressProfile,
  type ThemeMode,
} from "@/lib/insert-settings";
import { cn } from "@/lib/utils";

const stages = [
  { threshold: 0, label: "ИНИЦИАЛИЗАЦИЯ", detail: "Проверка пользовательского профиля" },
  { threshold: 10, label: "БЛОКИРОВКА", detail: "Отключение внешних подключений" },
  { threshold: 23, label: "ИНДЕКСАЦИЯ", detail: "Сканирование локального хранилища" },
  { threshold: 39, label: "ОЧИСТКА", detail: "Удаление сообщений и вложений" },
  { threshold: 57, label: "ОЧИСТКА", detail: "Сброс журналов вызовов и контактов" },
  { threshold: 74, label: "ПЕРЕЗАПИСЬ", detail: "Перезапись пользовательских блоков" },
  { threshold: 91, label: "ФИНАЛИЗАЦИЯ", detail: "Проверка остаточных данных" },
  { threshold: 100, label: "ГОТОВО", detail: "Данные телефона очищены" },
] as const;

const dataGroups = [
  { name: "Сообщения", threshold: 34 },
  { name: "Вложения", threshold: 46 },
  { name: "Журнал вызовов", threshold: 55 },
  { name: "Контакты", threshold: 63 },
  { name: "Фото и видео", threshold: 74 },
  { name: "Геолокации", threshold: 82 },
  { name: "Кеш приложений", threshold: 91 },
  { name: "Ключи доступа", threshold: 100 },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(totalSeconds: number) {
  const baseHour = 19;
  const baseMinute = 42;
  const minutes = baseMinute + Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hour = (baseHour + Math.floor(minutes / 60)) % 24;
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readableOn(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean, 16);
  if (!Number.isFinite(value)) return "#ffffff";
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? "#06131a" : "#ffffff";
}

function SettingBlock({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card/70 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldRow({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {value ? <span className="font-mono text-[11px] text-muted-foreground">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-8 rounded-full border border-border bg-transparent p-0"
        />
      </span>
    </label>
  );
}

export function PhoneWipeInsert() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tapCountRef = React.useRef(0);
  const lastTapAtRef = React.useRef(0);
  const tapTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [settings, setSettings] = React.useState<InsertSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [runId, setRunId] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [hintOpen, setHintOpen] = React.useState(true);
  const [fullscreenFailed, setFullscreenFailed] = React.useState(false);
  const [rebootScreen, setRebootScreen] = React.useState(false);

  const blocks = React.useMemo(() => Array.from({ length: 112 }, (_, index) => index), []);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      const nextSettings = saved ? sanitizeSettings(JSON.parse(saved) as Partial<InsertSettings>) : DEFAULT_SETTINGS;
      setSettings(nextSettings);
      setHintOpen(nextSettings.showHints);
    } catch {
      setSettings(DEFAULT_SETTINGS);
      setHintOpen(true);
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [hydrated, settings]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.themeMode === "dark");
    document.documentElement.dataset.insertTheme = settings.themeMode;

    const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = settings.backgroundColor;
  }, [settings.themeMode, settings.backgroundColor]);

  React.useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  const activeStage = React.useMemo(() => {
    return [...stages].reverse().find((stage) => progress >= stage.threshold) ?? stages[0];
  }, [progress]);

  const wipedSize = React.useMemo(() => {
    const totalGb = 128;
    const erasedGb = (totalGb * progress) / 100;
    return `${erasedGb.toFixed(1)} ГБ / ${totalGb} ГБ`;
  }, [progress]);

  const currentTime = React.useMemo(() => formatTime(elapsed), [elapsed]);

  const runtimeStyle = React.useMemo(() => {
    const tone = toneFromPreset(settings.presetId, settings.themeMode);
    const primaryForeground = readableOn(settings.primaryColor);
    const gridColor = rgba(tone.grid, settings.themeMode === "light" ? 0.18 : 0.12);
    const primarySoft = rgba(settings.primaryColor, settings.themeMode === "light" ? 0.16 : 0.2);
    const glowAlpha = clamp(settings.glowStrength / 160, 0, 0.75);

    return {
      "--background": settings.backgroundColor,
      "--foreground": settings.foregroundColor,
      "--card": settings.surfaceColor,
      "--card-foreground": settings.foregroundColor,
      "--popover": settings.surfaceColor,
      "--popover-foreground": settings.foregroundColor,
      "--primary": settings.primaryColor,
      "--primary-foreground": primaryForeground,
      "--secondary": tone.surfaceAlt,
      "--secondary-foreground": settings.foregroundColor,
      "--muted": rgba(settings.mutedColor, settings.themeMode === "light" ? 0.12 : 0.2),
      "--muted-foreground": settings.mutedColor,
      "--accent": primarySoft,
      "--accent-foreground": settings.primaryColor,
      "--border": rgba(settings.primaryColor, settings.themeMode === "light" ? 0.22 : 0.18),
      "--input": rgba(settings.primaryColor, settings.themeMode === "light" ? 0.18 : 0.22),
      "--ring": settings.primaryColor,
      "--insert-bg": settings.backgroundColor,
      "--insert-surface": settings.surfaceColor,
      "--insert-surface-alt": tone.surfaceAlt,
      "--insert-fg": settings.foregroundColor,
      "--insert-muted": settings.mutedColor,
      "--insert-primary": settings.primaryColor,
      "--insert-secondary": tone.secondary,
      "--insert-success": tone.success,
      "--insert-warning": tone.warning,
      "--insert-grid": gridColor,
      "--insert-primary-soft": primarySoft,
      "--insert-glow-color": rgba(settings.primaryColor, glowAlpha),
      "--insert-glow": `0 0 ${40 + settings.glowStrength}px ${rgba(settings.primaryColor, glowAlpha)}`,
      "--font-live": fontOptions[settings.fontId].stack,
      "fontFamily": fontOptions[settings.fontId].stack,
    } as React.CSSProperties;
  }, [settings]);

  const requestFullscreenOnly = React.useCallback(async () => {
    try {
      const target = rootRef.current ?? document.documentElement;
      if (!document.fullscreenElement && target.requestFullscreen) {
        await target.requestFullscreen({ navigationUI: "hide" });
      }
      setFullscreenFailed(false);
    } catch {
      setFullscreenFailed(true);
    }
  }, []);

  const exitFullscreenOnly = React.useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      setFullscreenFailed(false);
    } catch {
      setFullscreenFailed(true);
    }
  }, []);

  const startFromBeginning = React.useCallback(() => {
    setFullscreenFailed(false);
    setRebootScreen(false);
    setSettingsOpen(false);
    setHintOpen(false);
    setProgress(0);
    setElapsed(0);
    setStarted(true);
    setRunId((value) => value + 1);
  }, []);

  const resetToIdle = React.useCallback(() => {
    setStarted(false);
    setRebootScreen(false);
    setProgress(0);
    setElapsed(0);
    setSettingsOpen(false);
    setHintOpen(settings.showHints);
  }, [settings.showHints]);

  React.useEffect(() => {
    if (!started) return;

    let animationFrame = 0;
    const startedAt = performance.now();
    const totalDurationMs = settings.durationSeconds * 1000;

    const tick = (now: number) => {
      const runtime = now - startedAt;
      const runtimeRatio = clamp(runtime / totalDurationMs, 0, 1);
      const nextProgress = clamp(progressForProfile(runtimeRatio, settings), 0, 100);

      setProgress(nextProgress);
      setElapsed(Math.floor(runtime / 1000));

      if (runtimeRatio < 1) animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [runId, settings, started]);

  React.useEffect(() => {
    if (!started || !settings.rebootEnabled || progress < 100) {
      if (progress < 100) setRebootScreen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setRebootScreen(true);
    }, settings.rebootDelaySeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [progress, settings.rebootDelaySeconds, settings.rebootEnabled, started]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === " " || key === "enter") {
        event.preventDefault();
        startFromBeginning();
      }
      if (key === "r") resetToIdle();
      if (key === "f") void requestFullscreenOnly();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestFullscreenOnly, resetToIdle, startFromBeginning]);

  const handleSurfacePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-control]")) return;
      if (settingsOpen) return;

      const now = Date.now();
      if (now - lastTapAtRef.current > 420) tapCountRef.current = 0;

      lastTapAtRef.current = now;
      tapCountRef.current += 1;

      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

      tapTimerRef.current = setTimeout(() => {
        const count = tapCountRef.current;
        tapCountRef.current = 0;

        if (count >= 3) {
          void exitFullscreenOnly();
          return;
        }

        if (count === 2) startFromBeginning();
      }, 360);
    },
    [exitFullscreenOnly, settingsOpen, startFromBeginning],
  );

  const updateSetting = React.useCallback(<Key extends keyof InsertSettings>(key: Key, value: InsertSettings[Key]) => {
    setSettings((current) => sanitizeSettings({ ...current, [key]: value }));
  }, []);

  const resetLocalSettings = React.useCallback(() => {
    try {
      window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch {
      // localStorage may be unavailable in private or embedded browser modes.
    }

    setSettings(DEFAULT_SETTINGS);
    setHintOpen(DEFAULT_SETTINGS.showHints);
    setStarted(false);
    setRebootScreen(false);
    setProgress(0);
    setElapsed(0);
  }, []);

  const applyThemeMode = React.useCallback((themeMode: ThemeMode) => {
    setSettings((current) => sanitizeSettings(settingsWithPreset(current, current.presetId, themeMode)));
  }, []);

  const applyPreset = React.useCallback((presetId: PresetId) => {
    setSettings((current) => sanitizeSettings(settingsWithPreset(current, presetId, current.themeMode)));
  }, []);

  const isComplete = progress >= 100;
  const currentPreset = presets[settings.presetId];

  return (
    <main
      ref={rootRef}
      style={runtimeStyle}
      className={cn("relative h-[100dvh] w-screen overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground", `insert-style-${settings.elementStyle}`)}
      onPointerUp={handleSurfacePointerUp}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,var(--insert-primary-soft),transparent_40%),linear-gradient(180deg,var(--insert-bg)_0%,var(--insert-surface-alt)_120%)]" />
      <div className="wipe-grid absolute inset-0 opacity-60" />
      <div className="scanline absolute inset-x-0 top-0 h-24 opacity-70" />

      <button
        type="button"
        data-control
        aria-label="Войти в полноэкранный режим"
        onPointerUp={(event) => event.stopPropagation()}
        onClick={() => void requestFullscreenOnly()}
        className="absolute right-1 top-1 z-50 h-12 w-12 rounded-full border border-primary/10 bg-primary/5 opacity-[0.035] transition-opacity active:opacity-40 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      {!started && (
        <div className="absolute left-2 top-2 z-40 flex gap-2" data-control onPointerUp={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" className="rounded-full bg-background/45 px-3 text-xs backdrop-blur" onClick={() => setSettingsOpen(true)}>
            Настройки
          </Button>
          {!settings.showHints && (
            <Button size="sm" variant="ghost" className="rounded-full bg-background/45 px-3 text-xs backdrop-blur" onClick={() => setHintOpen(true)}>
              Подсказка
            </Button>
          )}
        </div>
      )}

      <section className="relative z-10 mx-auto flex h-full w-full max-w-[460px] flex-col px-5 py-4 sm:px-7 sm:py-6">
        <header className="flex items-center justify-between text-[12px] font-medium tracking-[0.12em] text-muted-foreground">
          <span>{currentTime}</span>
          <Badge variant="outline" className="border-primary/20 bg-background/35 text-[10px] uppercase tracking-[0.24em] text-foreground/75 backdrop-blur">
            {settings.dateLabel}
          </Badge>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_14px_var(--insert-glow-color)]" />
            {settings.batteryPercent}%
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-8">
          <div className="space-y-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-primary/80">SYSTEM WIPE</p>
            <h1 className="text-balance text-[34px] font-semibold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-[42px]">
              Очистка данных
            </h1>
            <p className="mx-auto max-w-[310px] text-sm leading-6 text-muted-foreground">{activeStage.detail}</p>
          </div>

          <Card className="glass-panel mx-auto grid h-[228px] w-[228px] place-items-center rounded-full p-0">
            <CardContent className="relative grid h-full w-full place-items-center p-0">
              <div className="wipe-ring absolute inset-3 rounded-full" />
              <div className="absolute inset-8 rounded-full border border-border bg-card/90 shadow-[inset_0_0_40px_rgba(0,0,0,0.22)]" />
              <div className="relative z-10 text-center">
                <div className="text-[58px] font-light tabular-nums tracking-[-0.08em] text-foreground">
                  {Math.floor(progress)}
                  <span className="text-2xl text-primary/80">%</span>
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-primary/75">{activeStage.label}</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Progress value={progress} className="h-2 bg-muted" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-[0.18em]">{wipedSize}</span>
              <span className="font-mono uppercase tracking-[0.18em]">{isComplete ? "complete" : progressProfiles[settings.progressProfile]}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {dataGroups.map((group) => {
              const done = progress >= group.threshold;
              return (
                <div
                  key={group.name}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-3 py-2 text-[12px] transition-all duration-300",
                    done ? "border-primary/30 bg-primary/10 text-foreground" : "border-border bg-card/40 text-muted-foreground",
                  )}
                >
                  <span>{group.name}</span>
                  <span className="font-mono text-[11px]">{done ? "OK" : "··"}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1 opacity-75" aria-hidden="true">
            {blocks.map((block) => {
              const lit = progress > (block / blocks.length) * 100;
              return (
                <span
                  key={block}
                  className={cn("h-1.5 rounded-full", lit ? "bg-primary shadow-[0_0_10px_var(--insert-glow-color)]" : "bg-muted")}
                />
              );
            })}
          </div>
        </div>

        <footer className="pb-1 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Device ID: {settings.deviceId} / Storage partition reset
        </footer>
      </section>

      {!started && hintOpen && settings.showHints && !settingsOpen && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-background/82 px-8 text-center backdrop-blur-md">
          <div data-control onPointerUp={(event) => event.stopPropagation()} className="glass-panel max-w-[360px] rounded-[32px] px-7 py-6">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.35em] text-primary/75">touch controls</span>
            <span className="mt-3 block text-2xl font-semibold tracking-[-0.04em] text-foreground">Жесты для площадки</span>
            <div className="mt-4 space-y-2 text-left text-sm leading-6 text-muted-foreground">
              <p>Двойной тап по экрану — начать процесс заново.</p>
              <p>Тройной тап — выйти из полноэкранного режима.</p>
              <p>Почти невидимая зона справа сверху — вход в fullscreen.</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="secondary" className="rounded-full" onClick={() => setHintOpen(false)}>
                Скрыть сейчас
              </Button>
              <Button className="rounded-full" onClick={() => setSettingsOpen(true)}>
                Настройки
              </Button>
            </div>
            {fullscreenFailed && <p className="mt-3 text-xs text-[color:var(--insert-warning)]">Fullscreen не сработал. Нажми скрытую зону еще раз.</p>}
          </div>
        </div>
      )}

      {!started && settingsOpen && (
        <div className="absolute inset-0 z-40 bg-background/95 px-3 py-4 backdrop-blur-xl" data-control onPointerUp={(event) => event.stopPropagation()}>
          <div className="mx-auto flex h-full max-w-[560px] flex-col overflow-hidden rounded-[32px] border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/70">insert settings</p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">Настройки перед стартом</h2>
                <p className="mt-1 text-xs text-muted-foreground">Настройки сохраняются на устройстве и применяются без мыши.</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setSettingsOpen(false)}>
                Готово
              </Button>
            </div>

            <Tabs defaultValue="theme" className="min-h-0 flex-1 gap-0">
              <div className="overflow-x-auto border-b border-border px-4 py-3">
                <TabsList className="w-max bg-muted">
                  <TabsTrigger value="theme">Темы</TabsTrigger>
                  <TabsTrigger value="style">Стили</TabsTrigger>
                  <TabsTrigger value="speed">Скорость</TabsTrigger>
                  <TabsTrigger value="visual">Экран</TabsTrigger>
                  <TabsTrigger value="reboot">Рестарт</TabsTrigger>
                  <TabsTrigger value="hints">Жесты</TabsTrigger>
                </TabsList>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <TabsContent value="theme" className="space-y-4">
                  <SettingBlock title="Режим" description="По умолчанию стоит светлая тема. Переключение подтягивает цвета выбранного Android-пресета.">
                    <div className="grid grid-cols-2 gap-2">
                      {(["light", "dark"] as ThemeMode[]).map((mode) => (
                        <Button
                          key={mode}
                          variant={settings.themeMode === mode ? "default" : "secondary"}
                          className="rounded-2xl"
                          onClick={() => applyThemeMode(mode)}
                        >
                          {mode === "light" ? "Светлая" : "Тёмная"}
                        </Button>
                      ))}
                    </div>
                  </SettingBlock>

                  <SettingBlock title="Android-пресеты" description="Это не копии брендов, а киношные цветовые версии под их системный вайб.">
                    <div className="grid gap-2">
                      {(Object.keys(presets) as PresetId[]).map((id) => {
                        const preset = presets[id];
                        const tone = preset[settings.themeMode];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => applyPreset(id)}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                              settings.presetId === id ? "border-primary bg-primary/10" : "border-border bg-card/55",
                            )}
                          >
                            <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
                              <span className="flex-1" style={{ background: tone.background }} />
                              <span className="flex-1" style={{ background: tone.primary }} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">{preset.title}</span>
                              <span className="block truncate text-xs text-muted-foreground">{preset.system}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <SettingBlock title="Стилизация элементов" description="Это меняет не только цвета, а характер экранов: радиусы, сетку, плотность, свечение и ощущение интерфейса.">
                    <div className="grid gap-2">
                      {(Object.keys(elementStyles) as ElementStyle[]).map((id) => {
                        const style = elementStyles[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => updateSetting("elementStyle", id)}
                            className={cn(
                              "rounded-2xl border p-3 text-left transition",
                              settings.elementStyle === id ? "border-primary bg-primary/10 shadow-[0_0_28px_var(--insert-glow-color)]" : "border-border bg-card/55",
                            )}
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium">{style.label}</span>
                              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">{id}</span>
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">{style.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="speed" className="space-y-4">
                  <SettingBlock title="Скорость процесса" description="Для съемки важнее управляемый ритм, а не реализм. Линейный режим — самый предсказуемый.">
                    <FieldRow label="Длительность" value={`${settings.durationSeconds} сек`}>
                      <Slider min={8} max={120} step={1} value={[settings.durationSeconds]} onValueChange={([value]) => updateSetting("durationSeconds", value)} />
                    </FieldRow>
                    <FieldRow label="Профиль графика">
                      <Select value={settings.progressProfile} onValueChange={(value) => updateSetting("progressProfile", value as ProgressProfile)}>
                        <SelectTrigger className="w-full rounded-2xl bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(progressProfiles) as ProgressProfile[]).map((id) => (
                            <SelectItem key={id} value={id}>{progressProfiles[id]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldRow>
                    <div className="rounded-2xl border border-border bg-background/50 p-3">
                      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Ручной график</span>
                        <span>25% / 60% / 90% времени</span>
                      </div>
                      <div className="space-y-4">
                        <FieldRow label="На 25% времени" value={`${settings.checkpoint25}%`}>
                          <Slider min={5} max={45} step={1} value={[settings.checkpoint25]} onValueChange={([value]) => updateSetting("checkpoint25", value)} />
                        </FieldRow>
                        <FieldRow label="На 60% времени" value={`${settings.checkpoint60}%`}>
                          <Slider min={30} max={85} step={1} value={[settings.checkpoint60]} onValueChange={([value]) => updateSetting("checkpoint60", value)} />
                        </FieldRow>
                        <FieldRow label="На 90% времени" value={`${settings.checkpoint90}%`}>
                          <Slider min={65} max={98} step={1} value={[settings.checkpoint90]} onValueChange={([value]) => updateSetting("checkpoint90", value)} />
                        </FieldRow>
                      </div>
                    </div>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="visual" className="space-y-4">
                  <SettingBlock title="Шрифты и подписи">
                    <FieldRow label="Шрифт интерфейса">
                      <Select value={settings.fontId} onValueChange={(value) => updateSetting("fontId", value as FontId)}>
                        <SelectTrigger className="w-full rounded-2xl bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(fontOptions) as FontId[]).map((id) => (
                            <SelectItem key={id} value={id}>{fontOptions[id].label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldRow>
                    <div className="grid grid-cols-2 gap-2">
                      <FieldRow label="Дата">
                        <Input value={settings.dateLabel} onChange={(event) => updateSetting("dateLabel", event.target.value)} className="rounded-2xl bg-background/60" />
                      </FieldRow>
                      <FieldRow label="ID устройства">
                        <Input value={settings.deviceId} onChange={(event) => updateSetting("deviceId", event.target.value)} className="rounded-2xl bg-background/60" />
                      </FieldRow>
                    </div>
                    <FieldRow label="Заряд батареи" value={`${settings.batteryPercent}%`}>
                      <Slider min={1} max={100} step={1} value={[settings.batteryPercent]} onValueChange={([value]) => updateSetting("batteryPercent", value)} />
                    </FieldRow>
                  </SettingBlock>

                  <SettingBlock title="Цвета элементов" description={`Активный пресет: ${currentPreset.title}. Ручные цвета перезапишутся при смене пресета или светлой/тёмной темы.`}>
                    <ColorField label="Акцент" value={settings.primaryColor} onChange={(value) => updateSetting("primaryColor", value)} />
                    <ColorField label="Фон" value={settings.backgroundColor} onChange={(value) => updateSetting("backgroundColor", value)} />
                    <ColorField label="Панели" value={settings.surfaceColor} onChange={(value) => updateSetting("surfaceColor", value)} />
                    <ColorField label="Текст" value={settings.foregroundColor} onChange={(value) => updateSetting("foregroundColor", value)} />
                    <ColorField label="Вторичный текст" value={settings.mutedColor} onChange={(value) => updateSetting("mutedColor", value)} />
                    <FieldRow label="Свечение" value={`${settings.glowStrength}%`}>
                      <Slider min={0} max={100} step={1} value={[settings.glowStrength]} onValueChange={([value]) => updateSetting("glowStrength", value)} />
                    </FieldRow>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="reboot" className="space-y-4">
                  <SettingBlock title="Чёрный экран перезагрузки" description="После 100% можно резко уйти в чёрный экран с вымышленным системным логотипом Droid. Это не Android-лого, а отдельный киношный знак.">
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-3 py-3">
                      <div>
                        <p className="text-sm font-medium">Включить резкий переход</p>
                        <p className="text-xs text-muted-foreground">Без плавной анимации: очистка закончилась — экран сразу стал чёрным.</p>
                      </div>
                      <Switch checked={settings.rebootEnabled} onCheckedChange={(checked) => updateSetting("rebootEnabled", Boolean(checked))} />
                    </div>
                    <FieldRow label="Задержка после 100%" value={`${settings.rebootDelaySeconds.toFixed(1)} сек`}>
                      <Slider min={0} max={10} step={0.1} value={[settings.rebootDelaySeconds]} onValueChange={([value]) => updateSetting("rebootDelaySeconds", value)} />
                    </FieldRow>
                    <FieldRow label="Текст логотипа">
                      <Input value={settings.rebootLogoText} onChange={(event) => updateSetting("rebootLogoText", event.target.value)} className="rounded-2xl bg-background/60" />
                    </FieldRow>
                    <div className="rounded-[28px] border border-border bg-black p-6 text-center text-white">
                      <img src="/droid-logo.svg" alt="Droid logo preview" className="mx-auto h-16 w-16 drop-shadow-[0_0_22px_rgba(125,211,252,0.85)]" />
                      <p className="droid-wordmark mt-3 text-3xl text-cyan-100">{settings.rebootLogoText || "Droid"}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200/55">secure reboot</p>
                    </div>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="hints" className="space-y-4">
                  <SettingBlock title="Подсказка при загрузке" description="Подсказка появляется при каждом входе или перезагрузке, пока этот переключатель включен.">
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-3 py-3">
                      <div>
                        <p className="text-sm font-medium">Показывать подсказку</p>
                        <p className="text-xs text-muted-foreground">Можно отключить для чистой вставки перед стартом.</p>
                      </div>
                      <Switch checked={settings.showHints} onCheckedChange={(checked) => updateSetting("showHints", Boolean(checked))} />
                    </div>
                    <div className="rounded-2xl bg-muted p-3 text-xs leading-5 text-muted-foreground">
                      Двойной тап по пустому экрану запускает очистку с нуля. Тройной тап выходит из fullscreen. Почти невидимая кнопка справа сверху только включает fullscreen.
                    </div>
                    <Button variant="secondary" className="w-full rounded-full" onClick={resetLocalSettings}>
                      Сбросить локальные настройки
                    </Button>
                  </SettingBlock>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}

      {isComplete && !rebootScreen && (
        <div className="pointer-events-none absolute inset-x-5 bottom-16 z-20 mx-auto max-w-[420px] rounded-[28px] border border-primary/20 bg-primary/10 px-5 py-4 text-center text-sm text-foreground shadow-[0_20px_70px_var(--insert-glow-color)] backdrop-blur-xl">
          ДАННЫЕ УДАЛЕНЫ · УСТРОЙСТВО ГОТОВО К СБРОСУ
        </div>
      )}

      {rebootScreen && (
        <div className="pointer-events-none absolute inset-0 z-[80] grid place-items-center bg-black text-white">
          <div className="text-center">
            <img src="/droid-logo.svg" alt="" aria-hidden="true" className="mx-auto h-24 w-24 drop-shadow-[0_0_34px_rgba(125,211,252,0.95)]" />
            <div className="droid-wordmark mt-5 text-[46px] text-cyan-100 drop-shadow-[0_0_24px_rgba(125,211,252,0.8)]">
              {settings.rebootLogoText || "Droid"}
            </div>
            <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.42em] text-cyan-200/50">rebooting</div>
          </div>
        </div>
      )}
    </main>
  );
}
