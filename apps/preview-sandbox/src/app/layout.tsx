import "@tech-inject/theme/dist/theme.css";
import React from "react";

export const metadata = {
  title: "Tech Inject Preview Sandbox",
  description: "Isolated component rendering sandbox",
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
          padding: "16px",
          background: "var(--ti-bg-surface, #111827)",
          color: "var(--ti-text-primary, #f8fafc)",
          fontFamily: "var(--ti-font-sans)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {children}
      </body>
    </html>
  );
}
