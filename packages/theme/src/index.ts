export const themeTokens = {
  colors: {
    bgApp: "var(--ti-bg-app)",
    bgSurface: "var(--ti-bg-surface)",
    bgSurfaceHover: "var(--ti-bg-surface-hover)",
    bgCard: "var(--ti-bg-card)",
    bgCardHover: "var(--ti-bg-card-hover)",
    bgMuted: "var(--ti-bg-muted)",
    borderSubtle: "var(--ti-border-subtle)",
    borderMedium: "var(--ti-border-medium)",
    borderStrong: "var(--ti-border-strong)",
    textPrimary: "var(--ti-text-primary)",
    textSecondary: "var(--ti-text-secondary)",
    textMuted: "var(--ti-text-muted)",
    primary: "var(--ti-color-primary)",
    primaryHover: "var(--ti-color-primary-hover)",
    success: "var(--ti-color-success)",
    warning: "var(--ti-color-warning)",
    danger: "var(--ti-color-danger)",
    premium: "var(--ti-color-premium)",
  },
  radii: {
    sm: "var(--ti-radius-sm)",
    md: "var(--ti-radius-md)",
    lg: "var(--ti-radius-lg)",
    xl: "var(--ti-radius-xl)",
    pill: "var(--ti-radius-pill)",
  },
  shadows: {
    sm: "var(--ti-shadow-sm)",
    md: "var(--ti-shadow-md)",
    lg: "var(--ti-shadow-lg)",
    glow: "var(--ti-shadow-glow)",
  },
} as const;

export type ThemeTokens = typeof themeTokens;
