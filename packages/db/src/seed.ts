import { repository } from "./memory-store";
import { hashPassword } from "./auth";
import { ComponentBundle } from "@tech-inject/registry-schema";

export async function seedDatabase() {
  console.log("[SEED] Starting database seed...");

  const freePassword =
    process.env.SEED_FREE_PASSWORD || "FreeCustomerPassword123!";
  const premiumPassword =
    process.env.SEED_PREMIUM_PASSWORD || "PremiumCustomerPassword123!";

  const freeHash = await hashPassword(freePassword);
  const premiumHash = await hashPassword(premiumPassword);

  // 1. Seed test customers
  const freeCustomer = await repository.createCustomer({
    email: "free@techinject.design",
    passwordHash: freeHash,
    isPremium: false,
  });

  const premiumCustomer = await repository.createCustomer({
    email: "premium@techinject.design",
    passwordHash: premiumHash,
    isPremium: true,
  });

  console.log(
    "[SEED] Created test customers: free@techinject.design & premium@techinject.design",
  );

  // 2. Seed Component Fixtures (FREE: Button, Badge, Input; PREMIUM: DataTable, KanbanCard)
  const buttonBundle: ComponentBundle = {
    slug: "button",
    name: "Button",
    description:
      "Versatile interactive button component styled after Sales CRM design tokens.",
    category: "buttons",
    version: "1.0.0",
    access: "free",
    npmDependencies: { "lucide-react": "^0.300.0", clsx: "^2.1.0" },
    registryDependencies: [],
    files: [
      {
        path: "Button.tsx",
        content: `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--ti-radius-md, 6px)',
    fontWeight: 500,
    fontFamily: 'var(--ti-font-sans)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: '1px solid transparent',
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '15px' : '14px',
    gap: '8px'
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--ti-color-primary, #6366f1)', color: '#ffffff' },
    secondary: { background: 'var(--ti-bg-surface-hover, #1f2937)', color: 'var(--ti-text-primary, #f8fafc)', borderColor: 'var(--ti-border-subtle, #1e293b)' },
    outline: { background: 'transparent', color: 'var(--ti-text-primary, #f8fafc)', borderColor: 'var(--ti-border-medium, #334155)' },
    ghost: { background: 'transparent', color: 'var(--ti-text-secondary, #94a3b8)' },
    danger: { background: 'var(--ti-color-danger, #ef4444)', color: '#ffffff' }
  };

  return (
    <button style={{ ...baseStyle, ...variantStyles[variant] }} className={className} {...props}>
      {children}
    </button>
  );
};`,
        type: "component",
      },
    ],
    documentation:
      "# Button Component\n\nSales CRM action button supporting primary, secondary, outline, ghost, and danger variants.",
    example: '<Button variant="primary">Create Deal</Button>',
    thumbnail: null,
  };

  const badgeBundle: ComponentBundle = {
    slug: "badge",
    name: "Badge",
    description:
      "Status pill badge component for pipeline metrics and lead status classification.",
    category: "feedback",
    version: "1.0.0",
    access: "free",
    npmDependencies: {},
    registryDependencies: [],
    files: [
      {
        path: "Badge.tsx",
        content: `import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'premium';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const styles: Record<string, React.CSSProperties> = {
    success: { background: 'var(--ti-color-success-light, rgba(16, 185, 129, 0.15))', color: 'var(--ti-color-success, #10b981)', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { background: 'var(--ti-color-warning-light, rgba(245, 158, 11, 0.15))', color: 'var(--ti-color-warning, #f59e0b)', border: '1px solid rgba(245, 158, 11, 0.3)' },
    danger: { background: 'var(--ti-color-danger-light, rgba(239, 68, 68, 0.15))', color: 'var(--ti-color-danger, #ef4444)', border: '1px solid rgba(239, 68, 68, 0.3)' },
    info: { background: 'rgba(99, 102, 241, 0.15)', color: 'var(--ti-color-primary, #6366f1)', border: '1px solid rgba(99, 102, 241, 0.3)' },
    neutral: { background: 'var(--ti-bg-surface-hover, #1f2937)', color: 'var(--ti-text-secondary, #94a3b8)', border: '1px solid var(--ti-border-subtle, #1e293b)' },
    premium: { background: 'var(--ti-color-premium-light, rgba(168, 85, 247, 0.15))', color: 'var(--ti-color-premium, #a855f7)', border: '1px solid rgba(168, 85, 247, 0.3)' }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--ti-radius-pill, 9999px)',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--ti-font-sans)',
        ...styles[variant]
      }}
    >
      {children}
    </span>
  );
};`,
        type: "component",
      },
    ],
    documentation:
      "# Badge Component\n\nCompact indicator pill for pipeline stages and entity states.",
    example: '<Badge variant="success">Qualified Lead</Badge>',
    thumbnail: null,
  };

  const inputBundle: ComponentBundle = {
    slug: "input",
    name: "Input",
    description:
      "Accessible search and text field input matching Sales CRM design tokens.",
    category: "inputs",
    version: "1.0.0",
    access: "free",
    npmDependencies: {},
    registryDependencies: [],
    files: [
      {
        path: "Input.tsx",
        content: `import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ti-text-secondary, #94a3b8)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            background: 'var(--ti-bg-surface, #111827)',
            border: error ? '1px solid var(--ti-color-danger, #ef4444)' : '1px solid var(--ti-border-subtle, #1e293b)',
            borderRadius: 'var(--ti-radius-md, 6px)',
            padding: '8px 12px',
            color: 'var(--ti-text-primary, #f8fafc)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            ...style
          }}
          {...props}
        />
        {error && <span style={{ fontSize: '12px', color: 'var(--ti-color-danger, #ef4444)' }}>{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';`,
        type: "component",
      },
    ],
    documentation:
      "# Input Component\n\nText input component with label support and focus state handling.",
    example: '<Input label="Search Deals" placeholder="Type deal name..." />',
    thumbnail: null,
  };

  const dataTableBundle: ComponentBundle = {
    slug: "data-table",
    name: "DataTable",
    description:
      "High-performance CRM data table component with sortable headers and row selection.",
    category: "tables",
    version: "1.0.0",
    access: "premium",
    npmDependencies: { "lucide-react": "^0.300.0" },
    registryDependencies: ["button", "badge"],
    files: [
      {
        path: "DataTable.tsx",
        content: `import React from 'react';

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
  onRowClick
}: DataTableProps<T>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--ti-border-subtle, #1e293b)', borderRadius: 'var(--ti-radius-lg, 8px)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', color: 'var(--ti-text-primary, #f8fafc)' }}>
        <thead>
          <tr style={{ background: 'var(--ti-bg-surface, #111827)', borderBottom: '1px solid var(--ti-border-subtle, #1e293b)' }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--ti-text-secondary, #94a3b8)', textTransform: 'uppercase' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '1px solid var(--ti-border-subtle, #1e293b)',
                background: 'var(--ti-bg-card, #131c2e)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.15s ease'
              }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '12px 16px' }}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
        type: "component",
      },
    ],
    documentation:
      "# DataTable Component (Premium)\n\nAdvanced data table for displaying large sets of CRM records with custom cell rendering.",
    example:
      '<DataTable columns={[{ key: "name", header: "Company" }]} data={[{ id: "1", name: "Acme Corp" }]} />',
    thumbnail: null,
  };

  const kanbanCardBundle: ComponentBundle = {
    slug: "kanban-card",
    name: "KanbanCard",
    description:
      "Pipeline opportunity card displaying deal value, account contact, and status tag.",
    category: "cards",
    version: "1.0.0",
    access: "premium",
    npmDependencies: { "lucide-react": "^0.300.0" },
    registryDependencies: ["badge"],
    files: [
      {
        path: "KanbanCard.tsx",
        content: `import React from 'react';

export interface KanbanCardProps {
  title: string;
  amount: string;
  company: string;
  stage: string;
  ownerInitial?: string;
  onClick?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  title,
  amount,
  company,
  stage,
  ownerInitial = 'TI',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--ti-bg-card, #131c2e)',
        border: '1px solid var(--ti-border-subtle, #1e293b)',
        borderRadius: 'var(--ti-radius-lg, 8px)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        boxShadow: 'var(--ti-shadow-sm)',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--ti-text-primary, #f8fafc)' }}>
          {title}
        </h4>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ti-color-success, #10b981)' }}>
          {amount}
        </span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--ti-text-secondary, #94a3b8)' }}>
        {company}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', background: 'var(--ti-bg-surface-hover, #1f2937)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ti-text-muted, #64748b)' }}>
          {stage}
        </span>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ti-color-primary, #6366f1)', color: '#ffffff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ownerInitial}
        </div>
      </div>
    </div>
  );
};`,
        type: "component",
      },
    ],
    documentation:
      "# KanbanCard Component (Premium)\n\nVisual pipeline card for sales leads and deal stage tracking.",
    example:
      '<KanbanCard title="Enterprise License" amount="$45,000" company="Stripe Inc" stage="Proposal Sent" />',
    thumbnail: null,
  };

  // Helper to insert component and publish version
  async function publishBundle(bundle: ComponentBundle) {
    const comp = await repository.createComponent({
      slug: bundle.slug,
      name: bundle.name,
      description: bundle.description,
      category: bundle.category,
      accessLevel: bundle.access,
      status: "published",
    });

    const ver = await repository.createComponentVersion({
      componentId: comp.id,
      version: bundle.version,
      bundleJson: bundle,
    });

    await repository.updateComponentStatus(comp.id, "published", ver.id);
  }

  await publishBundle(buttonBundle);
  await publishBundle(badgeBundle);
  await publishBundle(inputBundle);
  await publishBundle(dataTableBundle);
  await publishBundle(kanbanCardBundle);

  console.log(
    "[SEED] Successfully seeded 5 component bundles (3 Free, 2 Premium).",
  );
}
