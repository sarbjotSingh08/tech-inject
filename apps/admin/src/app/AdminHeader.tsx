"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
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
      if (data.isAdmin) {
        setAdminEmail(data.email || "admin@techinject.design");
      } else {
        setAdminEmail(null);
      }
    } catch (_) {
      setAdminEmail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdminEmail(null);
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
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link
          href="/"
          style={{
            fontSize: "18px",
            fontWeight: 800,
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
              background: "var(--ti-color-danger, #ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "14px",
              color: "#fff",
            }}
          >
            AD
          </div>
          <span>Admin Dashboard</span>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <a
          href={
            process.env.NEXT_PUBLIC_CATALOGUE_URL || "https://tech-inject-uvk5.vercel.app/components"
          }
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            color: "var(--ti-text-secondary)",
            textDecoration: "none",
          }}
        >
          Public Catalogue ↗
        </a>

        {!loading && adminEmail ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "13px",
                color: "var(--ti-color-primary, #6366f1)",
                fontWeight: 600,
              }}
            >
              {adminEmail}
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--ti-color-danger, #ef4444)",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: "6px",
              background: "var(--ti-bg-surface-hover, #1f2937)",
              border: "1px solid var(--ti-border-subtle)",
            }}
          >
            Admin Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
