"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function CatalogueHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [customer, setCustomer] = useState<{
    email: string;
    isPremium: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
    window.addEventListener("focus", fetchSession);
    return () => window.removeEventListener("focus", fetchSession);
  }, [pathname]);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated && data.customer) {
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
    setCustomer(null);
    window.location.href = "/login";
  };

  return (
    <header
      style={{
        background: "var(--ti-bg-surface, #111827)",
        borderBottom: "1px solid var(--ti-border-subtle, #1e293b)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Link
          href="/"
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#ffffff",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "var(--ti-color-primary, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "14px",
              color: "#fff",
            }}
          >
            TI
          </div>
          <span>Tech Inject</span>
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <Link
            href="/components"
            style={{
              color: "var(--ti-text-secondary, #94a3b8)",
              textDecoration: "none",
            }}
          >
            Components
          </Link>
          <Link
            href="/get-started"
            style={{
              color: "var(--ti-text-secondary, #94a3b8)",
              textDecoration: "none",
            }}
          >
            Get Started
          </Link>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--ti-color-primary, #6366f1)",
              textDecoration: "none",
            }}
          >
            Admin Dashboard ↗
          </a>
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {!loading && customer ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "9999px",
                background: customer.isPremium
                  ? "rgba(168, 85, 247, 0.15)"
                  : "rgba(148, 163, 184, 0.15)",
                color: customer.isPremium ? "#a855f7" : "#94a3b8",
                border: customer.isPremium
                  ? "1px solid rgba(168, 85, 247, 0.3)"
                  : "1px solid var(--ti-border-subtle)",
              }}
            >
              {customer.isPremium ? "✨ Premium" : "Free"}
            </span>
            <Link
              href="/account"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--ti-text-primary, #f8fafc)",
                textDecoration: "none",
              }}
            >
              {customer.email}
            </Link>
            <button
              onClick={handleLogout}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--ti-text-muted)",
                background: "var(--ti-bg-surface-hover, #1f2937)",
                border: "1px solid var(--ti-border-subtle)",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ti-text-primary, #f8fafc)",
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: "var(--ti-radius-md, 6px)",
                border: "1px solid var(--ti-border-subtle, #1e293b)",
                background: "var(--ti-bg-surface-hover, #1f2937)",
              }}
            >
              Customer Sign In
            </Link>
            <Link
              href="/account"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#ffffff",
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: "var(--ti-radius-md, 6px)",
                background: "var(--ti-color-primary, #6366f1)",
              }}
            >
              Account
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
