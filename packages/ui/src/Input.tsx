import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", style, ...props }, ref) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: "100%",
        }}
      >
        {label && (
          <label
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--ti-text-secondary, #94a3b8)",
              fontFamily: "var(--ti-font-sans)",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            background: "var(--ti-bg-surface, #111827)",
            border: error
              ? "1px solid var(--ti-color-danger, #ef4444)"
              : "1px solid var(--ti-border-subtle, #1e293b)",
            borderRadius: "var(--ti-radius-md, 6px)",
            padding: "8px 12px",
            color: "var(--ti-text-primary, #f8fafc)",
            fontSize: "14px",
            fontFamily: "var(--ti-font-sans)",
            outline: "none",
            transition: "border-color 0.15s ease",
            ...style,
          }}
          {...props}
        />
        {error && (
          <span
            style={{
              fontSize: "12px",
              color: "var(--ti-color-danger, #ef4444)",
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
