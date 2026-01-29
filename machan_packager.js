import fs from "fs/promises";

async function packageFiles(inputFiles, outputFile) {
  try {
    console.log("🚀 Machan Packager: Starting bundle...");
    const fileContents = [];
    const externalImports = new Set();
    let shebang = "#!/usr/bin/env node";

    for (const inputFile of inputFiles) {
      console.log(`  - Adding ${inputFile}...`);
      let content = await fs.readFile(inputFile, "utf-8");

      // 1. Remove shebangs
      content = content.replace(/^#!.*\n/, "");

      // 2. Remove LOCAL imports (multi-line supported)
      content = content.replace(/import\s+[\s\S]*?\s+from\s+['"]\.\.?\/.*?['"];?/g, "");
      content = content.replace(/import\s+['"]\.\.?\/.*?['"];?/g, "");

      // 3. Extract and remove EXTERNAL imports
      // Pattern matches: import ... from "pkg" where pkg doesn't start with .
      const extImportRegex = /import\s+[\s\S]*?\s+from\s+['"](?!\.)([^'"]+)['"];?/g;
      
      let match;
      while ((match = extImportRegex.exec(content)) !== null) {
        externalImports.add(match[0].trim());
      }
      content = content.replace(extImportRegex, "");

      // 4. Strip 'export' keywords
      content = content.replace(/\bexport\b/g, "");

      fileContents.push(`\n// --- Source: ${inputFile} ---\n${content}`);
    }

    const bundle = [
      shebang,
      Array.from(externalImports).join("\n"),
      ...fileContents
    ].join("\n");

    await fs.writeFile(outputFile, bundle);

    console.log(`✅ Success! MachanScript bundled into ${outputFile}`);
    console.log(`📦 Ready for NPM registry.`);
  } catch (err) {
    console.error("❌ Packaging Failed:", err);
  }
}

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
  "./main.js",
];

const outputFile = "index.js";
packageFiles(inputFiles, outputFile);
