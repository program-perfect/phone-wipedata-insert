export const SETTINGS_STORAGE_KEY = "phone-wipe-insert-settings-v6-start-controls";

export type LocaleId = "en" | "ru";
export type ThemeMode = "light" | "dark";
export type PresetId = "pixel" | "samsung" | "xiaomi" | "huawei" | "oppo" | "nothing" | "motorola";
export type FontId = "system" | "roboto" | "inter" | "mono" | "condensed";
export type ProgressProfile = "linear" | "slowStart" | "fastStart" | "holdMiddle" | "custom";
export type ElementStyle = "material" | "minimal" | "glass" | "cyberpunk" | "terminal" | "noir" | "brutalist";
export type StartMode = "button" | "tap";
export type AnimationPreset = "reduced" | "balanced" | "enhanced";

export type InsertTone = {
  name: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  foreground: string;
  muted: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  grid: string;
  glow: string;
};

export type InsertPreset = {
  id: PresetId;
  title: string;
  system: string;
  description: string;
  light: InsertTone;
  dark: InsertTone;
};

export type InsertSettings = {
  locale: LocaleId;
  showHints: boolean;
  showTopStatus: boolean;
  elementStyle: ElementStyle;
  startMode: StartMode;
  animationPreset: AnimationPreset;
  themeMode: ThemeMode;
  presetId: PresetId;
  progressProfile: ProgressProfile;
  durationSeconds: number;
  checkpoint25: number;
  checkpoint60: number;
  checkpoint90: number;
  fontId: FontId;
  primaryColor: string;
  deleteButtonColor: string;
  backgroundColor: string;
  surfaceColor: string;
  foregroundColor: string;
  mutedColor: string;
  glowStrength: number;
  batteryPercent: number;
  storageTotalGb: number;
  dateLabel: string;
  deviceId: string;
  rebootEnabled: boolean;
  rebootDelaySeconds: number;
  rebootLogoText: string;
};

