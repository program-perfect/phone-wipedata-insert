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
  animationPresets,
  elementStyles,
  fontOptions,
  localeOptions,
  presets,
  progressForProfile,
  progressProfiles,
  rgba,
  sanitizeSettings,
  settingsWithPreset,
  startModes,
  toneFromPreset,
  type AnimationPreset,
  type ElementStyle,
  type FontId,
  type InsertSettings,
  type LocaleId,
  type PresetId,
  type ProgressProfile,
  type StartMode,
  type ThemeMode,
} from "@/lib/insert-settings";
import { cn } from "@/lib/utils";

const stages = {
  en: [
    { threshold: 0, label: "INITIALIZE", detail: "Checking local user profile" },
    { threshold: 10, label: "LOCKDOWN", detail: "Disabling external sessions" },
    { threshold: 23, label: "INDEXING", detail: "Scanning local storage map" },
    { threshold: 39, label: "WIPE", detail: "Removing messages and attachments" },
    { threshold: 57, label: "WIPE", detail: "Resetting calls and contacts" },
    { threshold: 74, label: "OVERWRITE", detail: "Overwriting user data blocks" },
    { threshold: 91, label: "FINALIZE", detail: "Checking residual signatures" },
    { threshold: 100, label: "COMPLETE", detail: "Phone data wipe complete" },
  ],
  ru: [
    { threshold: 0, label: "ИНИЦИАЛИЗАЦИЯ", detail: "Проверка локального профиля" },
    { threshold: 10, label: "БЛОКИРОВКА", detail: "Отключение внешних сессий" },
    { threshold: 23, label: "ИНДЕКСАЦИЯ", detail: "Сканирование карты хранилища" },
    { threshold: 39, label: "ОЧИСТКА", detail: "Удаление сообщений и вложений" },
    { threshold: 57, label: "ОЧИСТКА", detail: "Сброс вызовов и контактов" },
    { threshold: 74, label: "ПЕРЕЗАПИСЬ", detail: "Перезапись пользовательских блоков" },
    { threshold: 91, label: "ФИНАЛИЗАЦИЯ", detail: "Проверка остаточных сигнатур" },
    { threshold: 100, label: "ГОТОВО", detail: "Данные телефона очищены" },
  ],
} as const;

const dataGroups = {
  en: [
    { name: "Messages", threshold: 34 },
    { name: "Attachments", threshold: 46 },
    { name: "Call log", threshold: 55 },
    { name: "Contacts", threshold: 63 },
    { name: "Photos & video", threshold: 74 },
    { name: "Locations", threshold: 82 },
    { name: "App cache", threshold: 91 },
    { name: "Access keys", threshold: 100 },
  ],
  ru: [
    { name: "Сообщения", threshold: 34 },
    { name: "Вложения", threshold: 46 },
    { name: "Журнал вызовов", threshold: 55 },
    { name: "Контакты", threshold: 63 },
    { name: "Фото и видео", threshold: 74 },
    { name: "Геолокации", threshold: 82 },
    { name: "Кеш приложений", threshold: 91 },
    { name: "Ключи доступа", threshold: 100 },
  ],
} as const;

