import { describe, it, expect } from "vitest";
import { verifyPathContainment } from "./installer";
import path from "path";

describe("CLI Path Verification", () => {
  const mockTargetDir = path.resolve("/tmp/test-project");

  it("allows safe relative paths inside project boundary", () => {
    const verified = verifyPathContainment(
      mockTargetDir,
      "src/components/tech-inject/button/Button.tsx",
    );
    expect(verified.startsWith(mockTargetDir)).toBe(true);
  });

  it("rejects absolute paths", () => {
    expect(() => verifyPathContainment(mockTargetDir, "/etc/passwd")).toThrow(
      /Absolute path/,
    );
  });

  it("rejects parent directory traversal (..)", () => {
    expect(() =>
      verifyPathContainment(mockTargetDir, "src/../../outside.ts"),
    ).toThrow(/traversal/);
  });

  it("rejects null byte escapes", () => {
    expect(() => verifyPathContainment(mockTargetDir, "Button\0.tsx")).toThrow(
      /null byte/,
    );
  });

  it("rejects backslashes", () => {
    expect(() =>
      verifyPathContainment(mockTargetDir, "src\\components\\Button.tsx"),
    ).toThrow(/backslashes/);
  });

  it("rejects leading dot paths", () => {
    expect(() => verifyPathContainment(mockTargetDir, ".env")).toThrow(
      /Leading dot/,
    );
  });
});
