import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { Environment } from "./runtime/environment.js";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./runtime/values.js";

// Define the path to the input file
const filePath = "./input.txt"; // Update this to the path of your input file

const repl = async () => {
  const parser = new Parser();
  const env = new Environment();

  // Corrected the declaration syntax
  env.declareVar("x", MK_NUMBER(100));
  env.declareVar("true", MK_BOOL(true));
  env.declareVar("false", MK_BOOL(false));
  env.declareVar("null", MK_NULL());

  console.log("\nRepl V0.1");

  // Read the input from the text file
  try {
    const input = await Deno.readTextFile(filePath);
    const lines = input.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      try {
        const program = parser.produceAST({ sourceCode: line });
        const result = evaluate(program, env);
        console.log(result); // Print the evaluation result
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Failed to read the input file:", error);
  }
};

repl();


ipo (x > y) anengi {

} alengi {}