const copy = {
  en: {
    settings: "Settings",
    hint: "Hint",
    systemWipe: "SYSTEM WIPE",
    title: "Data wipe",
    idleDetail: "Ready to remove local data. Press DELETE to start.",
    tapIdleDetail: "Ready to remove local data. Tap anywhere to start.",
    ready: "READY",
    delete: "DELETE",
    tapToStart: "Tap screen to start wipe",
    wipedVolume: (erased: string, total: string) => `${erased} / ${total}`,
    footer: (id: string) => `Device ID: ${id} / Storage partition reset`,
    controlKicker: "gesture & keybind controls",
    controlTitle: "Insert controls",
    controlDescription: "This hint appears on every visit or reload. It can be disabled in settings before the process starts.",
    noMouse: "touch-only",
    noMouseA: "Hidden top-right area — fullscreen.",
    noMouseB: "Double tap the screen — restart wipe.",
    noMouseC: "Triple tap — exit fullscreen.",
    keyboard: "keyboard",
    keyboardA: "Space / Enter / Delete — start or restart.",
    keyboardB: "R — reset to idle screen.",
    keyboardC: "F — fullscreen.",
    hideNow: "Hide now",
    fullscreenFailed: "Fullscreen failed. Tap the hidden area again.",
    settingsKicker: "insert settings",
    settingsTitle: "Pre-start settings",
    settingsDescription: "Settings are stored locally on this device and can be changed without a mouse.",
    done: "Done",
    tabs: { theme: "Theme", style: "Styles", speed: "Speed", visual: "Screen", reboot: "Reboot", controls: "Gestures / Keys" },
    languageTitle: "Language and start mode",
    languageDescription: "The site is English by default. Russian localization can be enabled here.",
    language: "Language",
    startMode: "Start mode",
    animation: "Animations",
    animationDescription: "Balanced is the default. Reduced is cleaner for older phones, Enhanced gives more motion for close-up shots.",
    deleteButton: "DELETE button",
    deleteButtonDescription: "The start button is always destructive red by default, regardless of theme. Its color can still be overridden for the shot.",
    deleteButtonColor: "Button color",
    themeMode: "Mode",
    themeDescription: "Light theme is the default. Switching mode pulls colors from the selected Android-style preset.",
    light: "Light",
    dark: "Dark",
    presets: "Android-style presets",
    presetsDescription: "These are fictional cinematic looks inspired by manufacturer UI styles, not exact brand copies.",
    elementStyle: "Element style",
    elementDescription: "Changes the character of the insert: radii, density, grid, glow, and screen feel.",
    speedTitle: "Process speed",
    speedDescription: "For filming, the rhythm matters more than realism. The current default is the fastest configured curve.",
    duration: "Duration",
    seconds: "sec",
    profile: "Progress profile",
    manualCurve: "Manual curve",
    curveTime: "25% / 60% / 90% of timeline",
    cp25: "At 25% time",
    cp60: "At 60% time",
    cp90: "At 90% time",
    fontsTitle: "Fonts and labels",
    font: "Interface font",
    date: "Date",
    deviceId: "Device ID",
    showTop: "Show top status row",
    showTopDescription: "Time, date and battery percentage at the top. Disabled by default for a clean insert.",
    battery: "Battery",
    storageTotal: "Total storage",
    storageDescription: "Total device storage shown under the progress bar. Replaces the fixed 128 GB value.",
    colorsTitle: "Element colors",
    activePreset: "Active preset",
    accent: "Accent",
    background: "Background",
    panels: "Panels",
    text: "Text",
    mutedText: "Secondary text",
    glow: "Glow",
    rebootTitle: "Black reboot screen",
    rebootDescription: "After 100%, the insert can hard-cut to a black screen with a fictional Droid system mark.",
    rebootEnable: "Enable hard cut",
    rebootEnableDescription: "No fade: wipe completes, then the screen turns black.",
    rebootDelay: "Delay after 100%",
    rebootLogo: "Logo text",
    secureReboot: "secure reboot",
    hintsTitle: "Entry hint",
    hintsDescription: "The hint appears on each visit or reload while this option is enabled.",
    showHints: "Show control hint",
    showHintsDescription: "Disable it for a clean insert before shooting.",
    controlSummary: "Touch-only: hidden top-right area enters fullscreen, double tap restarts, triple tap exits fullscreen. Keyboard: Space/Enter/Delete starts or restarts, R resets, F enters fullscreen.",
    resetLocal: "Reset local settings",
    completionTitle: "control wave complete",
    completionDescription: "Residual signatures suppressed · device ready for reset",
    rebooting: "rebooting",
  },
  ru: {
    settings: "Настройки",
    hint: "Подсказка",
    systemWipe: "SYSTEM WIPE",
    title: "Очистка данных",
    idleDetail: "Готово к удалению локальных данных. Нажмите УДАЛИТЬ для старта.",
    tapIdleDetail: "Готово к удалению локальных данных. Тапните по экрану для старта.",
    ready: "ГОТОВО К СТАРТУ",
    delete: "УДАЛИТЬ",
    tapToStart: "Тапните по экрану, чтобы начать очистку",
    wipedVolume: (erased: string, total: string) => `${erased} / ${total}`,
    footer: (id: string) => `Device ID: ${id} / Storage partition reset`,
    controlKicker: "gesture & keybind controls",
    controlTitle: "Управление вставкой",
    controlDescription: "Подсказка появляется при каждом входе или перезагрузке страницы. Её можно отключить в настройках перед стартом.",
    noMouse: "без мыши",
    noMouseA: "Скрытая зона справа сверху — fullscreen.",
    noMouseB: "Двойной тап по экрану — начать процесс заново.",
    noMouseC: "Тройной тап — выйти из fullscreen.",
    keyboard: "клавиатура",
    keyboardA: "Space / Enter / Delete — старт или рестарт.",
    keyboardB: "R — сброс на экран ожидания.",
    keyboardC: "F — fullscreen.",
    hideNow: "Скрыть сейчас",
    fullscreenFailed: "Fullscreen не сработал. Нажмите скрытую зону ещё раз.",
    settingsKicker: "insert settings",
    settingsTitle: "Настройки перед стартом",
    settingsDescription: "Настройки сохраняются на устройстве и применяются без мыши.",
    done: "Готово",
    tabs: { theme: "Темы", style: "Стили", speed: "Скорость", visual: "Экран", reboot: "Рестарт", controls: "Жесты / Keys" },
    languageTitle: "Язык и способ старта",
    languageDescription: "По умолчанию сайт на английском. Русскую локализацию можно включить здесь.",
    language: "Язык",
    startMode: "Способ запуска",
    animation: "Анимации",
    animationDescription: "По умолчанию — Сбалансировано. Пониженные чище для старых телефонов, Повышенные дают больше движения для крупного плана.",
    deleteButton: "Кнопка УДАЛИТЬ",
    deleteButtonDescription: "Кнопка старта по умолчанию всегда красная, независимо от темы. Цвет можно переопределить под кадр.",
    deleteButtonColor: "Цвет кнопки",
    themeMode: "Режим",
    themeDescription: "По умолчанию стоит светлая тема. Переключение подтягивает цвета выбранного Android-пресета.",
    light: "Светлая",
    dark: "Тёмная",
    presets: "Android-пресеты",
    presetsDescription: "Это не копии брендов, а киношные цветовые версии под их системный вайб.",
    elementStyle: "Стилизация элементов",
    elementDescription: "Меняет характер вставки: радиусы, плотность, сетку, свечение и ощущение интерфейса.",
    speedTitle: "Скорость процесса",
    speedDescription: "Для съёмки важнее управляемый ритм, а не реализм. Сейчас по умолчанию стоит самый быстрый график.",
    duration: "Длительность",
    seconds: "сек",
    profile: "Профиль графика",
    manualCurve: "Ручной график",
    curveTime: "25% / 60% / 90% времени",
    cp25: "На 25% времени",
    cp60: "На 60% времени",
    cp90: "На 90% времени",
    fontsTitle: "Шрифты и подписи",
    font: "Шрифт интерфейса",
    date: "Дата",
    deviceId: "ID устройства",
    showTop: "Показывать верхнюю строку",
    showTopDescription: "Время, дату и процент батареи сверху. По умолчанию отключено для чистой вставки.",
    battery: "Заряд батареи",
    storageTotal: "Общий объём",
    storageDescription: "Общий объём памяти устройства под прогресс-баром. Заменяет фиксированные 128 GB.",
    colorsTitle: "Цвета элементов",
    activePreset: "Активный пресет",
    accent: "Акцент",
    background: "Фон",
    panels: "Панели",
    text: "Текст",
    mutedText: "Вторичный текст",
    glow: "Свечение",
    rebootTitle: "Чёрный экран перезагрузки",
    rebootDescription: "После 100% можно резко уйти в чёрный экран с вымышленным системным логотипом Droid.",
    rebootEnable: "Включить резкий переход",
    rebootEnableDescription: "Без плавной анимации: очистка закончилась — экран сразу стал чёрным.",
    rebootDelay: "Задержка после 100%",
    rebootLogo: "Текст логотипа",
    secureReboot: "secure reboot",
    hintsTitle: "Подсказка при загрузке",
    hintsDescription: "Подсказка появляется при каждом входе или перезагрузке, пока этот переключатель включен.",
    showHints: "Показывать подсказку",
    showHintsDescription: "Можно отключить для чистой вставки перед стартом.",
    controlSummary: "Без мыши: скрытая зона справа сверху включает fullscreen, двойной тап запускает заново, тройной тап выходит из fullscreen. Клавиатура: Space/Enter/Delete — старт или рестарт, R — сброс, F — fullscreen.",
    resetLocal: "Сбросить локальные настройки",
    completionTitle: "контрольная волна завершена",
    completionDescription: "Остаточные сигнатуры погашены · устройство готово к сбросу",
    rebooting: "rebooting",
  },
} as const;

