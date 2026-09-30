import React from "react";
import Link from "next/link";
import { repository } from "@tech-inject/db";

export const revalidate = 0;

export default async function ComponentsListingPage() {
  const components = await repository.getPublishedComponents();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: 0 }}>
          Component Catalogue
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--ti-text-secondary, #94a3b8)",
            marginTop: "8px",
          }}
        >
          Explore all production components in the Tech Inject Design System.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {components.map((comp) => (
          <Link
            key={comp.id}
            href={`/components/${comp.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "var(--ti-bg-card, #131c2e)",
                border: "1px solid var(--ti-border-subtle, #1e293b)",
                borderRadius: "var(--ti-radius-lg, 8px)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: 0,
                    color: "var(--ti-text-primary)",
                  }}
                >
                  {comp.name}
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background:
                      comp.accessLevel === "premium"
                        ? "var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))"
                        : "rgba(16, 185, 129, 0.15)",
                    color:
                      comp.accessLevel === "premium"
                        ? "var(--ti-color-premium, #a855f7)"
                        : "#10b981",
                    border:
                      comp.accessLevel === "premium"
                        ? "1px solid rgba(168, 85, 247, 0.3)"
                        : "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {comp.accessLevel}
                </span>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--ti-text-secondary)",
                  margin: 0,
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {comp.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--ti-border-subtle, #1e293b)",
                  fontSize: "12px",
                  color: "var(--ti-text-muted, #64748b)",
                }}
              >
                <span>Category: {comp.category}</span>
                <span
                  style={{ color: "var(--ti-color-primary)", fontWeight: 600 }}
                >
                  View Component &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
