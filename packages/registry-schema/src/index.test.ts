import { describe, it, expect } from "vitest";
import { validateComponentBundle, isSafePath } from "./index";

describe("isSafePath", () => {
  it("accepts valid paths", () => {
    expect(isSafePath("components/Button.tsx").safe).toBe(true);
    expect(isSafePath("styles/theme.css").safe).toBe(true);
    expect(isSafePath("utils/helpers.ts").safe).toBe(true);
  });

  it("rejects absolute paths, traversal, null bytes, backslashes", () => {
    expect(isSafePath("/components/Button.tsx").safe).toBe(false);
    expect(isSafePath("components/../Button.tsx").safe).toBe(false);
    expect(isSafePath("components\\Button.tsx").safe).toBe(false);
    expect(isSafePath("components/Button\0.tsx").safe).toBe(false);
    expect(isSafePath(".env").safe).toBe(false);
    expect(isSafePath("./components/Button.tsx").safe).toBe(false);
    expect(isSafePath("components/Button.exe").safe).toBe(false);
  });
});

describe("validateComponentBundle", () => {
  const validBundle = {
    slug: "button",
    name: "Button",
    description:
      "A clean reusable button component designed with Sales CRM theme.",
    category: "buttons",
    version: "1.0.0",
    access: "free",
    npmDependencies: {
      "lucide-react": "^0.300.0",
    },
    registryDependencies: [],
    files: [
      {
        path: "Button.tsx",
        content: "export const Button = () => <button>Click</button>;",
        type: "component",
      },
    ],
    documentation: "# Button\n\nUsage instructions for the Button component.",
    example: "<Button>Click me</Button>",
    thumbnail: null,
  };

  it("validates a correct bundle", () => {
    const result = validateComponentBundle(validBundle);
    expect(result.success).toBe(true);
    expect(result.data?.slug).toBe("button");
  });

  it("rejects self-dependency in registryDependencies", () => {
    const invalid = {
      ...validBundle,
      registryDependencies: ["button"],
    };
    const result = validateComponentBundle(invalid);
    expect(result.success).toBe(false);
    expect(result.errors?.some((e) => e.includes("depend on itself"))).toBe(
      true,
    );
  });

  it("rejects git and file dependencies in npmDependencies", () => {
    const invalidGit = {
      ...validBundle,
      npmDependencies: {
        mylib: "git+https://github.com/foo/bar.git",
      },
    };
    expect(validateComponentBundle(invalidGit).success).toBe(false);

    const invalidFile = {
      ...validBundle,
      npmDependencies: {
        mylib: "file:../mylib",
      },
    };
    expect(validateComponentBundle(invalidFile).success).toBe(false);
  });

  it("rejects duplicate file paths", () => {
    const invalidDup = {
      ...validBundle,
      files: [
        { path: "Button.tsx", content: "c1", type: "component" },
        { path: "Button.tsx", content: "c2", type: "component" },
      ],
    };
    const result = validateComponentBundle(invalidDup);
    expect(result.success).toBe(false);
    expect(result.errors?.some((e) => e.includes("Duplicate file path"))).toBe(
      true,
    );
  });
});
