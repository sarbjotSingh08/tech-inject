import "@tech-inject/theme/dist/theme.css";
import React from "react";
import { AdminHeader } from "./AdminHeader";

export const metadata = {
  title: "Tech Inject Admin Dashboard",
  description:
    "Component publishing, validation, draft preview, and customer subscription management.",
};

export default function AdminLayout({
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
        <AdminHeader />
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
      </body>
    </html>
  );
}
