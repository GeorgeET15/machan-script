#!/usr/bin/env node

import fs from "fs/promises";
import inquirer from "inquirer";
import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { Environment } from "./runtime/environment.js";
import chalk from "chalk";

const machan_script_cli = async (filePath) => {
  const parser = new Parser();
  const env = new Environment();

  try {
    const input = await fs.readFile(filePath, "utf-8");
    const lines = input.split("\n");

    if (lines[0].trim() !== "Machane!!") {
      console.log(
        chalk.red("The first line should be ") + chalk.yellow("Machane!!")
      );
      return;
    }

    const scriptContent = lines.slice(1).join("\n");
    const program = parser.produceAST({ sourceCode: scriptContent });
    await evaluate(program, env);
  } catch (error) {
    console.error(chalk.red("Error processing script:"), error.message);
  }
};

const getFilePath = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "filePath",
      message: "Machane file name adiku:",
      default: "./src.ms",
      validate: (input) => {
        if (!input) {
          return "Please enter a file path.";
        }
        return true;
      },
    },
  ]);
  return answers.filePath;
};
const fileNameArg = process.argv[2];

if (fileNameArg) {
  machan_script_cli(fileNameArg);
} else {
  console.log(chalk.bold.magenta("\nWelcome to MachanScript V0.1\n"));

  (async () => {
    const filePath = await getFilePath();
    console.log("\n");
    machan_script_cli(filePath);
  })();
}
