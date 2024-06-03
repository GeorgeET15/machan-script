import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { Environment } from "./runtime/environment.js";
import { MK_NUMBER } from "./runtime/values.js";
import chalk from "chalk";

// Define the path to the input file
const filePath = "./src.ms"; // Update this to the path of your input file

const repl = async () => {
  const parser = new Parser();
  const env = new Environment();

  // Corrected the declaration syntax
  env.declareVar("x", MK_NUMBER(100));

  console.log(chalk.cyanBright("\nMachanScript V0.1"));

  // Read the input from the text file
  try {
    const input = await Deno.readTextFile(filePath);
    const lines = input.split("\n").filter((line) => line.trim() !== "");

    // Check if the first line is "Start"
    if (lines.length > 0 && lines[0].trim() !== "Machane!!") {
      console.log("Starting something special...");
      lines.shift();
      return;
    } else {
      lines.shift();
    }

    for (const line of lines) {
      try {
        const program = parser.produceAST({ sourceCode: line });
        evaluate(program, env);
        // console.log(result); // Print the evaluation result
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Failed to read the input file:", error);
  }
};

repl();
