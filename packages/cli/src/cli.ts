#!/usr/bin/env node

import { Command } from "commander";
import { installComponent } from "./installer";

const program = new Command();

program
  .name("tech-inject")
  .description("Tech Inject Component Library CLI Installer")
  .version("1.0.0");

program
  .command("add <slug>")
  .description("Install a component from Tech Inject Design Library")
  .option(
    "-r, --registry <url>",
    "Registry API Base URL",
    process.env.NEXT_PUBLIC_CATALOGUE_URL || "http://localhost:3000",
  )
  .option(
    "-t, --token <token>",
    "Catalogue Authentication Token (for premium components)",
  )
  .option(
    "-o, --overwrite",
    "Overwrite existing component files if they exist",
    false,
  )
  .option("-c, --cwd <path>", "Consumer project root directory", process.cwd())
  .action(async (slug: string, options: any) => {
    try {
      await installComponent({
        slug,
        targetDir: options.cwd,
        registryUrl: options.registry,
        token: options.token,
        overwrite: options.overwrite,
      });
    } catch (err: any) {
      console.error(`\x1b[31m[CLI Error]\x1b[0m ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
