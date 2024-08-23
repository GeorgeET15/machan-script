#!/usr/bin/env node
import fs from "fs/promises";
import inquirer from "inquirer";
import figlet from "figlet";
import chalk from "chalk";
import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { Environment } from "./runtime/environment.js";
import readline from "readline";

const yellow = chalk.hex("#fbde4d");
const red = chalk.bold.hex("#a00");

// Function to animate text
const typeText = async (text, delay = 100) => {
  let i = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      process.stdout.write(text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        console.log();
        resolve();
      }
    }, delay);
  });
};

const startREPL = () => {
  const parser = new Parser();
  const env = new Environment();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: yellow(">> "),
  });

  let codeBuffer = [];

  rl.prompt();

  rl.on("line", (line) => {
    if (line.trim() === "exit") {
      rl.close();
    } else if (line.trim() === "") {
      // If the user enters a blank line, assume they are done entering code
      const fullCode = codeBuffer.join("\n");
      codeBuffer = []; // Clear the buffer

      try {
        const program = parser.produceAST({ sourceCode: fullCode });
        const result = evaluate(program, env);
        // if (result !== undefined) {
        //   console.log(yellow(result));
        // }
      } catch (error) {
        console.error(
          chalk.red("Machane pani kitti: ") + chalk.yellow(error.message)
        );
      }

      rl.setPrompt(yellow(">> "));
      rl.prompt();
    } else {
      // Add the line to the buffer and continue reading input
      codeBuffer.push(line);
      rl.setPrompt(yellow(".. "));
      rl.prompt();
    }
  }).on("close", () => {
    console.log(chalk.green("\nSheri Enna!"));
    // Do not call process.exit here to keep the program running
  });
};

// Main CLI function to execute a script file
const machan_script_cli = async (filePath) => {
  const parser = new Parser();
  const env = new Environment();

  try {
    const input = await fs.readFile(filePath, "utf-8");
    const lines = input.split("\n");

    if (lines[0].trim() !== "Machane!!") {
      console.log(chalk.yellow("The first line should be Machane!!"));
      return;
    }

    const scriptContent = lines.slice(1).join("\n");
    const program = parser.produceAST({ sourceCode: scriptContent });

    await evaluate(program, env);
  } catch (error) {
    console.error(
      chalk.red("Machane pani kitti: ") + chalk.yellow(error.message)
    );
  }
};

// Function to get file path interactively
const getFilePath = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "filePath",
      message: chalk.cyan("📄 Machane file name adiku:"),
      default: "./src.ms",
      validate: (input) => {
        if (!input) {
          return chalk.yellow(" ⚠️ Please enter a file path.");
        }
        return true;
      },
    },
  ]);
  return answers.filePath;
};

// Function to show welcome message
const showWelcomeMessage = async () => {
  console.log(
    yellow(figlet.textSync("MachanScript", { horizontalLayout: "full" }))
  );
  console.log(red("Welcome to MachanScript V3.0\n"));
  await typeText(
    chalk.gray("A adipoli programming language written in Javascript.")
  );
};

// Main script execution
const fileNameArg = process.argv[2];

if (fileNameArg) {
  machan_script_cli(fileNameArg);
} else {
  await showWelcomeMessage(); // Ensure welcome message is shown before prompting

  const isInteractive = await inquirer.prompt([
    {
      type: "confirm",
      name: "replMode",
      message: chalk.cyan("🚀 Do you want to code in MachanScript cli?"),
      default: true,
    },
  ]);

  if (isInteractive.replMode) {
    startREPL();
  } else {
    const filePath = await getFilePath();
    machan_script_cli(filePath);
  }
}
