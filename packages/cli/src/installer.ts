import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export interface InstallOptions {
  slug: string;
  targetDir: string; // root of consumer project
  registryUrl: string;
  token?: string;
  overwrite?: boolean;
}

export function verifyPathContainment(
  targetProjectDir: string,
  relativePath: string,
): string {
  if (!relativePath || typeof relativePath !== "string") {
    throw new Error("Invalid relative path");
  }

  // Reject suspicious characters
  if (relativePath.includes("\0")) {
    throw new Error("Path contains null byte escape");
  }

  if (relativePath.includes("\\")) {
    throw new Error("Path contains backslashes");
  }

  if (path.isAbsolute(relativePath)) {
    throw new Error(`Absolute path "${relativePath}" is forbidden`);
  }

  if (relativePath.startsWith(".")) {
    throw new Error(`Leading dot path "${relativePath}" is forbidden`);
  }

  const normalized = path.normalize(relativePath);
  if (normalized.startsWith("..") || normalized.includes(`..${path.sep}`)) {
    throw new Error(`Path traversal attempt detected in "${relativePath}"`);
  }

  const resolved = path.resolve(targetProjectDir, relativePath);
  const resolvedProject = path.resolve(targetProjectDir);

  if (!resolved.startsWith(resolvedProject)) {
    throw new Error(`Path "${relativePath}" escapes consumer project boundary`);
  }

  return resolved;
}

export function detectPackageManager(
  projectDir: string,
): "pnpm" | "yarn" | "bun" | "npm" {
  if (fs.existsSync(path.join(projectDir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectDir, "yarn.lock"))) return "yarn";
  if (
    fs.existsSync(path.join(projectDir, "bun.lockb")) ||
    fs.existsSync(path.join(projectDir, "bun.lock"))
  )
    return "bun";
  return "npm";
}

export async function installComponent(options: InstallOptions) {
  const { slug, targetDir, registryUrl, token, overwrite } = options;

  console.log(
    `[CLI] Fetching component "${slug}" from registry ${registryUrl}...`,
  );

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const authToken = token || process.env.CATALOGUE_TOKEN;
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const fetchUrl = `${registryUrl.replace(/\/$/, "")}/api/components/${slug}`;
  let response;
  try {
    response = await fetch(fetchUrl, { headers });
  } catch (err: any) {
    throw new Error(
      `Failed to connect to catalogue registry at ${fetchUrl}: ${err.message}`,
    );
  }

  if (!response.ok) {
    let errorMsg = `Registry request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const bundleData = await response.json();
  const bundle = bundleData.bundle || bundleData;

  if (!bundle || !bundle.files || !Array.isArray(bundle.files)) {
    throw new Error("Invalid component response structure from registry");
  }

  // 1. Recursive installation of registryDependencies
  if (
    bundle.registryDependencies &&
    Array.isArray(bundle.registryDependencies)
  ) {
    for (const depSlug of bundle.registryDependencies) {
      if (depSlug !== slug) {
        console.log(
          `[CLI] Installing required registry dependency "${depSlug}"...`,
        );
        await installComponent({
          ...options,
          slug: depSlug,
        });
      }
    }
  }

  // 2. Write files into consumer component directory
  const componentDestDir = path.join(
    targetDir,
    "src",
    "components",
    "tech-inject",
    slug,
  );

  for (const file of bundle.files) {
    const destPath = verifyPathContainment(
      targetDir,
      path.join("src", "components", "tech-inject", slug, file.path),
    );

    if (fs.existsSync(destPath) && !overwrite) {
      throw new Error(
        `File "${file.path}" already exists at ${destPath}. Use --overwrite to overwrite.`,
      );
    }

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, file.content, "utf8");
    console.log(`[CLI] Wrote file: ${path.relative(targetDir, destPath)}`);
  }

  // 3. Install npmDependencies if present
  if (
    bundle.npmDependencies &&
    Object.keys(bundle.npmDependencies).length > 0
  ) {
    const pm = detectPackageManager(targetDir);
    const deps = Object.entries(bundle.npmDependencies)
      .map(([pkg, ver]) => `${pkg}@${ver}`)
      .join(" ");

    console.log(`[CLI] Installing npm dependencies (${deps}) using ${pm}...`);
    try {
      if (pm === "pnpm") {
        execSync(`pnpm add ${deps}`, { cwd: targetDir, stdio: "inherit" });
      } else if (pm === "yarn") {
        execSync(`yarn add ${deps}`, { cwd: targetDir, stdio: "inherit" });
      } else if (pm === "bun") {
        execSync(`bun add ${deps}`, { cwd: targetDir, stdio: "inherit" });
      } else {
        execSync(`npm install ${deps}`, { cwd: targetDir, stdio: "inherit" });
      }
    } catch (e: any) {
      console.warn(
        `[CLI Warning] Automated npm dependency installation failed: ${e.message}. Please install manually: ${deps}`,
      );
    }
  }

  console.log(`[CLI Success] Component "${slug}" installed successfully!`);
}
