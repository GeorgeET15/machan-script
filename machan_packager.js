import fs from "fs";

async function packageFiles(inputFiles, outputFile) {
  try {
    const fileContents = [];

    const exportRegex = /\bexport\b/g;
    const importRegex = /\bimport .*?;/g;

    await Promise.all(
      inputFiles.map(async (inputFile) => {
        let content = await fs.promises.readFile(inputFile, "utf-8");

        content = content.replace(exportRegex, "");

        content = content.replace(importRegex, "");
        fileContents.push(content);
      })
    );

    const concatenatedContent = fileContents.join("\n");

    await fs.promises.writeFile(outputFile, concatenatedContent);

    console.log(`Files packaged successfully into ${outputFile}`);
  } catch (err) {
    console.error("Error packaging files:", err);
  }
}

const inputFiles = [
  "./main.js",
  "./frontend/lexer.js",
  "./frontend/ast.js",
  "./frontend/parser.js",
  "./runtime/eval/expressions.js",
  "./runtime/eval/statements.js",
  "./runtime/environment.js",
  "./runtime/values.js",
  "./runtime/machan_native_functions.js",
  "./runtime/interpreter.js",
];
const outputFile = "index.js";
packageFiles(inputFiles, outputFile);
