import React from "react";
import Link from "next/link";

export default function GetStartedPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: 0 }}>
          Getting Started with Tech Inject
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ti-text-secondary, #94a3b8)",
            marginTop: "8px",
          }}
        >
          Learn how to install and integrate Sales CRM styled components into
          your React & Next.js applications using our CLI or AI prompts.
        </p>
      </div>

      {/* Step 1: Install Theme Tokens */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
            color: "var(--ti-color-primary)",
          }}
        >
          Step 1: Install Theme & CSS Tokens
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ti-text-secondary)",
            margin: 0,
          }}
        >
          Install the base Sales CRM design tokens package in your React
          project:
        </p>
        <pre
          style={{
            background: "var(--ti-bg-surface, #111827)",
            padding: "12px 16px",
            borderRadius: "var(--ti-radius-md, 6px)",
            fontSize: "13px",
            fontFamily: "var(--ti-font-mono)",
            margin: 0,
            overflowX: "auto",
            border: "1px solid var(--ti-border-subtle)",
          }}
        >
          pnpm add @tech-inject/theme
        </pre>
        <p
          style={{ fontSize: "13px", color: "var(--ti-text-muted)", margin: 0 }}
        >
          Then import CSS variables at your root file (
          <code style={{ color: "#fff" }}>src/main.tsx</code> or{" "}
          <code style={{ color: "#fff" }}>app/layout.tsx</code>):
        </p>
        <pre
          style={{
            background: "var(--ti-bg-surface, #111827)",
            padding: "12px 16px",
            borderRadius: "var(--ti-radius-md, 6px)",
            fontSize: "13px",
            fontFamily: "var(--ti-font-mono)",
            margin: 0,
            color: "var(--ti-color-success)",
            border: "1px solid var(--ti-border-subtle)",
          }}
        >
          import '@tech-inject/theme/dist/theme.css';
        </pre>
      </section>

      {/* Step 2: CLI Component Installation */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
            color: "var(--ti-color-primary)",
          }}
        >
          Step 2: Add Components via Installer CLI
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ti-text-secondary)",
            margin: 0,
          }}
        >
          Use the real installer CLI to download component source files directly
          into your project repository:
        </p>
        <pre
          style={{
            background: "var(--ti-bg-surface, #111827)",
            padding: "12px 16px",
            borderRadius: "var(--ti-radius-md, 6px)",
            fontSize: "13px",
            fontFamily: "var(--ti-font-mono)",
            margin: 0,
            border: "1px solid var(--ti-border-subtle)",
          }}
        >
          npx @tech-inject/cli add button
        </pre>
        <p
          style={{ fontSize: "13px", color: "var(--ti-text-muted)", margin: 0 }}
        >
          For Premium components, authenticate using your customer CLI token:
        </p>
        <pre
          style={{
            background: "var(--ti-bg-surface, #111827)",
            padding: "12px 16px",
            borderRadius: "var(--ti-radius-md, 6px)",
            fontSize: "13px",
            fontFamily: "var(--ti-font-mono)",
            margin: 0,
            color: "var(--ti-color-warning)",
            border: "1px solid var(--ti-border-subtle)",
          }}
        >
          CATALOGUE_TOKEN=ti_live_xxx npx @tech-inject/cli add data-table
        </pre>
      </section>

      {/* Step 3: AI Agent Integration */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
            color: "var(--ti-color-primary)",
          }}
        >
          Step 3: AI Agent Integration Prompts
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ti-text-secondary)",
            margin: 0,
          }}
        >
          Every component in our catalogue generates custom AI-agent prompts.
          Copy the prompt directly into your AI coding assistant (ChatGPT,
          Claude, Antigravity) to automatically install, configure, and verify
          components!
        </p>
        <Link
          href="/components"
          style={{
            color: "var(--ti-color-primary)",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Browse catalogue components to view AI prompts &rarr;
        </Link>
      </section>
    </div>
  );
}
