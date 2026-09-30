"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlaintextToken, setNewPlaintextToken] = useState<string | null>(
    null,
  );
  const [tokenName, setTokenName] = useState("CLI Token");

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch (_) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleCreateToken = async () => {
    try {
      const res = await fetch("/api/tokens/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tokenName }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewPlaintextToken(data.token);
        setTokens((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error("Failed to create token", err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          color: "var(--ti-text-muted)",
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading account profile...
      </div>
    );
  }

  if (!customer) {
    return (
      <div
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "40px",
          textAlign: "center",
          maxWidth: "500px",
          margin: "40px auto",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          Signed Out
        </h2>
        <p
          style={{
            color: "var(--ti-text-secondary)",
            fontSize: "14px",
            margin: "12px 0 24px 0",
          }}
        >
          Please sign in to view your account status and manage CLI
          authentication tokens.
        </p>
        <button
          onClick={() => router.push("/login")}
          style={{
            background: "var(--ti-color-primary, #6366f1)",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go to Sign In
        </button>
      </div>
    );
  }

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
      {/* Account Info Header */}
      <div
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>
            {customer.email}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            <span
              style={{ fontSize: "13px", color: "var(--ti-text-secondary)" }}
            >
              Subscription Tier:
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "2px 10px",
                borderRadius: "9999px",
                background: customer.isPremium
                  ? "var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))"
                  : "var(--ti-bg-surface-hover, #1f2937)",
                color: customer.isPremium
                  ? "var(--ti-color-premium, #a855f7)"
                  : "var(--ti-text-secondary, #94a3b8)",
                border: customer.isPremium
                  ? "1px solid rgba(168, 85, 247, 0.3)"
                  : "1px solid var(--ti-border-subtle)",
              }}
            >
              {customer.isPremium ? "✨ Premium Active" : "Free Customer"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "var(--ti-color-danger-light, rgba(239, 68, 68, 0.15))",
            color: "var(--ti-color-danger, #ef4444)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* CLI Access Token Management */}
      <div
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
            CLI Access Tokens
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--ti-text-secondary)",
              marginTop: "4px",
            }}
          >
            Generate authentication tokens for installing Premium components via{" "}
            <code style={{ color: "#fff" }}>npx @tech-inject/cli</code>.
          </p>
        </div>

        {newPlaintextToken && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--ti-color-success, #10b981)",
              padding: "16px",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <strong
              style={{
                color: "var(--ti-color-success, #10b981)",
                fontSize: "14px",
              }}
            >
              ✓ New CLI Token Created (Save this now! It will NOT be shown
              again):
            </strong>
            <code
              style={{
                background: "#000",
                padding: "10px 12px",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "13px",
                fontFamily: "var(--ti-font-mono)",
                wordBreak: "break-all",
              }}
            >
              {newPlaintextToken}
            </code>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="Token Label (e.g. Laptop CLI)"
            style={{
              flex: 1,
              background: "var(--ti-bg-surface, #111827)",
              border: "1px solid var(--ti-border-subtle, #1e293b)",
              borderRadius: "6px",
              padding: "8px 12px",
              color: "#fff",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleCreateToken}
            style={{
              background: "var(--ti-color-primary, #6366f1)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Generate Token
          </button>
        </div>
      </div>
    </div>
  );
}
