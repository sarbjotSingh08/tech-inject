import { ComponentBundle } from "@tech-inject/registry-schema";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface DbComponent {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  accessLevel: "free" | "premium";
  status: "draft" | "published" | "unpublished";
  currentVersionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbComponentVersion {
  id: string;
  componentId: string;
  version: string;
  bundleJson: ComponentBundle;
  bundleHash: string;
  createdAt: Date;
}

export interface DbCustomer {
  id: string;
  email: string;
  passwordHash: string;
  isPremium: boolean;
  premiumGrantedAt: Date | null;
  premiumRevokedAt: Date | null;
  createdAt: Date;
}

export interface DbAccessToken {
  id: string;
  customerId: string;
  name: string;
  hashedToken: string;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export interface DbAuditLog {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata?: Record<string, any> | null;
}

class MemoryStore {
  components: Map<string, DbComponent> = new Map();
  versions: Map<string, DbComponentVersion> = new Map();
  customers: Map<string, DbCustomer> = new Map();
  tokens: Map<string, DbAccessToken> = new Map();
  auditLogs: DbAuditLog[] = [];

  constructor() {
    this.loadFromDisk();
    // Always re-seed test customers with valid Bcrypt password hashes
    this.seedDefaults();
  }

  loadFromDisk() {
    try {
      const potentialPaths = [
        path.resolve(process.cwd(), ".data/store.json"),
        path.resolve(process.cwd(), "../.data/store.json"),
        path.resolve(process.cwd(), "../../.data/store.json"),
        "d:/tech-inject/.data/store.json",
      ];

      let filePathToRead = potentialPaths.find((p) => fs.existsSync(p));
      if (filePathToRead && fs.existsSync(filePathToRead)) {
        const raw = fs.readFileSync(filePathToRead, "utf8");
        const data = JSON.parse(raw);
        if (data.components && data.components.length > 0) {
          this.components = new Map(
            data.components.map((c: any) => [
              c.id,
              {
                ...c,
                createdAt: new Date(c.createdAt),
                updatedAt: new Date(c.updatedAt),
              },
            ]),
          );
        }
        if (data.versions && data.versions.length > 0) {
          this.versions = new Map(
            data.versions.map((v: any) => [
              v.id,
              { ...v, createdAt: new Date(v.createdAt) },
            ]),
          );
        }
        if (data.customers && data.customers.length > 0) {
          this.customers = new Map(
            data.customers.map((c: any) => [
              c.id,
              { ...c, createdAt: new Date(c.createdAt) },
            ]),
          );
        }
        if (data.tokens) {
          this.tokens = new Map(
            data.tokens.map((t: any) => [
              t.id,
              { ...t, createdAt: new Date(t.createdAt) },
            ]),
          );
        }
        if (data.auditLogs) {
          this.auditLogs = data.auditLogs.map((l: any) => ({
            ...l,
            timestamp: new Date(l.timestamp),
          }));
        }
      }
    } catch (err) {
      console.warn(
        "[Store] Could not load disk store, initializing fresh defaults:",
        err,
      );
    }
  }

  saveToDisk() {
    try {
      const targetDir = "d:/tech-inject/.data";
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const serialized = JSON.stringify(
        {
          components: Array.from(this.components.values()),
          versions: Array.from(this.versions.values()),
          customers: Array.from(this.customers.values()),
          tokens: Array.from(this.tokens.values()),
          auditLogs: this.auditLogs,
        },
        null,
        2,
      );
      fs.writeFileSync(path.join(targetDir, "store.json"), serialized, "utf8");
    } catch (err) {
      console.warn("[Store] Error saving disk store:", err);
    }
  }

  seedDefaults() {
    console.log(
      "[Store] Seeding default Tech Inject component registry & test customers with valid Bcrypt hashes...",
    );

    const freePass =
      process.env.SEED_FREE_PASSWORD || "FreeCustomerPassword123!";
    const premiumPass =
      process.env.SEED_PREMIUM_PASSWORD || "PremiumCustomerPassword123!";

    const freeHash = bcrypt.hashSync(freePass, 10);
    const premiumHash = bcrypt.hashSync(premiumPass, 10);

    // Seed test customers
    const freeCust: DbCustomer = {
      id: "cust_free_default",
      email: "free@techinject.design",
      passwordHash: freeHash,
      isPremium: false,
      premiumGrantedAt: null,
      premiumRevokedAt: null,
      createdAt: new Date(),
    };
    const premiumCust: DbCustomer = {
      id: "cust_premium_default",
      email: "premium@techinject.design",
      passwordHash: premiumHash,
      isPremium: true,
      premiumGrantedAt: new Date(),
      premiumRevokedAt: null,
      createdAt: new Date(),
    };
    this.customers.set(freeCust.id, freeCust);
    this.customers.set(premiumCust.id, premiumCust);

    // Seed 5 Components if empty
    if (this.components.size === 0) {
      const seedBundles: ComponentBundle[] = [
        {
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
        },
        {
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
        },
        {
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
          example:
            '<Input label="Search Deals" placeholder="Type deal name..." />',
          thumbnail: null,
        },
        {
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
        },
        {
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
        },
      ];

      for (const b of seedBundles) {
        const compId = `comp_${b.slug}`;
        const verId = `ver_${b.slug}_1.0.0`;

        const compRecord: DbComponent = {
          id: compId,
          slug: b.slug,
          name: b.name,
          description: b.description,
          category: b.category,
          accessLevel: b.access,
          status: "published",
          currentVersionId: verId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const bundleStr = JSON.stringify(b);
        const hash = crypto
          .createHash("sha256")
          .update(bundleStr)
          .digest("hex");

        const verRecord: DbComponentVersion = {
          id: verId,
          componentId: compId,
          version: b.version,
          bundleJson: b,
          bundleHash: hash,
          createdAt: new Date(),
        };

        this.components.set(compId, compRecord);
        this.versions.set(verId, verRecord);
      }
    }

    this.saveToDisk();
  }

  clear() {
    this.components.clear();
    this.versions.clear();
    this.customers.clear();
    this.tokens.clear();
    this.auditLogs = [];
    this.saveToDisk();
  }
}

export const memoryDb = new MemoryStore();

// Repository Functions for Store
export const repository = {
  // Components
  async getComponents(): Promise<DbComponent[]> {
    memoryDb.loadFromDisk();
    return Array.from(memoryDb.components.values());
  },

  async getPublishedComponents(): Promise<DbComponent[]> {
    memoryDb.loadFromDisk();
    return Array.from(memoryDb.components.values()).filter(
      (c) => c.status === "published",
    );
  },

  async getComponentBySlug(slug: string): Promise<DbComponent | null> {
    memoryDb.loadFromDisk();
    const matches = Array.from(memoryDb.components.values()).filter(
      (c) => c.slug === slug,
    );
    if (matches.length === 0) return null;
    const published = matches.find((c) => c.status === "published");
    return published || matches[matches.length - 1];
  },

  async getComponentById(id: string): Promise<DbComponent | null> {
    memoryDb.loadFromDisk();
    return memoryDb.components.get(id) || null;
  },

  async createComponent(data: {
    slug: string;
    name: string;
    description: string;
    category: string;
    accessLevel: "free" | "premium";
    status?: "draft" | "published" | "unpublished";
  }): Promise<DbComponent> {
    memoryDb.loadFromDisk();
    const id = `comp_${crypto.randomUUID()}`;
    const comp: DbComponent = {
      id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      category: data.category,
      accessLevel: data.accessLevel,
      status: data.status || "draft",
      currentVersionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryDb.components.set(id, comp);
    memoryDb.saveToDisk();
    return comp;
  },

  async updateComponentStatus(
    id: string,
    status: "draft" | "published" | "unpublished",
    currentVersionId?: string,
  ): Promise<DbComponent | null> {
    memoryDb.loadFromDisk();
    const comp = memoryDb.components.get(id);
    if (!comp) return null;
    comp.status = status;
    if (currentVersionId) comp.currentVersionId = currentVersionId;
    comp.updatedAt = new Date();
    memoryDb.components.set(id, comp);
    memoryDb.saveToDisk();
    return comp;
  },

  // Versions
  async createComponentVersion(data: {
    componentId: string;
    version: string;
    bundleJson: ComponentBundle;
  }): Promise<DbComponentVersion> {
    memoryDb.loadFromDisk();
    const id = `ver_${crypto.randomUUID()}`;
    const bundleString = JSON.stringify(data.bundleJson);
    const bundleHash = crypto
      .createHash("sha256")
      .update(bundleString)
      .digest("hex");

    const versionRecord: DbComponentVersion = {
      id,
      componentId: data.componentId,
      version: data.version,
      bundleJson: data.bundleJson,
      bundleHash,
      createdAt: new Date(),
    };
    memoryDb.versions.set(id, versionRecord);
    memoryDb.saveToDisk();
    return versionRecord;
  },

  async getVersionById(id: string): Promise<DbComponentVersion | null> {
    memoryDb.loadFromDisk();
    return memoryDb.versions.get(id) || null;
  },

  async getLatestVersionForComponent(
    componentId: string,
  ): Promise<DbComponentVersion | null> {
    memoryDb.loadFromDisk();
    const comp = memoryDb.components.get(componentId);
    if (comp && comp.currentVersionId) {
      return memoryDb.versions.get(comp.currentVersionId) || null;
    }
    const allVersions = Array.from(memoryDb.versions.values()).filter(
      (v) => v.componentId === componentId,
    );
    if (allVersions.length === 0) return null;
    return allVersions[allVersions.length - 1];
  },

  // Customers
  async getCustomerByEmail(email: string): Promise<DbCustomer | null> {
    memoryDb.loadFromDisk();
    const cust = Array.from(memoryDb.customers.values()).find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    return cust || null;
  },

  async getCustomerById(id: string): Promise<DbCustomer | null> {
    memoryDb.loadFromDisk();
    return memoryDb.customers.get(id) || null;
  },

  async createCustomer(data: {
    email: string;
    passwordHash: string;
    isPremium?: boolean;
  }): Promise<DbCustomer> {
    memoryDb.loadFromDisk();
    const id = `cust_${crypto.randomUUID()}`;
    const cust: DbCustomer = {
      id,
      email: data.email,
      passwordHash: data.passwordHash,
      isPremium: data.isPremium ?? false,
      premiumGrantedAt: data.isPremium ? new Date() : null,
      premiumRevokedAt: null,
      createdAt: new Date(),
    };
    memoryDb.customers.set(id, cust);
    memoryDb.saveToDisk();
    return cust;
  },

  async updateCustomerPremiumStatus(
    id: string,
    isPremium: boolean,
  ): Promise<DbCustomer | null> {
    memoryDb.loadFromDisk();
    const cust = memoryDb.customers.get(id);
    if (!cust) return null;
    cust.isPremium = isPremium;
    if (isPremium) {
      cust.premiumGrantedAt = new Date();
      cust.premiumRevokedAt = null;
    } else {
      cust.premiumRevokedAt = new Date();
    }
    memoryDb.customers.set(id, cust);
    memoryDb.saveToDisk();
    return cust;
  },

  async getCustomers(): Promise<DbCustomer[]> {
    memoryDb.loadFromDisk();
    return Array.from(memoryDb.customers.values());
  },

  // Access Tokens
  async createAccessToken(data: {
    customerId: string;
    name: string;
    hashedToken: string;
  }): Promise<DbAccessToken> {
    memoryDb.loadFromDisk();
    const id = `tok_${crypto.randomUUID()}`;
    const tok: DbAccessToken = {
      id,
      customerId: data.customerId,
      name: data.name,
      hashedToken: data.hashedToken,
      revokedAt: null,
      lastUsedAt: null,
      createdAt: new Date(),
    };
    memoryDb.tokens.set(id, tok);
    memoryDb.saveToDisk();
    return tok;
  },

  async getCustomerByToken(hashedToken: string): Promise<DbCustomer | null> {
    memoryDb.loadFromDisk();
    const tok = Array.from(memoryDb.tokens.values()).find(
      (t) => t.hashedToken === hashedToken && !t.revokedAt,
    );
    if (!tok) return null;
    tok.lastUsedAt = new Date();
    memoryDb.tokens.set(tok.id, tok);
    memoryDb.saveToDisk();
    return memoryDb.customers.get(tok.customerId) || null;
  },

  async getCustomerTokens(customerId: string): Promise<DbAccessToken[]> {
    memoryDb.loadFromDisk();
    return Array.from(memoryDb.tokens.values()).filter(
      (t) => t.customerId === customerId && !t.revokedAt,
    );
  },

  async revokeToken(tokenId: string, customerId: string): Promise<boolean> {
    memoryDb.loadFromDisk();
    const tok = memoryDb.tokens.get(tokenId);
    if (!tok || tok.customerId !== customerId) return false;
    tok.revokedAt = new Date();
    memoryDb.tokens.set(tokenId, tok);
    memoryDb.saveToDisk();
    return true;
  },

  // Audit Logs
  async logAudit(data: {
    actor: string;
    action: string;
    resource: string;
    metadata?: Record<string, any>;
  }): Promise<DbAuditLog> {
    memoryDb.loadFromDisk();
    const log: DbAuditLog = {
      id: `audit_${crypto.randomUUID()}`,
      actor: data.actor,
      action: data.action,
      resource: data.resource,
      timestamp: new Date(),
      metadata: data.metadata || null,
    };
    memoryDb.auditLogs.unshift(log);
    memoryDb.saveToDisk();
    return log;
  },

  async getAuditLogs(): Promise<DbAuditLog[]> {
    memoryDb.loadFromDisk();
    return memoryDb.auditLogs;
  },
};
