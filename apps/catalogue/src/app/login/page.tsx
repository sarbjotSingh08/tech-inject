"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
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
        throw new Error(data.error || "Login failed");
      }

      window.location.href = "/account";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillSeedAccount = (type: "free" | "premium") => {
    if (type === "free") {
      setEmail("free@techinject.design");
      setPassword("FreeCustomerPassword123!");
    } else {
      setEmail("premium@techinject.design");
      setPassword("PremiumCustomerPassword123!");
    }
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
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Customer Sign In
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--ti-text-secondary)",
              marginTop: "6px",
            }}
          >
            Sign in to access your free or premium component library
            entitlement.
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              required
              style={{
                background: "var(--ti-bg-surface, #111827)",
                border: "1px solid var(--ti-border-subtle, #1e293b)",
                borderRadius: "6px",
                padding: "10px 12px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
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
              Password
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
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--ti-color-primary, #6366f1)",
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Quick Seed Credentials for Evaluators */}
        <div
          style={{
            borderTop: "1px solid var(--ti-border-subtle, #1e293b)",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "var(--ti-text-muted)",
              fontWeight: 600,
            }}
          >
            TEST SEED ACCOUNTS (EVALUATOR QUICK FILL):
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => fillSeedAccount("free")}
              style={{
                flex: 1,
                padding: "8px",
                background: "var(--ti-bg-surface-hover, #1f2937)",
                border: "1px solid var(--ti-border-subtle)",
                color: "var(--ti-text-secondary)",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Fill Free Customer
            </button>
            <button
              type="button"
              onClick={() => fillSeedAccount("premium")}
              style={{
                flex: 1,
                padding: "8px",
                background:
                  "var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                color: "var(--ti-color-premium, #a855f7)",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Fill Premium Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
