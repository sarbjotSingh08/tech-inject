import React from "react";

export interface KanbanCardProps {
  title: string;
  amount: string;
  company: string;
  stage: string;
  ownerInitial?: string;
  onClick?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  title,
  amount,
  company,
  stage,
  ownerInitial = "TI",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--ti-bg-card, #131c2e)",
        border: "1px solid var(--ti-border-subtle, #1e293b)",
        borderRadius: "var(--ti-radius-lg, 8px)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        boxShadow: "var(--ti-shadow-sm)",
        fontFamily: "var(--ti-font-sans)",
        transition: "transform 0.15s ease, border-color 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--ti-text-primary, #f8fafc)",
          }}
        >
          {title}
        </h4>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--ti-color-success, #10b981)",
          }}
        >
          {amount}
        </span>
      </div>
      <div
        style={{ fontSize: "13px", color: "var(--ti-text-secondary, #94a3b8)" }}
      >
        {company}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            background: "var(--ti-bg-surface-hover, #1f2937)",
            padding: "2px 6px",
            borderRadius: "4px",
            color: "var(--ti-text-muted, #64748b)",
          }}
        >
          {stage}
        </span>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "var(--ti-color-primary, #6366f1)",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ownerInitial}
        </div>
      </div>
    </div>
  );
};
