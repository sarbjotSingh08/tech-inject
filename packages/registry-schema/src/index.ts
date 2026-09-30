import { z } from "zod";

export const SupportedExtensionSchema = z.enum([
  ".tsx",
  ".ts",
  ".css",
  ".json",
]);
export type SupportedExtension = z.infer<typeof SupportedExtensionSchema>;

export const FileTypeSchema = z.enum(["component", "style", "theme", "util"]);
export type FileType = z.infer<typeof FileTypeSchema>;

export const ComponentAccessSchema = z.enum(["free", "premium"]);
export type ComponentAccess = z.infer<typeof ComponentAccessSchema>;

export const ComponentCategorySchema = z.enum([
  "buttons",
  "inputs",
  "data-display",
  "tables",
  "cards",
  "navigation",
  "feedback",
  "layouts",
]);
export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;

export const SemVerSchema = z
  .string()
  .regex(
    /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+)?$/,
    {
      message: "Must be a valid SemVer string (e.g., 1.0.0)",
    },
  );

export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message:
    "Slug must consist of lowercase letters, numbers, and single hyphens",
});

// Path safety validation helper
export function isSafePath(path: string): { safe: boolean; reason?: string } {
  if (typeof path !== "string" || !path.trim()) {
    return { safe: false, reason: "Path must be a non-empty string" };
  }

  if (path.includes("\0")) {
    return { safe: false, reason: "Path contains null bytes" };
  }

  if (path.includes("\\")) {
    return {
      safe: false,
      reason: "Path contains backslashes. Use forward slashes only",
    };
  }

  if (path.startsWith("/")) {
    return { safe: false, reason: "Absolute paths are not allowed" };
  }

  if (/^[a-zA-Z]:/.test(path)) {
    return { safe: false, reason: "Windows drive letters are not allowed" };
  }

  if (path.startsWith(".")) {
    return {
      safe: false,
      reason: "Leading-dot paths (e.g. ./ or .env) are not allowed",
    };
  }

  const parts = path.split("/");
  for (const part of parts) {
    if (part === "..") {
      return {
        safe: false,
        reason: "Parent directory traversal (..) is not allowed",
      };
    }
    if (part === "." || part === "") {
      return {
        safe: false,
        reason: "Empty or dot path segments are not allowed",
      };
    }
  }

  const hasValidExt = [".tsx", ".ts", ".css", ".json"].some((ext) =>
    path.endsWith(ext),
  );
  if (!hasValidExt) {
    return {
      safe: false,
      reason: "File extension must be one of: .tsx, .ts, .css, .json",
    };
  }

  return { safe: true };
}

export const BundleFileSchema = z.object({
  path: z.string().superRefine((path, ctx) => {
    const check = isSafePath(path);
    if (!check.safe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: check.reason || "Unsafe file path",
      });
    }
  }),
  content: z
    .string()
    .max(512 * 1024, { message: "Individual file size must not exceed 512KB" }),
  type: FileTypeSchema,
});

export type BundleFile = z.infer<typeof BundleFileSchema>;

// Dependency checking helpers
function validateDependencyValue(
  depName: string,
  versionSpec: string,
): string | null {
  if (
    versionSpec.startsWith("git+") ||
    versionSpec.startsWith("git://") ||
    versionSpec.includes(".git")
  ) {
    return `Dependency "${depName}" uses git dependency (${versionSpec}) which is not allowed.`;
  }
  if (versionSpec.startsWith("http://") || versionSpec.startsWith("https://")) {
    return `Dependency "${depName}" uses URL dependency (${versionSpec}) which is not allowed.`;
  }
  if (
    versionSpec.startsWith("file:") ||
    versionSpec.startsWith("link:") ||
    versionSpec.startsWith("portal:")
  ) {
    return `Dependency "${depName}" uses local file dependency (${versionSpec}) which is not allowed.`;
  }
  return null;
}

export const ComponentBundleSchema = z
  .object({
    slug: SlugSchema,
    name: z.string().min(1, "Name is required").max(100),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500),
    category: ComponentCategorySchema,
    version: SemVerSchema,
    access: ComponentAccessSchema,
    npmDependencies: z.record(z.string(), z.string()).default({}),
    registryDependencies: z.array(SlugSchema).default([]),
    files: z
      .array(BundleFileSchema)
      .min(1, "Bundle must contain at least one file")
      .max(50, "Maximum 50 files allowed per bundle"),
    documentation: z
      .string()
      .min(10, "Documentation must be at least 10 characters"),
    example: z.string().min(5, "Example code is required"),
    thumbnail: z.string().nullable().optional(),
  })
  .superRefine((bundle, ctx) => {
    // 1. Check duplicate file paths
    const seenPaths = new Set<string>();
    for (const file of bundle.files) {
      if (seenPaths.has(file.path)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate file path "${file.path}" in bundle`,
        });
      }
      seenPaths.add(file.path);
    }

    // 2. Check total bundle size limit (2 MB)
    let totalSize = 0;
    for (const file of bundle.files) {
      totalSize += Buffer.byteLength(file.content, "utf8");
    }
    if (totalSize > 2 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total bundle size (${Math.round(totalSize / 1024)}KB) exceeds maximum allowed size of 2MB`,
      });
    }

    // 3. Validate npmDependencies
    if (bundle.npmDependencies) {
      for (const [depName, versionSpec] of Object.entries(
        bundle.npmDependencies,
      )) {
        const error = validateDependencyValue(depName, versionSpec);
        if (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error,
          });
        }
      }
    }

    // 4. Validate registryDependencies (no self-dependency)
    if (bundle.registryDependencies) {
      for (const regDep of bundle.registryDependencies) {
        if (regDep === bundle.slug) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Component cannot depend on itself in registryDependencies (${bundle.slug})`,
          });
        }
      }
    }
  });

export type ComponentBundle = z.infer<typeof ComponentBundleSchema>;

// Validate bundle helper returning formatted errors
export function validateComponentBundle(data: unknown): {
  success: boolean;
  data?: ComponentBundle;
  errors?: string[];
} {
  const result = ComponentBundleSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map(
      (err) => `${err.path.join(".") || "root"}: ${err.message}`,
    );
    return { success: false, errors };
  }
}