const localizedProgressProfiles = {
  en: progressProfiles,
  ru: {
    linear: "Линейно",
    slowStart: "Медленный старт",
    fastStart: "Быстрый старт",
    holdMiddle: "Пауза в середине",
    custom: "Ручной график",
  } satisfies Record<ProgressProfile, string>,
} as const;

const localizedStartModes = {
  en: startModes,
  ru: {
    button: "Старт по кнопке УДАЛИТЬ",
    tap: "Старт по тапу по экрану",
  } satisfies Record<StartMode, string>,
} as const;

const localizedAnimationPresets = {
  en: animationPresets,
  ru: {
    reduced: "Пониженные",
    balanced: "Сбалансировано",
    enhanced: "Повышенные",
  } satisfies Record<AnimationPreset, string>,
} as const;

const animationTuning: Record<AnimationPreset, { duration: number; slow: number; sparkle: number; wave: number; easing: string }> = {
  reduced: { duration: 180, slow: 360, sparkle: 2.7, wave: 4.6, easing: "cubic-bezier(0.2, 0, 0.2, 1)" },
  balanced: { duration: 340, slow: 720, sparkle: 1.75, wave: 3.4, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  enhanced: { duration: 560, slow: 1100, sparkle: 1.05, wave: 2.8, easing: "cubic-bezier(0.19, 1, 0.22, 1)" },
};

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
  return luminance > 0.58 ? "#190207" : "#ffffff";
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
  const completionWaves = React.useMemo(() => Array.from({ length: 6 }, (_, index) => index), []);

  const ui = copy[settings.locale];
  const stageList = stages[settings.locale];
  const groupList = dataGroups[settings.locale];
  const currentProgressProfiles = localizedProgressProfiles[settings.locale];
  const currentStartModes = localizedStartModes[settings.locale];
  const currentAnimationPresets = localizedAnimationPresets[settings.locale];

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
    document.documentElement.lang = settings.locale;

    const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = settings.backgroundColor;
  }, [settings.themeMode, settings.backgroundColor, settings.locale]);

  React.useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  const activeStage = React.useMemo(() => {
    return [...stageList].reverse().find((stage) => progress >= stage.threshold) ?? stageList[0];
  }, [progress, stageList]);

  const wipedSize = React.useMemo(() => {
    const totalGb = settings.storageTotalGb;
    const erasedGb = (totalGb * progress) / 100;
    return ui.wipedVolume(`${erasedGb.toFixed(1)} GB`, `${totalGb} GB`);
  }, [progress, settings.storageTotalGb, ui]);

  const currentTime = React.useMemo(() => formatTime(elapsed), [elapsed]);

  const runtimeStyle = React.useMemo(() => {
    const tone = toneFromPreset(settings.presetId, settings.themeMode);
    const primaryForeground = readableOn(settings.primaryColor);
    const deleteForeground = readableOn(settings.deleteButtonColor);
    const gridColor = rgba(tone.grid, settings.themeMode === "light" ? 0.18 : 0.12);
    const primarySoft = rgba(settings.primaryColor, settings.themeMode === "light" ? 0.16 : 0.2);
    const glowAlpha = clamp(settings.glowStrength / 160, 0, 0.75);
    const animation = animationTuning[settings.animationPreset];

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
      "--delete-button-color": settings.deleteButtonColor,
      "--delete-button-fg": deleteForeground,
      "--motion-duration": `${animation.duration}ms`,
      "--motion-slow": `${animation.slow}ms`,
      "--motion-sparkle": `${animation.sparkle}s`,
      "--motion-wave": `${animation.wave}s`,
      "--motion-easing": animation.easing,
      "--font-live": fontOptions[settings.fontId].stack,
      fontFamily: fontOptions[settings.fontId].stack,
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
      if (key === " " || key === "enter" || key === "delete") {
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
      if (settingsOpen || hintOpen) return;

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

        if (count === 2) {
          if (started || settings.startMode === "tap") startFromBeginning();
          return;
        }

        if (count === 1 && !started && settings.startMode === "tap") startFromBeginning();
      }, 360);
    },
    [exitFullscreenOnly, hintOpen, settings.startMode, settingsOpen, startFromBeginning, started],
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
  const showLiveElements = started;

  return (
    <main
      ref={rootRef}
      style={runtimeStyle}
      className={cn(
        "relative h-[100dvh] w-screen overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground",
        `insert-style-${settings.elementStyle}`,
        `motion-preset-${settings.animationPreset}`,
      )}
      onPointerUp={handleSurfacePointerUp}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,var(--insert-primary-soft),transparent_40%),linear-gradient(180deg,var(--insert-bg)_0%,var(--insert-surface-alt)_120%)] transition-opacity duration-[var(--motion-slow)]" />
      <div className="wipe-grid absolute inset-0 opacity-60" />
      <div className="scanline absolute inset-x-0 top-0 h-24 opacity-70" />

      <button
        type="button"
        data-control
        aria-label="Enter fullscreen"
        onPointerUp={(event) => event.stopPropagation()}
        onClick={() => void requestFullscreenOnly()}
        className="absolute right-1 top-1 z-50 h-12 w-12 rounded-full border border-primary/10 bg-primary/5 opacity-[0.035] transition-opacity active:opacity-40 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      {!started && (
        <div className="absolute left-2 top-2 z-40 flex gap-2" data-control onPointerUp={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" className="rounded-full bg-background/45 px-3 text-xs backdrop-blur" onClick={() => setSettingsOpen(true)}>
            {ui.settings}
          </Button>
          {!settings.showHints && (
            <Button size="sm" variant="ghost" className="rounded-full bg-background/45 px-3 text-xs backdrop-blur" onClick={() => setHintOpen(true)}>
              {ui.hint}
            </Button>
          )}
        </div>
      )}

      <section className="relative z-10 mx-auto flex h-full w-full max-w-[460px] flex-col px-5 py-4 sm:px-7 sm:py-6">
        {settings.showTopStatus && (
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
        )}

        <div className="flex flex-1 flex-col justify-center gap-8">
          <div className="space-y-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-primary/80">{ui.systemWipe}</p>
            <h1 className="text-balance text-[34px] font-semibold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-[42px]">
              {ui.title}
            </h1>
            <p className="mx-auto max-w-[310px] text-sm leading-6 text-muted-foreground">
              {started ? activeStage.detail : settings.startMode === "tap" ? ui.tapIdleDetail : ui.idleDetail}
            </p>
          </div>

          <Card className="glass-panel mx-auto grid h-[228px] w-[228px] place-items-center rounded-full p-0 transition-all duration-[var(--motion-slow)]">
            <CardContent className="relative grid h-full w-full place-items-center p-0">
              <div className={cn("wipe-ring absolute inset-3 rounded-full", !started && "opacity-35")} />
              <div className="absolute inset-8 rounded-full border border-border bg-card/90 shadow-[inset_0_0_40px_rgba(0,0,0,0.22)] transition-all duration-[var(--motion-duration)]" />
              <div className="relative z-10 text-center">
                <div className="text-[58px] font-light tabular-nums tracking-[-0.08em] text-foreground">
                  {Math.floor(progress)}
                  <span className="text-2xl text-primary/80">%</span>
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-primary/75">
                  {started ? activeStage.label : ui.ready}
                </div>
              </div>
            </CardContent>
          </Card>

          {!started && (
            <div className="start-control-slot mx-auto w-full max-w-[320px]" data-control onPointerUp={(event) => event.stopPropagation()}>
              {settings.startMode === "button" ? (
                <button
                  type="button"
                  className="delete-start-button w-full"
                  onClick={startFromBeginning}
                  aria-label={ui.delete}
                >
                  <span>{ui.delete}</span>
                </button>
              ) : (
                <div className="tap-start-panel rounded-[28px] border border-border bg-card/70 px-5 py-4 text-center text-sm font-medium text-muted-foreground">
                  {ui.tapToStart}
                </div>
              )}
              {fullscreenFailed && <p className="mt-3 text-center text-xs text-[color:var(--insert-warning)]">{ui.fullscreenFailed}</p>}
            </div>
          )}

          {showLiveElements && (
            <div className="wipe-live-elements space-y-4">
              <Progress value={progress} className="h-2 bg-muted" />
              <div className="flex items-center justify-start text-xs text-muted-foreground">
                <span className="font-mono uppercase tracking-[0.18em]">{wipedSize}</span>
              </div>
            </div>
          )}

          {showLiveElements && (
            <div className="wipe-live-elements grid grid-cols-2 gap-2">
              {groupList.map((group) => {
                const done = progress >= group.threshold;
                return (
                  <div
                    key={group.name}
                    data-wipe-check-row
                    data-done={done ? "true" : "false"}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-3 py-2 text-[12px] transition-all duration-[var(--motion-duration)]",
                      done ? "border-primary/55 bg-primary/20 text-foreground" : "border-border/90 bg-card/85 text-muted-foreground/95",
                    )}
                  >
                    <span>{group.name}</span>
                    <span className="font-mono text-[11px]">{done ? "OK" : "··"}</span>
                  </div>
                );
              })}
            </div>
          )}

          {showLiveElements && (
            <div className="wipe-live-elements grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1 opacity-100" aria-hidden="true">
              {blocks.map((block) => {
                const lit = progress > (block / blocks.length) * 100;
                return (
                  <span
                    key={block}
                    className={cn("h-1.5 rounded-full transition-colors duration-[var(--motion-duration)]", lit ? "bg-primary shadow-[0_0_10px_var(--insert-glow-color)]" : "bg-muted")}
                  />
                );
              })}
            </div>
          )}
        </div>

        <footer className="pb-1 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {ui.footer(settings.deviceId)}
        </footer>
      </section>

      {!started && hintOpen && settings.showHints && !settingsOpen && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-background/82 px-6 text-center backdrop-blur-md">
          <div data-control onPointerUp={(event) => event.stopPropagation()} className="glass-panel max-w-[420px] rounded-[32px] px-6 py-6">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.35em] text-primary/75">{ui.controlKicker}</span>
            <span className="mt-3 block text-2xl font-semibold tracking-[-0.04em] text-foreground">{ui.controlTitle}</span>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{ui.controlDescription}</p>
            <div className="mt-5 grid gap-3 text-left text-sm leading-6 text-muted-foreground sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background/55 p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">{ui.noMouse}</p>
                <p>{ui.noMouseA}</p>
                <p>{ui.noMouseB}</p>
                <p>{ui.noMouseC}</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/55 p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">{ui.keyboard}</p>
                <p>{ui.keyboardA}</p>
                <p>{ui.keyboardB}</p>
                <p>{ui.keyboardC}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="secondary" className="rounded-full" onClick={() => setHintOpen(false)}>
                {ui.hideNow}
              </Button>
              <Button className="rounded-full" onClick={() => setSettingsOpen(true)}>
                {ui.settings}
              </Button>
            </div>
            {fullscreenFailed && <p className="mt-3 text-xs text-[color:var(--insert-warning)]">{ui.fullscreenFailed}</p>}
          </div>
        </div>
      )}

      {!started && settingsOpen && (
        <div className="absolute inset-0 z-40 bg-background/95 px-3 py-4 backdrop-blur-xl" data-control onPointerUp={(event) => event.stopPropagation()}>
          <div className="mx-auto flex h-full max-w-[560px] flex-col overflow-hidden rounded-[32px] border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/70">{ui.settingsKicker}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">{ui.settingsTitle}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{ui.settingsDescription}</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setSettingsOpen(false)}>
                {ui.done}
              </Button>
            </div>

            <Tabs defaultValue="theme" className="min-h-0 flex-1 gap-0">
              <div className="overflow-x-auto border-b border-border px-4 py-3">
                <TabsList className="w-max bg-muted">
                  <TabsTrigger value="theme">{ui.tabs.theme}</TabsTrigger>
                  <TabsTrigger value="style">{ui.tabs.style}</TabsTrigger>
                  <TabsTrigger value="speed">{ui.tabs.speed}</TabsTrigger>
                  <TabsTrigger value="visual">{ui.tabs.visual}</TabsTrigger>
                  <TabsTrigger value="reboot">{ui.tabs.reboot}</TabsTrigger>
                  <TabsTrigger value="hints">{ui.tabs.controls}</TabsTrigger>
                </TabsList>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <TabsContent value="theme" className="space-y-4">
                  <SettingBlock title={ui.languageTitle} description={ui.languageDescription}>
                    <FieldRow label={ui.language}>
                      <Select value={settings.locale} onValueChange={(value) => updateSetting("locale", value as LocaleId)}>
                        <SelectTrigger className="w-full rounded-2xl bg-background/60"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(localeOptions) as LocaleId[]).map((id) => <SelectItem key={id} value={id}>{localeOptions[id]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldRow>
                    <FieldRow label={ui.startMode}>
                      <Select value={settings.startMode} onValueChange={(value) => updateSetting("startMode", value as StartMode)}>
                        <SelectTrigger className="w-full rounded-2xl bg-background/60"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(currentStartModes) as StartMode[]).map((id) => <SelectItem key={id} value={id}>{currentStartModes[id]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldRow>
                  </SettingBlock>

                  <SettingBlock title={ui.animation} description={ui.animationDescription}>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(currentAnimationPresets) as AnimationPreset[]).map((id) => (
                        <Button key={id} variant={settings.animationPreset === id ? "default" : "secondary"} className="rounded-2xl px-2 text-xs" onClick={() => updateSetting("animationPreset", id)}>
                          {currentAnimationPresets[id]}
                        </Button>
                      ))}
                    </div>
                  </SettingBlock>

                  <SettingBlock title={ui.deleteButton} description={ui.deleteButtonDescription}>
                    <ColorField label={ui.deleteButtonColor} value={settings.deleteButtonColor} onChange={(value) => updateSetting("deleteButtonColor", value)} />
                    <div className="rounded-[28px] border border-border bg-background/50 p-4">
                      <button type="button" className="delete-start-button w-full" onClick={(event) => event.preventDefault()} aria-hidden="true">
                        <span>{ui.delete}</span>
                      </button>
                    </div>
                  </SettingBlock>

                  <SettingBlock title={ui.themeMode} description={ui.themeDescription}>
                    <div className="grid grid-cols-2 gap-2">
                      {(["light", "dark"] as ThemeMode[]).map((mode) => (
                        <Button key={mode} variant={settings.themeMode === mode ? "default" : "secondary"} className="rounded-2xl" onClick={() => applyThemeMode(mode)}>
                          {mode === "light" ? ui.light : ui.dark}
                        </Button>
                      ))}
                    </div>
                  </SettingBlock>

                  <SettingBlock title={ui.presets} description={ui.presetsDescription}>
                    <div className="grid gap-2">
                      {(Object.keys(presets) as PresetId[]).map((id) => {
                        const preset = presets[id];
                        const tone = preset[settings.themeMode];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => applyPreset(id)}
                            className={cn("flex items-center gap-3 rounded-2xl border p-3 text-left transition", settings.presetId === id ? "border-primary bg-primary/10" : "border-border bg-card/55")}
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
                  <SettingBlock title={ui.elementStyle} description={ui.elementDescription}>
                    <div className="grid gap-2">
                      {(Object.keys(elementStyles) as ElementStyle[]).map((id) => {
                        const style = elementStyles[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => updateSetting("elementStyle", id)}
                            className={cn("rounded-2xl border p-3 text-left transition", settings.elementStyle === id ? "border-primary bg-primary/10 shadow-[0_0_28px_var(--insert-glow-color)]" : "border-border bg-card/55")}
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
                  <SettingBlock title={ui.speedTitle} description={ui.speedDescription}>
                    <FieldRow label={ui.duration} value={`${settings.durationSeconds} ${ui.seconds}`}>
                      <Slider min={8} max={120} step={1} value={[settings.durationSeconds]} onValueChange={([value]) => updateSetting("durationSeconds", value)} />
                    </FieldRow>
                    <FieldRow label={ui.profile}>
                      <Select value={settings.progressProfile} onValueChange={(value) => updateSetting("progressProfile", value as ProgressProfile)}>
                        <SelectTrigger className="w-full rounded-2xl bg-background/60"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(currentProgressProfiles) as ProgressProfile[]).map((id) => <SelectItem key={id} value={id}>{currentProgressProfiles[id]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldRow>
                    <div className="rounded-2xl border border-border bg-background/50 p-3">
                      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{ui.manualCurve}</span><span>{ui.curveTime}</span>
                      </div>
                      <div className="space-y-4">
                        <FieldRow label={ui.cp25} value={`${settings.checkpoint25}%`}><Slider min={5} max={45} step={1} value={[settings.checkpoint25]} onValueChange={([value]) => updateSetting("checkpoint25", value)} /></FieldRow>
                        <FieldRow label={ui.cp60} value={`${settings.checkpoint60}%`}><Slider min={30} max={85} step={1} value={[settings.checkpoint60]} onValueChange={([value]) => updateSetting("checkpoint60", value)} /></FieldRow>
                        <FieldRow label={ui.cp90} value={`${settings.checkpoint90}%`}><Slider min={65} max={98} step={1} value={[settings.checkpoint90]} onValueChange={([value]) => updateSetting("checkpoint90", value)} /></FieldRow>
                      </div>
                    </div>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="visual" className="space-y-4">
                  <SettingBlock title={ui.fontsTitle}>
                    <FieldRow label={ui.font}>
                      <Select value={settings.fontId} onValueChange={(value) => updateSetting("fontId", value as FontId)}>
                        <SelectTrigger className="w-full rounded-2xl bg-background/60"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(fontOptions) as FontId[]).map((id) => <SelectItem key={id} value={id}>{fontOptions[id].label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldRow>
                    <div className="grid grid-cols-2 gap-2">
                      <FieldRow label={ui.date}><Input value={settings.dateLabel} onChange={(event) => updateSetting("dateLabel", event.target.value)} className="rounded-2xl bg-background/60" /></FieldRow>
                      <FieldRow label={ui.deviceId}><Input value={settings.deviceId} onChange={(event) => updateSetting("deviceId", event.target.value)} className="rounded-2xl bg-background/60" /></FieldRow>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-3 py-3">
                      <div><p className="text-sm font-medium">{ui.showTop}</p><p className="text-xs text-muted-foreground">{ui.showTopDescription}</p></div>
                      <Switch checked={settings.showTopStatus} onCheckedChange={(checked) => updateSetting("showTopStatus", Boolean(checked))} />
                    </div>
                    <FieldRow label={ui.battery} value={`${settings.batteryPercent}%`}><Slider min={1} max={100} step={1} value={[settings.batteryPercent]} onValueChange={([value]) => updateSetting("batteryPercent", value)} /></FieldRow>
                    <FieldRow label={ui.storageTotal} value={`${settings.storageTotalGb} GB`}>
                      <Slider min={8} max={4096} step={8} value={[settings.storageTotalGb]} onValueChange={([value]) => updateSetting("storageTotalGb", value)} />
                    </FieldRow>
                    <p className="rounded-2xl bg-muted p-3 text-xs leading-5 text-muted-foreground">{ui.storageDescription}</p>
                  </SettingBlock>

                  <SettingBlock title={ui.colorsTitle} description={`${ui.activePreset}: ${currentPreset.title}.`}>
                    <ColorField label={ui.accent} value={settings.primaryColor} onChange={(value) => updateSetting("primaryColor", value)} />
                    <ColorField label={ui.background} value={settings.backgroundColor} onChange={(value) => updateSetting("backgroundColor", value)} />
                    <ColorField label={ui.panels} value={settings.surfaceColor} onChange={(value) => updateSetting("surfaceColor", value)} />
                    <ColorField label={ui.text} value={settings.foregroundColor} onChange={(value) => updateSetting("foregroundColor", value)} />
                    <ColorField label={ui.mutedText} value={settings.mutedColor} onChange={(value) => updateSetting("mutedColor", value)} />
                    <FieldRow label={ui.glow} value={`${settings.glowStrength}%`}><Slider min={0} max={100} step={1} value={[settings.glowStrength]} onValueChange={([value]) => updateSetting("glowStrength", value)} /></FieldRow>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="reboot" className="space-y-4">
                  <SettingBlock title={ui.rebootTitle} description={ui.rebootDescription}>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-3 py-3">
                      <div><p className="text-sm font-medium">{ui.rebootEnable}</p><p className="text-xs text-muted-foreground">{ui.rebootEnableDescription}</p></div>
                      <Switch checked={settings.rebootEnabled} onCheckedChange={(checked) => updateSetting("rebootEnabled", Boolean(checked))} />
                    </div>
                    <FieldRow label={ui.rebootDelay} value={`${settings.rebootDelaySeconds.toFixed(1)} ${ui.seconds}`}><Slider min={0} max={10} step={0.1} value={[settings.rebootDelaySeconds]} onValueChange={([value]) => updateSetting("rebootDelaySeconds", value)} /></FieldRow>
                    <FieldRow label={ui.rebootLogo}><Input value={settings.rebootLogoText} onChange={(event) => updateSetting("rebootLogoText", event.target.value)} className="rounded-2xl bg-background/60" /></FieldRow>
                    <div className="rounded-[28px] border border-border bg-black p-6 text-center text-white">
                      <img src="/droid-logo.svg" alt="Droid logo preview" className="mx-auto h-16 w-16 drop-shadow-[0_0_22px_rgba(125,211,252,0.85)]" />
                      <p className="droid-wordmark mt-3 text-3xl text-cyan-100">{settings.rebootLogoText || "Droid"}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-200/55">{ui.secureReboot}</p>
                    </div>
                  </SettingBlock>
                </TabsContent>

                <TabsContent value="hints" className="space-y-4">
                  <SettingBlock title={ui.hintsTitle} description={ui.hintsDescription}>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-3 py-3">
                      <div><p className="text-sm font-medium">{ui.showHints}</p><p className="text-xs text-muted-foreground">{ui.showHintsDescription}</p></div>
                      <Switch checked={settings.showHints} onCheckedChange={(checked) => updateSetting("showHints", Boolean(checked))} />
                    </div>
                    <div className="rounded-2xl bg-muted p-3 text-xs leading-5 text-muted-foreground">{ui.controlSummary}</div>
                    <Button variant="secondary" className="w-full rounded-full" onClick={resetLocalSettings}>{ui.resetLocal}</Button>
                  </SettingBlock>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}

      {isComplete && !rebootScreen && (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-55" aria-hidden="true">
          <div className="completion-wave-field">
            {completionWaves.map((wave) => (
              <span
                key={wave}
                className="completion-wave-ring"
                style={{ "--wave-delay": `${wave * 0.24}s`, "--wave-alpha": `${0.18 - wave * 0.018}` } as React.CSSProperties}
              />
            ))}
            <span className="completion-wave-axis completion-wave-axis-x" />
            <span className="completion-wave-axis completion-wave-axis-y" />
            <span className="completion-wave-core" />
          </div>
        </div>
      )}

      {isComplete && !rebootScreen && (
        <div className="completion-wave-card pointer-events-none absolute inset-x-5 bottom-16 z-30 mx-auto max-w-[420px] rounded-[28px] border border-primary/25 bg-primary/10 px-5 py-4 text-center text-foreground shadow-[0_20px_70px_var(--insert-glow-color)] backdrop-blur-xl">
          <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary/80">{ui.completionTitle}</div>
          <div className="mt-1 text-sm">{ui.completionDescription}</div>
        </div>
      )}

      {rebootScreen && (
        <div className="pointer-events-none absolute inset-0 z-[80] grid place-items-center bg-black text-white">
          <div className="text-center">
            <img src="/droid-logo.svg" alt="" aria-hidden="true" className="mx-auto h-24 w-24 drop-shadow-[0_0_34px_rgba(125,211,252,0.95)]" />
            <div className="droid-wordmark mt-5 text-[46px] text-cyan-100 drop-shadow-[0_0_24px_rgba(125,211,252,0.8)]">
              {settings.rebootLogoText || "Droid"}
            </div>
            <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.42em] text-cyan-200/50">{ui.rebooting}</div>
          </div>
        </div>
      )}
    </main>
  );
}
