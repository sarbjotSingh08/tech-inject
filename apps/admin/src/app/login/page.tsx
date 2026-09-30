"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Admin login failed");
      }

      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminDefaults = () => {
    setEmail("admin@techinject.design");
    setPassword("AdminSecretPassword123!");
  };

  return (
    <div style={{ maxWidth: "440px", margin: "40px auto", width: "100%" }}>
      <div
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-xl, 12px)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              color: "var(--ti-color-danger, #ef4444)",
            }}
          >
            Admin Portal Sign In
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--ti-text-secondary)",
              marginTop: "6px",
            }}
          >
            Elevated administrative access for publishing bundles and managing
            subscriptions.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--ti-color-danger, #ef4444)",
              color: "var(--ti-color-danger, #ef4444)",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ti-text-secondary)",
              }}
            >
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@techinject.design"
              required
              style={{
                background: "var(--ti-bg-surface, #111827)",
                border: "1px solid var(--ti-border-subtle, #1e293b)",
                borderRadius: "6px",
                padding: "10px 12px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ti-text-secondary)",
              }}
            >
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                background: "var(--ti-bg-surface, #111827)",
                border: "1px solid var(--ti-border-subtle, #1e293b)",
                borderRadius: "6px",
                padding: "10px 12px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--ti-color-danger, #ef4444)",
              color: "#ffffff",
              border: "none",
              padding: "12px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Authenticating..." : "Sign In as Admin"}
          </button>
        </form>

        <div
          style={{
            borderTop: "1px solid var(--ti-border-subtle)",
            paddingTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={fillAdminDefaults}
            style={{
              width: "100%",
              padding: "8px",
              background: "var(--ti-bg-surface-hover)",
              border: "1px solid var(--ti-border-subtle)",
              color: "var(--ti-text-secondary)",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Fill Admin Credentials (Evaluator Shortcut)
          </button>
        </div>
      </div>
    </div>
  );
}
