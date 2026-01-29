import fs from "fs/promises";

const inputFiles = [
  "./runtime/values.js",
  "./frontend/lexer.js",
  "./frontend/ast.js",
  "./frontend/parser.js",
  "./runtime/environment.js",
  "./runtime/eval/expressions.js",
  "./runtime/eval/statements.js",
  "./runtime/machan_native_functions.js",
  "./runtime/interpreter.js",
  "./main.js"
];

async function simpleBundle() {
  try {
    console.log("🚀 Machan Packager: Starting simple bundle...");
    let body = "";

    for (const file of inputFiles) {
      console.log(`  - Adding ${file}...`);
      let content = await fs.readFile(file, "utf-8");

      // 1. Remove shebangs
      content = content.replace(/^#!.*\n/g, "");

      // 2. Aggressively remove EVERY 'import' and 'export' block to avoid SyntaxErrors
      // This regex hits multi-line blocks and single-line statements
      content = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
      content = content.replace(/import\s+['"][^'"]+['"];?/g, "");
      
      // Remove 'export' keyword but keep the logic (the variable/function declaration)
      content = content.replace(/\bexport\s+default\s+/g, "");
      content = content.replace(/\bexport\s+(const|class|let|var|function|async)\b/g, "$1");
      
      // Cleanup residual export blocks like 'export { ... };'
      content = content.replace(/\bexport\s+\{[\s\S]*?\};?/g, "");

      body += `\n// --- Source: ${file} ---\n${content}\n`;
    }

    const header = `#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs/promises";
import inquirer from "inquirer";
import figlet from "figlet";
import readline from "readline";
import ps from "prompt-sync";
`;

    await fs.writeFile("index.js", header + body);
    console.log("✅ Success! MachanScript bundled into index.js");
  } catch (err) {
    console.error("❌ Packaging Failed:", err);
  }
}

simpleBundle();