export const fontOptions: Record<FontId, { label: string; stack: string }> = {
  system: {
    label: "Android System",
    stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  roboto: {
    label: "Roboto / Pixel",
    stack: "var(--font-roboto), Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  inter: {
    label: "Inter",
    stack: "var(--font-sans), Inter, system-ui, sans-serif",
  },
  mono: {
    label: "Mono HUD",
    stack: "var(--font-mono), 'JetBrains Mono', 'Roboto Mono', monospace",
  },
  condensed: {
    label: "Condensed UI",
    stack: "'Roboto Condensed', 'Arial Narrow', Roboto, system-ui, sans-serif",
  },
};

export const progressProfiles: Record<ProgressProfile, string> = {
  linear: "Linear",
  slowStart: "Slow start",
  fastStart: "Fast start",
  holdMiddle: "Mid hold",
  custom: "Custom curve",
};

export const localeOptions: Record<LocaleId, string> = {
  en: "English",
  ru: "Русский",
};

export const startModes: Record<StartMode, string> = {
  button: "Start by DELETE button",
  tap: "Start by screen tap",
};

export const animationPresets: Record<AnimationPreset, string> = {
  reduced: "Reduced",
  balanced: "Balanced",
  enhanced: "Enhanced",
};

export const elementStyles: Record<ElementStyle, { label: string; description: string }> = {
  material: {
    label: "Material Clean",
    description: "Clean system cards, soft radii, the safest option for camera use.",
  },
  minimal: {
    label: "Minimalism",
    description: "Flat interface with almost no glow and maximum readability on phone cameras.",
  },
  glass: {
    label: "Glass",
    description: "Translucent panels, blur, and soft technical glow.",
  },
  cyberpunk: {
    label: "Cyberpunk",
    description: "Hard outlines, grid, strong glow, and a more aggressive insert look.",
  },
  terminal: {
    label: "Terminal",
    description: "Monospace HUD, service-screen style rows, less gloss.",
  },
  noir: {
    label: "Оперативный noir",
    description: "Restrained operational look: almost a document, almost a system log.",
  },
  brutalist: {
    label: "Brutalism",
    description: "Large blocks, sharp frames, and rough engineering graphics.",
  },
};

export const presets: Record<PresetId, InsertPreset> = {
  pixel: {
    id: "pixel",
    title: "Pixel Material You",
    system: "Google Android / Pixel UI",
    description: "Чистая светлая системная тема, холодный синий акцент.",
    light: {
      name: "Pixel Light",
      background: "#f6f9ff",
      surface: "#ffffff",
      surfaceAlt: "#e7eefc",
      foreground: "#121820",
      muted: "#607089",
      primary: "#2563eb",
      secondary: "#0ea5e9",
      success: "#16a34a",
      warning: "#d97706",
      grid: "#93c5fd",
      glow: "#60a5fa",
    },
    dark: {
      name: "Pixel Dark",
      background: "#08111f",
      surface: "#101b2c",
      surfaceAlt: "#18283d",
      foreground: "#eaf2ff",
      muted: "#9db1cc",
      primary: "#8ab4f8",
      secondary: "#67e8f9",
      success: "#22c55e",
      warning: "#fbbf24",
      grid: "#60a5fa",
      glow: "#67e8f9",
    },
  },
  samsung: {
    id: "samsung",
    title: "Samsung One UI",
    system: "Samsung / One UI",
    description: "Мягкие синие панели, крупные скругления, спокойный контраст.",
    light: {
      name: "One UI Light",
      background: "#f7f8fb",
      surface: "#ffffff",
      surfaceAlt: "#eef2ff",
      foreground: "#171b25",
      muted: "#6b7280",
      primary: "#2f6bff",
      secondary: "#7c3aed",
      success: "#16a34a",
      warning: "#eab308",
      grid: "#a5b4fc",
      glow: "#3b82f6",
    },
    dark: {
      name: "One UI Dark",
      background: "#05070d",
      surface: "#111827",
      surfaceAlt: "#1f2937",
      foreground: "#f5f7fb",
      muted: "#a1a1aa",
      primary: "#6691ff",
      secondary: "#c084fc",
      success: "#34d399",
      warning: "#fde047",
      grid: "#818cf8",
      glow: "#6366f1",
    },
  },
  xiaomi: {
    id: "xiaomi",
    title: "Xiaomi HyperOS",
    system: "Xiaomi / HyperOS",
    description: "Глянцевый cyan-blue интерфейс с ярким технологичным свечением.",
    light: {
      name: "HyperOS Light",
      background: "#f2fbff",
      surface: "#ffffff",
      surfaceAlt: "#dff7ff",
      foreground: "#061923",
      muted: "#5d7584",
      primary: "#00a6ff",
      secondary: "#22d3ee",
      success: "#10b981",
      warning: "#f59e0b",
      grid: "#67e8f9",
      glow: "#06b6d4",
    },
    dark: {
      name: "HyperOS Dark",
      background: "#020617",
      surface: "#071525",
      surfaceAlt: "#0b2436",
      foreground: "#e0f7ff",
      muted: "#89a7b7",
      primary: "#22d3ee",
      secondary: "#38bdf8",
      success: "#34d399",
      warning: "#f59e0b",
      grid: "#22d3ee",
      glow: "#06b6d4",
    },
  },
  huawei: {
    id: "huawei",
    title: "Huawei HarmonyOS",
    system: "Huawei / HarmonyOS",
    description: "Белая системная подложка и красно-коралловый акцент.",
    light: {
      name: "Harmony Light",
      background: "#fff8f8",
      surface: "#ffffff",
      surfaceAlt: "#ffe7e7",
      foreground: "#201314",
      muted: "#805e61",
      primary: "#dc2626",
      secondary: "#fb7185",
      success: "#16a34a",
      warning: "#f97316",
      grid: "#fca5a5",
      glow: "#ef4444",
    },
    dark: {
      name: "Harmony Dark",
      background: "#150708",
      surface: "#261012",
      surfaceAlt: "#3a161a",
      foreground: "#fff1f2",
      muted: "#e5a1a7",
      primary: "#fb7185",
      secondary: "#f43f5e",
      success: "#4ade80",
      warning: "#fdba74",
      grid: "#fb7185",
      glow: "#f43f5e",
    },
  },
  oppo: {
    id: "oppo",
    title: "OPPO ColorOS",
    system: "OPPO / ColorOS",
    description: "Зеленовато-синий clean look, близкий к ColorOS.",
    light: {
      name: "ColorOS Light",
      background: "#f4fffb",
      surface: "#ffffff",
      surfaceAlt: "#dff8ef",
      foreground: "#0b1f1a",
      muted: "#5b756b",
      primary: "#00a86b",
      secondary: "#14b8a6",
      success: "#22c55e",
      warning: "#eab308",
      grid: "#5eead4",
      glow: "#10b981",
    },
    dark: {
      name: "ColorOS Dark",
      background: "#031310",
      surface: "#0b211b",
      surfaceAlt: "#12352b",
      foreground: "#ecfff9",
      muted: "#93b8aa",
      primary: "#34d399",
      secondary: "#2dd4bf",
      success: "#4ade80",
      warning: "#fde047",
      grid: "#2dd4bf",
      glow: "#10b981",
    },
  },
  nothing: {
    id: "nothing",
    title: "Nothing OS",
    system: "Nothing / Glyph UI",
    description: "Почти монохромный интерфейс, точечная графика и красный акцент.",
    light: {
      name: "Nothing Light",
      background: "#f8f8f6",
      surface: "#ffffff",
      surfaceAlt: "#ededeb",
      foreground: "#0d0d0d",
      muted: "#6a6a6a",
      primary: "#e11d48",
      secondary: "#111111",
      success: "#16a34a",
      warning: "#ca8a04",
      grid: "#a3a3a3",
      glow: "#fb7185",
    },
    dark: {
      name: "Nothing Dark",
      background: "#050505",
      surface: "#101010",
      surfaceAlt: "#1d1d1d",
      foreground: "#f8f8f8",
      muted: "#a3a3a3",
      primary: "#fb375a",
      secondary: "#ffffff",
      success: "#22c55e",
      warning: "#facc15",
      grid: "#737373",
      glow: "#fb375a",
    },
  },
  motorola: {
    id: "motorola",
    title: "Motorola My UX",
    system: "Motorola / My UX",
    description: "Спокойная Android-тема с фиолетово-синим акцентом.",
    light: {
      name: "My UX Light",
      background: "#f7f5ff",
      surface: "#ffffff",
      surfaceAlt: "#ede9fe",
      foreground: "#171126",
      muted: "#6d6282",
      primary: "#7c3aed",
      secondary: "#2563eb",
      success: "#16a34a",
      warning: "#d97706",
      grid: "#c4b5fd",
      glow: "#8b5cf6",
    },
    dark: {
      name: "My UX Dark",
      background: "#0b0717",
      surface: "#171025",
      surfaceAlt: "#24183b",
      foreground: "#f5f0ff",
      muted: "#b8a7d8",
      primary: "#a78bfa",
      secondary: "#60a5fa",
      success: "#34d399",
      warning: "#fbbf24",
      grid: "#a78bfa",
      glow: "#8b5cf6",
    },
  },
};

export const DEFAULT_SETTINGS: InsertSettings = {
  locale: "en",
  showHints: true,
  showTopStatus: false,
  elementStyle: "material",
  startMode: "button",
  animationPreset: "balanced",
  themeMode: "light",
  presetId: "pixel",
  progressProfile: "custom",
  durationSeconds: 8,
  checkpoint25: 45,
  checkpoint60: 85,
  checkpoint90: 98,
  fontId: "roboto",
  primaryColor: presets.pixel.light.primary,
  deleteButtonColor: "#ff1028",
  backgroundColor: presets.pixel.light.background,
  surfaceColor: presets.pixel.light.surface,
  foregroundColor: presets.pixel.light.foreground,
  mutedColor: presets.pixel.light.muted,
  glowStrength: 55,
  batteryPercent: 87,
  storageTotalGb: 128,
  dateLabel: "26.06.2026",
  deviceId: "NK-2606",
  rebootEnabled: false,
  rebootDelaySeconds: 1.0,
  rebootLogoText: "Droid",
};

export function toneFromPreset(presetId: PresetId, themeMode: ThemeMode) {
  return presets[presetId][themeMode];
}

export function settingsWithPreset(settings: InsertSettings, presetId: PresetId, themeMode = settings.themeMode): InsertSettings {
  const tone = toneFromPreset(presetId, themeMode);
  return {
    ...settings,
    presetId,
    themeMode,
    primaryColor: tone.primary,
    backgroundColor: tone.background,
    surfaceColor: tone.surface,
    foregroundColor: tone.foreground,
    mutedColor: tone.muted,
  };
}

export function sanitizeSettings(value: Partial<InsertSettings> | null | undefined): InsertSettings {
  const merged = { ...DEFAULT_SETTINGS, ...(value ?? {}) };
  const presetId = presets[merged.presetId as PresetId] ? (merged.presetId as PresetId) : DEFAULT_SETTINGS.presetId;
  const locale = merged.locale === "ru" ? "ru" : "en";
  const themeMode = merged.themeMode === "dark" ? "dark" : "light";
  const fontId = fontOptions[merged.fontId as FontId] ? (merged.fontId as FontId) : DEFAULT_SETTINGS.fontId;
  const progressProfile = progressProfiles[merged.progressProfile as ProgressProfile]
    ? (merged.progressProfile as ProgressProfile)
    : DEFAULT_SETTINGS.progressProfile;
  const elementStyle = elementStyles[merged.elementStyle as ElementStyle]
    ? (merged.elementStyle as ElementStyle)
    : DEFAULT_SETTINGS.elementStyle;
  const startMode = merged.startMode === "tap" ? "tap" : "button";
  const animationPreset = merged.animationPreset === "reduced" || merged.animationPreset === "enhanced" ? merged.animationPreset : "balanced";

  return {
    ...merged,
    locale,
    presetId,
    themeMode,
    fontId,
    progressProfile,
    elementStyle,
    startMode,
    animationPreset,
    showHints: Boolean(merged.showHints),
    showTopStatus: Boolean(merged.showTopStatus),
    durationSeconds: clampNumber(Number(merged.durationSeconds), 8, 120),
    checkpoint25: clampNumber(Number(merged.checkpoint25), 5, 45),
    checkpoint60: clampNumber(Number(merged.checkpoint60), 30, 85),
    checkpoint90: clampNumber(Number(merged.checkpoint90), 65, 98),
    deleteButtonColor: normalizeHexColor(merged.deleteButtonColor, DEFAULT_SETTINGS.deleteButtonColor),
    glowStrength: clampNumber(Number(merged.glowStrength), 0, 100),
    batteryPercent: clampNumber(Number(merged.batteryPercent), 1, 100),
    storageTotalGb: Math.round(clampNumber(Number(merged.storageTotalGb), 8, 4096)),
    dateLabel: String(merged.dateLabel || DEFAULT_SETTINGS.dateLabel),
    deviceId: String(merged.deviceId || DEFAULT_SETTINGS.deviceId),
    rebootEnabled: Boolean(merged.rebootEnabled),
    rebootDelaySeconds: clampNumber(Number(merged.rebootDelaySeconds), 0, 10),
    rebootLogoText: String(merged.rebootLogoText || DEFAULT_SETTINGS.rebootLogoText),
  };
}

export function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function progressForProfile(runtimeRatio: number, settings: InsertSettings) {
  const t = clampNumber(runtimeRatio, 0, 1);

  if (settings.progressProfile === "linear") return t * 100;
  if (settings.progressProfile === "slowStart") return Math.pow(t, 1.85) * 100;
  if (settings.progressProfile === "fastStart") return (1 - Math.pow(1 - t, 1.85)) * 100;
  if (settings.progressProfile === "holdMiddle") {
    if (t < 0.32) return interpolate(t, 0, 0.32, 0, 48);
    if (t < 0.56) return interpolate(t, 0.32, 0.56, 48, 55);
    return interpolate(t, 0.56, 1, 55, 100);
  }

  const p25 = clampNumber(settings.checkpoint25, 5, 45);
  const p60 = clampNumber(settings.checkpoint60, p25 + 5, 85);
  const p90 = clampNumber(settings.checkpoint90, p60 + 5, 98);

  if (t < 0.25) return interpolate(t, 0, 0.25, 0, p25);
  if (t < 0.6) return interpolate(t, 0.25, 0.6, p25, p60);
  if (t < 0.9) return interpolate(t, 0.6, 0.9, p60, p90);
  return interpolate(t, 0.9, 1, p90, 100);
}

function interpolate(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number) {
  const ratio = (value - inputMin) / (inputMax - inputMin);
  return outputMin + (outputMax - outputMin) * clampNumber(ratio, 0, 1);
}

export function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();
  const normalized = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  const value = Number.parseInt(normalized, 16);
  if (!Number.isFinite(value)) return { r: 0, g: 0, b: 0 };
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function normalizeHexColor(value: unknown, fallback: string) {
  const text = String(value ?? "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return text;
  if (/^#[0-9a-fA-F]{3}$/.test(text)) {
    return `#${text.slice(1).split("").map((char) => char + char).join("")}`;
  }
  return fallback;
}
