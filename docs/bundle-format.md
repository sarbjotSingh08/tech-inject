# Component Bundle Specification & Registry Schema

## Overview

All components published to the Tech Inject Design Library are packaged as JSON bundle objects validated by `@tech-inject/registry-schema` using Zod. Component code is NEVER executed on the server during upload or validation.

---

## Schema Definition (`ComponentBundle`)

```typescript
interface ComponentBundle {
  slug: string; // e.g. "button", "kanban-card" (lowercase alphanumeric + hyphens)
  name: string; // e.g. "Button"
  description: string; // Minimum 10 characters
  category: ComponentCategory; // 'buttons' | 'inputs' | 'data-display' | 'tables' | 'cards' | 'navigation' | 'feedback' | 'layouts'
  version: string; // SemVer format e.g. "1.0.0"
  access: "free" | "premium"; // Component access tier
  npmDependencies: Record<string, string>; // e.g. { "lucide-react": "^0.300.0" }
  registryDependencies: string[]; // Slugs of other component bundles
  files: BundleFile[]; // 1 to 50 files
  documentation: string; // Markdown documentation
  example: string; // JSX/TSX snippet showing usage
  thumbnail?: string | null; // SVG or image data URL/link
}

interface BundleFile {
  path: string; // Relative path, e.g. "Button.tsx"
  content: string; // UTF-8 source code (max 512KB per file)
  type: "component" | "style" | "theme" | "util";
}
```

---

## Valid Bundle Example

```json
{
  "slug": "button",
  "name": "Button",
  "description": "Interactive, fully-accessible action button matching Sales CRM design language.",
  "category": "buttons",
  "version": "1.0.0",
  "access": "free",
  "npmDependencies": {
    "lucide-react": "^0.300.0",
    "clsx": "^2.1.0"
  },
  "registryDependencies": [],
  "files": [
    {
      "path": "Button.tsx",
      "content": "import React from 'react';\n\nexport interface ButtonProps {\n  children: React.ReactNode;\n  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';\n}\n\nexport const Button: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => {\n  return <button className={`ti-btn ti-btn-${variant}`}>{children}</button>;\n};",
      "type": "component"
    }
  ],
  "documentation": "# Button\n\nResponsive button with Sales CRM styling.",
  "example": "<Button variant=\"primary\">Click Me</Button>",
  "thumbnail": null
}
```

---

## Security & Validation Restrictions

1. **Path Safety Verification**:
   - MUST NOT contain backslashes (`\`). Use forward slashes (`/`).
   - MUST NOT contain parent directory traversal (`..`).
   - MUST NOT contain leading dots (`./`, `.env`, `.git`).
   - MUST NOT be absolute paths (`/etc/passwd`, `C:\...`).
   - MUST NOT contain null bytes (`\0`).
   - MUST use valid extensions: `.tsx`, `.ts`, `.css`, `.json`.

2. **Dependency Restrictions**:
   - `npmDependencies` MUST NOT use Git URLs (`git+https://`, `git://`).
   - `npmDependencies` MUST NOT use arbitrary web URLs (`http://`, `https://`).
   - `npmDependencies` MUST NOT use local file paths (`file:`, `link:`, `portal:`).
   - `registryDependencies` MUST NOT contain self-referential slugs.

3. **Size & Quantity Limits**:
   - Maximum 50 files per bundle.
   - Maximum 512 KB per individual file.
   - Maximum 2 MB total bundle size.

---

## Rejected Bundle Examples

### 1. Path Traversal Attempt

```json
{
  "files": [
    {
      "path": "../../../etc/passwd.tsx",
      "content": "hacked",
      "type": "component"
    }
  ]
}
```

_Reason for rejection_: `Parent directory traversal (..) is not allowed`.

### 2. Malicious Dependency

```json
{
  "npmDependencies": {
    "bad-pkg": "git+https://github.com/hacker/malware.git"
  }
}
```

_Reason for rejection_: `Dependency "bad-pkg" uses git dependency which is not allowed`.

### 3. Self-Referential Registry Dependency

```json
{
  "slug": "card",
  "registryDependencies": ["card"]
}
```

_Reason for rejection_: `Component cannot depend on itself in registryDependencies (card)`.
