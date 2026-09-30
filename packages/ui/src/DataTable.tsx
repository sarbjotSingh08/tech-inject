import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid var(--ti-border-subtle, #1e293b)",
        borderRadius: "var(--ti-radius-lg, 8px)",
        background: "var(--ti-bg-card, #131c2e)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "14px",
          color: "var(--ti-text-primary, #f8fafc)",
          fontFamily: "var(--ti-font-sans)",
        }}
      >
        <thead>
          <tr
            style={{
              background: "var(--ti-bg-surface, #111827)",
              borderBottom: "1px solid var(--ti-border-subtle, #1e293b)",
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--ti-text-secondary, #94a3b8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "var(--ti-text-muted, #64748b)",
                }}
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  borderBottom: "1px solid var(--ti-border-subtle, #1e293b)",
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background 0.15s ease",
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "12px 16px" }}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
