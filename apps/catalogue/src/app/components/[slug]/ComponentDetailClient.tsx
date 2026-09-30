"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ComponentDetailClientProps {
  component: {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    accessLevel: "free" | "premium";
    status: string;
    version: string;
  };
  hasAccess: boolean;
  bundle: any | null;
  viewer: any;
}

export function ComponentDetailClient({
  component,
  hasAccess,
  bundle,
  viewer,
}: ComponentDetailClientProps) {
  const [activeTab, setActiveTab] = useState<
    "preview" | "code" | "props" | "install" | "prompt"
  >("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sandboxBase =
    process.env.NEXT_PUBLIC_SANDBOX_URL || "http://localhost:3002";
  const previewCode = bundle?.files?.[0]?.content || "";
  const sandboxSrc = previewCode
    ? `${sandboxBase}?code=${encodeURIComponent(previewCode)}`
    : sandboxBase;

  const sendPayloadToIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow && previewCode) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "RENDER_COMPONENT",
          code: previewCode,
        },
        "*",
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SANDBOX_READY") {
        sendPayloadToIframe();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [previewCode]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const isPremium = component.accessLevel === "premium";
  const installCommand = isPremium
    ? `CATALOGUE_TOKEN=$CATALOGUE_TOKEN npx @tech-inject/cli add ${component.slug}`
    : `npx @tech-inject/cli add ${component.slug}`;

  const aiPromptText = bundle
    ? `
# AI AGENT INSTRUCTION: Add "${bundle.name}" Component

## 1. Installation Command
${installCommand}

## 2. Dependencies
${
  Object.entries(bundle.npmDependencies || {})
    .map(([p, v]) => `- ${p}: ${v}`)
    .join("\n") || "None"
}

## 3. Usage Example
\`\`\`tsx
${bundle.example}
\`\`\`
`.trim()
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
              {component.name}
            </h1>
            <span style={{ fontSize: "13px", color: "var(--ti-text-muted)" }}>
              v{component.version}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "9999px",
                background: isPremium
                  ? "var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))"
                  : "rgba(16, 185, 129, 0.15)",
                color: isPremium
                  ? "var(--ti-color-premium, #a855f7)"
                  : "#10b981",
                border: isPremium
                  ? "1px solid rgba(168, 85, 247, 0.3)"
                  : "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              {component.accessLevel}
            </span>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "var(--ti-text-secondary, #94a3b8)",
              margin: 0,
              maxWidth: "680px",
            }}
          >
            {component.description}
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(installCommand, "install")}
          style={{
            background: "var(--ti-bg-surface, #111827)",
            border: "1px solid var(--ti-border-medium, #334155)",
            color: "var(--ti-text-primary, #f8fafc)",
            padding: "10px 16px",
            borderRadius: "var(--ti-radius-md, 6px)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--ti-font-mono)",
          }}
        >
          {copiedType === "install"
            ? "✓ Command Copied!"
            : "Copy Install Command"}
        </button>
      </div>

      {/* Locked Premium Banner if Access Denied */}
      {!hasAccess && (
        <div
          style={{
            background:
              "var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: "var(--ti-radius-lg, 8px)",
            padding: "32px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "32px" }}>🔒</div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              margin: 0,
              color: "var(--ti-color-premium, #a855f7)",
            }}
          >
            Premium Component Locked
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "var(--ti-text-secondary)",
              maxWidth: "500px",
              margin: 0,
            }}
          >
            Source code, installer payloads, and AI integration prompts for this
            component require an active Premium Customer subscription.
          </p>
          <Link
            href="/login"
            style={{
              background: "var(--ti-color-premium, #a855f7)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Sign In to Premium Account
          </Link>
        </div>
      )}

      {/* Accessible Detail Tabs & Content */}
      {hasAccess && bundle && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Tab Selection */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid var(--ti-border-subtle, #1e293b)",
            }}
          >
            {(["preview", "code", "props", "install", "prompt"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 20px",
                    background: "transparent",
                    border: "none",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid var(--ti-color-primary, #6366f1)"
                        : "2px solid transparent",
                    color:
                      activeTab === tab
                        ? "var(--ti-color-primary, #6366f1)"
                        : "var(--ti-text-secondary, #94a3b8)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "prompt" ? "AI Agent Prompt" : tab}
                </button>
              ),
            )}
          </div>

          {/* Tab Content 1: Isolated Preview Frame */}
          {activeTab === "preview" && (
            <div
              style={{
                background: "var(--ti-bg-surface, #111827)",
                border: "1px solid var(--ti-border-subtle, #1e293b)",
                borderRadius: "var(--ti-radius-lg, 8px)",
                minHeight: "280px",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <iframe
                ref={iframeRef}
                src={sandboxSrc}
                onLoad={sendPayloadToIframe}
                sandbox="allow-scripts"
                style={{
                  width: "100%",
                  height: "280px",
                  border: "none",
                  background: "transparent",
                }}
              />
            </div>
          )}

          {/* Tab Content 2: Source Code Viewer */}
          {activeTab === "code" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--ti-text-muted)",
                    fontFamily: "var(--ti-font-mono)",
                  }}
                >
                  File: {bundle.files[0]?.path}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(bundle.files[0]?.content || "", "code")
                  }
                  style={{
                    background: "var(--ti-bg-surface-hover)",
                    border: "1px solid var(--ti-border-subtle)",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {copiedType === "code" ? "✓ Code Copied" : "Copy Source Code"}
                </button>
              </div>
              <pre
                style={{
                  background: "var(--ti-bg-surface, #111827)",
                  border: "1px solid var(--ti-border-subtle, #1e293b)",
                  borderRadius: "var(--ti-radius-lg, 8px)",
                  padding: "20px",
                  fontSize: "13px",
                  fontFamily: "var(--ti-font-mono)",
                  color: "var(--ti-text-primary)",
                  overflowX: "auto",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {bundle.files[0]?.content}
              </pre>
            </div>
          )}

          {/* Tab Content 3: Props & Usage */}
          {activeTab === "props" && (
            <div
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
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                Example Usage
              </h3>
              <pre
                style={{
                  background: "var(--ti-bg-surface, #111827)",
                  padding: "16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "var(--ti-font-mono)",
                  margin: 0,
                  color: "var(--ti-color-success)",
                }}
              >
                {bundle.example}
              </pre>

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "16px 0 0 0",
                }}
              >
                Component Documentation
              </h3>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--ti-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {bundle.documentation}
              </div>
            </div>
          )}

          {/* Tab Content 4: Install Command */}
          {activeTab === "install" && (
            <div
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
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                Install Component via CLI
              </h3>
              <pre
                style={{
                  background: "var(--ti-bg-surface, #111827)",
                  padding: "16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "var(--ti-font-mono)",
                  margin: 0,
                  border: "1px solid var(--ti-border-subtle)",
                }}
              >
                {installCommand}
              </pre>
            </div>
          )}

          {/* Tab Content 5: AI Agent Integration Prompt */}
          {activeTab === "prompt" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "13px", color: "var(--ti-text-muted)" }}
                >
                  Copy this prompt into your AI coding assistant (Antigravity /
                  Claude / ChatGPT)
                </span>
                <button
                  onClick={() => copyToClipboard(aiPromptText, "prompt")}
                  style={{
                    background: "var(--ti-color-primary, #6366f1)",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedType === "prompt"
                    ? "✓ Prompt Copied!"
                    : "Copy AI Prompt"}
                </button>
              </div>
              <pre
                style={{
                  background: "var(--ti-bg-surface, #111827)",
                  border: "1px solid var(--ti-border-subtle, #1e293b)",
                  borderRadius: "var(--ti-radius-lg, 8px)",
                  padding: "20px",
                  fontSize: "13px",
                  fontFamily: "var(--ti-font-mono)",
                  color: "var(--ti-text-primary)",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {aiPromptText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
