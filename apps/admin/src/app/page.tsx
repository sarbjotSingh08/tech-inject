"use client";

import React, { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Publishing Form State
  const [bundleText, setBundleText] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const fetchAdminStatus = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.isAdmin) {
        setAdmin(data);
        fetchDashboardData();
      } else {
        setAdmin(null);
      }
    } catch (_) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const compRes = await fetch("/api/components");
      if (compRes.ok) {
        const compData = await compRes.json();
        setComponents(compData.components || []);
      }
    } catch (_) {}

    try {
      const custRes = await fetch("/api/customers");
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData.customers || []);
      }
    } catch (_) {}

    try {
      const logRes = await fetch("/api/audit-logs");
      if (logRes.ok) {
        const logData = await logRes.json();
        setAuditLogs(logData.logs || []);
      }
    } catch (_) {}
  };

  const handlePublishBundle = async () => {
    setPublishStatus(null);
    setValidationResult(null);

    try {
      let parsed;
      try {
        parsed = JSON.parse(bundleText);
      } catch (err: any) {
        setValidationResult({
          success: false,
          errors: [`JSON Parse Error: ${err.message}`],
        });
        return;
      }

      const res = await fetch("/api/components/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok) {
        setValidationResult({
          success: false,
          errors: data.details || [data.error],
        });
      } else {
        setPublishStatus(
          `Successfully published component bundle "${data.component.slug}" (Version ${data.component.version}, Hash: ${data.component.bundleHash.slice(0, 8)})`,
        );
        setBundleText("");
        fetchDashboardData();
      }
    } catch (err: any) {
      setValidationResult({ success: false, errors: [err.message] });
    }
  };

  const handleUnpublish = async (slug: string) => {
    if (
      !confirm(
        `Are you sure you want to unpublish "${slug}"? It will immediately disappear from the catalogue.`,
      )
    )
      return;

    try {
      const res = await fetch("/api/components/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to unpublish", err);
    }
  };

  const handleTogglePremium = async (
    customerId: string,
    currentStatus: boolean,
    email: string,
  ) => {
    const action = currentStatus ? "revoke" : "grant";
    if (
      currentStatus &&
      !confirm(
        `Revoke premium subscription for customer "${email}"? Protected endpoints will immediately block them.`,
      )
    ) {
      return;
    }

    try {
      const endpoint = currentStatus
        ? "/api/customers/revoke-premium"
        : "/api/customers/grant-premium";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(`Failed to ${action} premium`, err);
    }
  };

  const fillSampleBundle = () => {
    const sample = {
      slug: "metric-card",
      name: "MetricCard",
      description:
        "KPI summary card with trend indicator pill for sales revenue metrics.",
      category: "cards",
      version: "1.0.0",
      access: "free",
      npmDependencies: { "lucide-react": "^0.300.0" },
      registryDependencies: ["badge"],
      files: [
        {
          path: "MetricCard.tsx",
          content: `import React from 'react';

export interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend }) => {
  return (
    <div style={{ background: 'var(--ti-bg-card, #131c2e)', border: '1px solid var(--ti-border-subtle, #1e293b)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ fontSize: '13px', color: 'var(--ti-text-secondary, #94a3b8)' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0', color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--ti-color-success, #10b981)', fontWeight: 600 }}>{trend}</div>
    </div>
  );
};`,
          type: "component",
        },
      ],
      documentation:
        "# MetricCard Component\n\nSales metrics KPI summary card.",
      example:
        '<MetricCard label="Monthly Recurring Revenue" value="$124,500" trend="+14.2% vs last month" />',
      thumbnail: null,
    };
    setBundleText(JSON.stringify(sample, null, 2));
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
        Loading Admin Session...
      </div>
    );
  }

  if (!admin) {
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
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            margin: 0,
            color: "var(--ti-color-danger, #ef4444)",
          }}
        >
          Admin Authentication Required
        </h2>
        <p
          style={{
            color: "var(--ti-text-secondary)",
            fontSize: "14px",
            margin: "12px 0 24px 0",
          }}
        >
          Please sign in with your administrative credentials to manage
          component bundles.
        </p>
        <a
          href="/login"
          style={{
            background: "var(--ti-color-danger, #ef4444)",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Sign In as Admin
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: 0 }}>
          Admin Command Center
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ti-text-secondary)",
            marginTop: "4px",
          }}
        >
          Signed in as{" "}
          <code style={{ color: "var(--ti-color-primary)" }}>
            {admin.email}
          </code>
        </p>
      </div>

      {/* 1. Component Publishing Portal */}
      <section
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
              Upload & Atomically Publish Component Bundle
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--ti-text-secondary)",
                marginTop: "4px",
              }}
            >
              Paste raw JSON component bundle. Strictly validated via Zod schema
              before immutable version recording.
            </p>
          </div>
          <button
            type="button"
            onClick={fillSampleBundle}
            style={{
              background: "var(--ti-bg-surface-hover, #1f2937)",
              border: "1px solid var(--ti-border-subtle)",
              color: "var(--ti-text-primary)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Load Sample Bundle JSON
          </button>
        </div>

        {publishStatus && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--ti-color-success, #10b981)",
              color: "var(--ti-color-success, #10b981)",
              padding: "12px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ✓ {publishStatus}
          </div>
        )}

        {validationResult && !validationResult.success && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--ti-color-danger, #ef4444)",
              color: "var(--ti-color-danger, #ef4444)",
              padding: "16px",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            <strong>Validation Error Details:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
              {validationResult.errors?.map((err: string, i: number) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <textarea
          rows={10}
          value={bundleText}
          onChange={(e) => setBundleText(e.target.value)}
          placeholder={`{\n  "slug": "custom-card",\n  "name": "CustomCard",\n  "description": "Card component description...",\n  "category": "cards",\n  "version": "1.0.0",\n  "access": "free",\n  "files": [{ "path": "CustomCard.tsx", "content": "export const CustomCard = () => <div>Card</div>;", "type": "component" }],\n  "documentation": "# Documentation",\n  "example": "<CustomCard />"\n}`}
          style={{
            background: "var(--ti-bg-surface, #111827)",
            border: "1px solid var(--ti-border-subtle, #1e293b)",
            borderRadius: "6px",
            padding: "12px",
            color: "#fff",
            fontFamily: "var(--ti-font-mono)",
            fontSize: "13px",
            outline: "none",
            resize: "vertical",
          }}
        />

        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button
            onClick={handlePublishBundle}
            style={{
              background: "var(--ti-color-primary, #6366f1)",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Validate & Publish Component
          </button>
        </div>
      </section>

      {/* 2. Component Inventory & Unpublish Manager */}
      <section
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
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          Component Registry Inventory ({components.length})
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--ti-border-subtle)",
                  color: "var(--ti-text-secondary)",
                  fontSize: "12px",
                }}
              >
                <th style={{ padding: "10px" }}>NAME / SLUG</th>
                <th style={{ padding: "10px" }}>CATEGORY</th>
                <th style={{ padding: "10px" }}>ACCESS</th>
                <th style={{ padding: "10px" }}>STATUS</th>
                <th style={{ padding: "10px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {components.map((comp) => (
                <tr
                  key={comp.id}
                  style={{ borderBottom: "1px solid var(--ti-border-subtle)" }}
                >
                  <td style={{ padding: "12px 10px", fontWeight: 600 }}>
                    {comp.name}{" "}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--ti-text-muted)",
                        fontWeight: 400,
                      }}
                    >
                      ({comp.slug})
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 10px",
                      color: "var(--ti-text-secondary)",
                    }}
                  >
                    {comp.category}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        background:
                          comp.accessLevel === "premium"
                            ? "rgba(168, 85, 247, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color:
                          comp.accessLevel === "premium"
                            ? "#a855f7"
                            : "#10b981",
                      }}
                    >
                      {comp.accessLevel}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 10px",
                      color: "var(--ti-text-primary)",
                    }}
                  >
                    {comp.status}
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    {comp.status === "published" && (
                      <button
                        onClick={() => handleUnpublish(comp.slug)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Unpublish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Customer Management (Grant & Revoke Premium) */}
      <section
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
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          Customer Subscription Access Management ({customers.length})
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--ti-border-subtle)",
                  color: "var(--ti-text-secondary)",
                  fontSize: "12px",
                }}
              >
                <th style={{ padding: "10px" }}>CUSTOMER EMAIL</th>
                <th style={{ padding: "10px" }}>PREMIUM STATUS</th>
                <th style={{ padding: "10px", textAlign: "right" }}>
                  PREMIUM ENTIREMENT CONTROL
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr
                  key={cust.id}
                  style={{ borderBottom: "1px solid var(--ti-border-subtle)" }}
                >
                  <td style={{ padding: "12px 10px", fontWeight: 600 }}>
                    {cust.email}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        background: cust.isPremium
                          ? "rgba(168, 85, 247, 0.15)"
                          : "rgba(148, 163, 184, 0.15)",
                        color: cust.isPremium ? "#a855f7" : "#94a3b8",
                      }}
                    >
                      {cust.isPremium ? "✨ Premium Active" : "Free Customer"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    <button
                      onClick={() =>
                        handleTogglePremium(cust.id, cust.isPremium, cust.email)
                      }
                      style={{
                        background: cust.isPremium
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(16, 185, 129, 0.15)",
                        color: cust.isPremium ? "#ef4444" : "#10b981",
                        border: cust.isPremium
                          ? "1px solid rgba(239, 68, 68, 0.3)"
                          : "1px solid rgba(16, 185, 129, 0.3)",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {cust.isPremium
                        ? "Revoke Premium Access"
                        : "Grant Premium Access"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Security Audit Trail */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-lg, 8px)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
          Security Audit Trail ({auditLogs.length} Events)
        </h2>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              fontFamily: "var(--ti-font-mono)",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--ti-border-subtle)",
                  color: "var(--ti-text-secondary)",
                }}
              >
                <th style={{ padding: "8px" }}>TIMESTAMP</th>
                <th style={{ padding: "8px" }}>ACTOR</th>
                <th style={{ padding: "8px" }}>ACTION</th>
                <th style={{ padding: "8px" }}>RESOURCE</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr
                  key={log.id}
                  style={{ borderBottom: "1px solid var(--ti-border-subtle)" }}
                >
                  <td style={{ padding: "8px", color: "var(--ti-text-muted)" }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td
                    style={{ padding: "8px", color: "var(--ti-color-primary)" }}
                  >
                    {log.actor}
                  </td>
                  <td style={{ padding: "8px", fontWeight: 600 }}>
                    {log.action}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      color: "var(--ti-text-secondary)",
                    }}
                  >
                    {log.resource}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
