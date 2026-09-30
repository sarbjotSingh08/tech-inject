import React, { useState } from "react";
import { Button } from "./components/tech-inject/button/Button";

export default function App() {
  const [clickCount, setClickCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "var(--ti-font-sans, system-ui, sans-serif)",
        background: "var(--ti-bg-app, #090d16)",
        color: "var(--ti-text-primary, #f8fafc)",
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--ti-border-subtle, #1e293b)",
          paddingBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
          Clean Consumer Vite Application
        </h1>
        <p
          style={{
            color: "var(--ti-text-secondary, #94a3b8)",
            marginTop: "8px",
            fontSize: "15px",
          }}
        >
          Testing component rendering and Sales CRM visual theme tokens in an
          isolated React consumer project.
        </p>
      </header>

      {/* Interactive Button Section */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          1. Installed Action Buttons
        </h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button variant="primary" onClick={() => setClickCount((c) => c + 1)}>
            Primary Action ({clickCount} clicks)
          </Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Variant</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Action</Button>
        </div>
      </section>

      {/* Status Badges Section */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          2. Status Badges
        </h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ● Lead Qualified
          </span>
          <span
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              color: "#f59e0b",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ▲ Negotiation Pending
          </span>
          <span
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ✖ Deal Lost
          </span>
          <span
            style={{
              background: "rgba(168, 85, 247, 0.15)",
              color: "#a855f7",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ✨ Enterprise VIP
          </span>
        </div>
      </section>

      {/* Input Search Field Section */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "480px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          3. Text & Search Field
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{ fontSize: "13px", color: "var(--ti-text-secondary)" }}
          >
            Search CRM Leads
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type company or contact name..."
            style={{
              background: "var(--ti-bg-surface, #111827)",
              border: "1px solid var(--ti-border-subtle, #1e293b)",
              borderRadius: "6px",
              padding: "10px 14px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
          {searchTerm && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--ti-color-primary, #6366f1)",
                marginTop: "4px",
              }}
            >
              Filtering results for: "{searchTerm}"
            </span>
          )}
        </div>
      </section>

      {/* Sample CRM Table Section */}
      <section
        style={{
          background: "var(--ti-bg-card, #131c2e)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          4. CRM Opportunity Pipeline Table
        </h3>
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
                  background: "var(--ti-bg-surface, #111827)",
                  borderBottom: "1px solid var(--ti-border-subtle)",
                }}
              >
                <th
                  style={{
                    padding: "12px",
                    color: "var(--ti-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  COMPANY
                </th>
                <th
                  style={{
                    padding: "12px",
                    color: "var(--ti-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  DEAL VALUE
                </th>
                <th
                  style={{
                    padding: "12px",
                    color: "var(--ti-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  STAGE
                </th>
                <th
                  style={{
                    padding: "12px",
                    color: "var(--ti-text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  OWNER
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--ti-border-subtle)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>
                  Acme Global Solutions
                </td>
                <td
                  style={{ padding: "12px", color: "#10b981", fontWeight: 700 }}
                >
                  $125,000
                </td>
                <td style={{ padding: "12px" }}>Contract Signed</td>
                <td
                  style={{ padding: "12px", color: "var(--ti-text-secondary)" }}
                >
                  Sarah Chen
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--ti-border-subtle)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Stripe Inc</td>
                <td
                  style={{ padding: "12px", color: "#10b981", fontWeight: 700 }}
                >
                  $85,000
                </td>
                <td style={{ padding: "12px" }}>Proposal Sent</td>
                <td
                  style={{ padding: "12px", color: "var(--ti-text-secondary)" }}
                >
                  Alex Rivera
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
