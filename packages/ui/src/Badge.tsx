import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "premium";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
}) => {
  const styles: Record<string, React.CSSProperties> = {
    success: {
      background: "var(--ti-color-success-light, rgba(16, 185, 129, 0.15))",
      color: "var(--ti-color-success, #10b981)",
      border: "1px solid rgba(16, 185, 129, 0.3)",
    },
    warning: {
      background: "var(--ti-color-warning-light, rgba(245, 158, 11, 0.15))",
      color: "var(--ti-color-warning, #f59e0b)",
      border: "1px solid rgba(245, 158, 11, 0.3)",
    },
    danger: {
      background: "var(--ti-color-danger-light, rgba(239, 68, 68, 0.15))",
      color: "var(--ti-color-danger, #ef4444)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
    },
    info: {
      background: "rgba(99, 102, 241, 0.15)",
      color: "var(--ti-color-primary, #6366f1)",
      border: "1px solid rgba(99, 102, 241, 0.3)",
    },
    neutral: {
      background: "var(--ti-bg-surface-hover, #1f2937)",
      color: "var(--ti-text-secondary, #94a3b8)",
      border: "1px solid var(--ti-border-subtle, #1e293b)",
    },
    premium: {
      background: "var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))",
      color: "var(--ti-color-premium, #a855f7)",
      border: "1px solid rgba(168, 85, 247, 0.3)",
    },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "var(--ti-radius-pill, 9999px)",
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "var(--ti-font-sans)",
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
};
