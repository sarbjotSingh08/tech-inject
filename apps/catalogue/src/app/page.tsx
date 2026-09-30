import React from "react";
import Link from "next/link";
import { repository } from "@tech-inject/db";

export const revalidate = 0;

export default async function CatalogueHomePage() {
  const components = await repository.getPublishedComponents();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Hero Header */}
      <section
        style={{
          background:
            "linear-gradient(180deg, var(--ti-bg-surface) 0%, var(--ti-bg-card) 100%)",
          border: "1px solid var(--ti-border-subtle, #1e293b)",
          borderRadius: "var(--ti-radius-xl, 12px)",
          padding: "48px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            background:
              "var(--ti-color-primary-light, rgba(99, 102, 241, 0.15))",
            color: "var(--ti-color-primary, #6366f1)",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          Sales CRM Visual Design System
        </div>

        <h1
          style={{
            fontSize: "42px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Tech Inject Component Library
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--ti-text-secondary, #94a3b8)",
            maxWidth: "640px",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          High-performance, accessible React components crafted for enterprise
          CRMs and data-dense dashboards.
        </p>

        <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
          <Link
            href="/components"
            style={{
              background: "var(--ti-color-primary, #6366f1)",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "var(--ti-radius-md, 6px)",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Browse Catalogue ({components.length})
          </Link>
          <Link
            href="/get-started"
            style={{
              background: "var(--ti-bg-surface-hover, #1f2937)",
              border: "1px solid var(--ti-border-medium, #334155)",
              color: "var(--ti-text-primary, #f8fafc)",
              padding: "12px 24px",
              borderRadius: "var(--ti-radius-md, 6px)",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            CLI Setup Guide
          </Link>
        </div>
      </section>

      {/* Featured Component Catalogue Grid */}
      <section
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
              Published Component Registry
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--ti-text-secondary)",
                margin: "4px 0 0 0",
              }}
            >
              Live dynamically-loaded components from database
            </p>
          </div>
          <Link
            href="/components"
            style={{
              color: "var(--ti-color-primary)",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            View All Components &rarr;
          </Link>
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
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
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
                  transition: "transform 0.15s ease, border-color 0.15s ease",
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
                    color: "var(--ti-text-secondary, #94a3b8)",
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
                    style={{
                      color: "var(--ti-color-primary)",
                      fontWeight: 600,
                    }}
                  >
                    Explore &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
