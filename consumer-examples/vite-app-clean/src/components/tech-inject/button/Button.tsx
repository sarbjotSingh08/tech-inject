import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--ti-radius-md, 6px)",
    fontWeight: 500,
    fontFamily: "var(--ti-font-sans)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    border: "1px solid transparent",
    padding:
      size === "sm" ? "6px 12px" : size === "lg" ? "12px 24px" : "8px 16px",
    fontSize: size === "sm" ? "13px" : size === "lg" ? "15px" : "14px",
    gap: "8px",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--ti-color-primary, #6366f1)",
      color: "#ffffff",
    },
    secondary: {
      background: "var(--ti-bg-surface-hover, #1f2937)",
      color: "var(--ti-text-primary, #f8fafc)",
      borderColor: "var(--ti-border-subtle, #1e293b)",
    },
    outline: {
      background: "transparent",
      color: "var(--ti-text-primary, #f8fafc)",
      borderColor: "var(--ti-border-medium, #334155)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ti-text-secondary, #94a3b8)",
    },
    danger: { background: "var(--ti-color-danger, #ef4444)", color: "#ffffff" },
  };

  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant] }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
