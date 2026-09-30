"use client";

import React, { useEffect, useState } from "react";
import { transform } from "sucrase";
import * as UI from "@tech-inject/ui";
import * as LucideIcons from "lucide-react";

export default function SandboxPage() {
  const [RenderedComponent, setRenderedComponent] =
    useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compileAndRender = (code: string, props: Record<string, any> = {}) => {
    try {
      setError(null);

      // Define internal module resolver for transpiled code imports
      const customRequire = (moduleName: string) => {
        if (moduleName === "react" || moduleName === "react/jsx-runtime")
          return React;
        if (
          moduleName === "@tech-inject/ui" ||
          moduleName.startsWith("./") ||
          moduleName.startsWith("../")
        )
          return UI;
        if (moduleName === "lucide-react") return LucideIcons;
        return {};
      };

      // Transpile TSX/JSX to JS using sucrase with imports transformation
      const compiled = transform(code, {
        transforms: ["jsx", "typescript", "imports"],
        production: true,
      }).code;

      const exports: Record<string, any> = {};
      const module = { exports };

      const runner = new Function(
        "React",
        "UI",
        "LucideIcons",
        "require",
        "exports",
        "module",
        compiled,
      );

      runner(React, UI, LucideIcons, customRequire, exports, module);

      let Component = module.exports.default;

      if (!Component) {
        const exportKeys = Object.keys(module.exports).filter(
          (k) => k !== "__esModule" && k !== "default",
        );
        for (const key of exportKeys) {
          const val = module.exports[key];
          if (typeof val === "function" || React.isValidElement(val)) {
            Component = val;
            break;
          }
        }
        if (!Component && exportKeys.length > 0) {
          Component = module.exports[exportKeys[0]];
        }
      }

      if (typeof Component === "function" || typeof Component === "object") {
        // Fallback default props for CRM design library components
        const defaultProps: Record<string, any> = {
          placeholder: "Type company or contact name...",
          label: "Search CRM Leads",
          children: "Interactive CRM Component",
          variant: "primary",
          status: "success",
          ...props,
        };

        setRenderedComponent(React.createElement(Component, defaultProps));
      } else {
        // If code is direct JSX element expression
        setError(
          "No exportable React component found in provided preview code.",
        );
      }
    } catch (err: any) {
      console.error("[Sandbox Error]", err);
      setError(`Compilation Error: ${err.message}`);
    }
  };

  useEffect(() => {
    // 1. Check URL search parameters for ?code=...
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      if (urlCode) {
        compileAndRender(urlCode);
      }
    }

    // 2. Listen for postMessage from parent frame
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "RENDER_COMPONENT" && typeof data.code === "string") {
        compileAndRender(data.code, data.props || {});
      }
    };

    window.addEventListener("message", handleMessage);

    // Send ready notification to parent iframe container
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "SANDBOX_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (error) {
    return (
      <div
        style={{
          background: "var(--ti-color-danger-light, rgba(239, 68, 68, 0.15))",
          border: "1px solid var(--ti-color-danger, #ef4444)",
          color: "var(--ti-color-danger, #ef4444)",
          padding: "16px",
          borderRadius: "var(--ti-radius-md, 6px)",
          fontSize: "13px",
          maxWidth: "600px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <strong>Preview Render Error:</strong>
        <pre
          style={{
            margin: "8px 0 0 0",
            whiteSpace: "pre-wrap",
            fontFamily: "var(--ti-font-mono)",
          }}
        >
          {error}
        </pre>
      </div>
    );
  }

  if (!RenderedComponent) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          color: "var(--ti-text-secondary, #94a3b8)",
          padding: "32px",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ fontSize: "32px" }}>⚡</div>
        <h3
          style={{
            margin: 0,
            color: "var(--ti-text-primary, #f8fafc)",
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Tech Inject Isolated Sandbox Engine Active
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            maxWidth: "460px",
            lineHeight: 1.5,
            color: "var(--ti-text-muted, #64748b)",
          }}
        >
          Transpiling client TSX/JSX using Sucrase runtime. Ready to receive
          component preview payloads via URL query parameters or parent
          postMessage RPC.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "12px",
            background: "var(--ti-bg-surface, #111827)",
            padding: "12px 20px",
            borderRadius: "var(--ti-radius-lg, 8px)",
            border: "1px solid var(--ti-border-subtle, #1e293b)",
          }}
        >
          <UI.Button variant="primary">Sandbox Ready</UI.Button>
          <UI.Badge variant="success">Active Host</UI.Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {RenderedComponent}
    </div>
  );
}
