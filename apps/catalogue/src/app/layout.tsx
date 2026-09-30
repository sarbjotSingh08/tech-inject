import "@tech-inject/theme/dist/theme.css";
import React from "react";
import { CatalogueHeader } from "./CatalogueHeader";

export const metadata = {
  title: "Tech Inject Design Library | Sales CRM Component Catalogue",
  description:
    "Production-ready reusable React component library and dynamic registry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "var(--ti-bg-app, #090d16)",
          color: "var(--ti-text-primary, #f8fafc)",
          fontFamily: "var(--ti-font-sans)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CatalogueHeader />
        <main
          style={{
            flex: 1,
            padding: "32px",
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            background: "var(--ti-bg-surface, #111827)",
            borderTop: "1px solid var(--ti-border-subtle, #1e293b)",
            padding: "24px 32px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--ti-text-muted, #64748b)",
          }}
        >
          Tech Inject Design Library &copy; {new Date().getFullYear()} — Sales
          CRM Reusable Component Registry.
        </footer>
      </body>
    </html>
  );
}
