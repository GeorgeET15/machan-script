import { ArrayVal, MK_NULL, NumberVal, StringVal, ObjectVal, BoolVal } from "./values.js";
import ps from "prompt-sync";
import fs from "fs/promises";
import chalk from "chalk";

// Define the para function
const para_native_function = (args, env, evaluate) => {
  let output = "";
  for (const arg of args) {
    const evaluatedArg = evaluate(arg, env);
    switch (evaluatedArg.type) {
      case "number":
      case "string":
      case "boolean":
        output += evaluatedArg.value;
        break;
      case "array":
        if (
          arg.kind === "MemberExpression" &&
          arg.property.type === "NumericLiteral"
        ) {
          const index = Math.floor(arg.property.value);
          if (index >= 0 && index < evaluatedArg.elements.length) {
            output += evaluatedArg.elements[index];
          } else {
            output += `Index '${index}' out of bounds for array.`;
          }
        } else {
          const values = evaluatedArg.elements
            .map((element) => element.value)
            .join(", ");
          output += `[${values}]`;
        }
        break;
      default:
        chalk.yellow(
          (output += "Unsupported argument type for para function.")
        );
        break;
    }
  }
  console.log(output);
  return MK_NULL();
};

export const veluthu_native_function = (args, env, evaluate) => {
  if (args.length < 2) {
    console.error(
      chalk.yellow("veluthu function expects at least 2 arguments.")
    );
    return MK_NULL();
  }

  const varName = args.pop().symbol; // Get the variable name from the last argument
  const numbers = [];
  args.forEach((arg) => {
    const evaluatedArg = evaluate(arg, env);
    if (evaluatedArg.type === "number") {
      numbers.push(evaluatedArg.value);
    } else if (evaluatedArg.type === "array") {
      evaluatedArg.elements.forEach((element) => {
        if (element.type === "number") {
          numbers.push(element.value);
        }
      });
    }
  });

  if (numbers.length === 0) {
    console.error(
      chalk.yellow(
        "veluthu function expects at least one number as an argument."
      )
    );
    return MK_NULL();
  }

  const largest = Math.max(...numbers);
  const largestVal = new NumberVal(largest);
  env.declareVar(varName, largestVal, false);
  return largestVal;
};

export const cheruthu_native_function = (args, env, evaluate) => {
  if (args.length < 2) {
    console.error(
      chalk.yellow("cheruthu function expects at least 2 arguments.")
    );
    return MK_NULL();
  }

  const varName = args.pop().symbol; // Get the variable name from the last argument
  const numbers = [];
  args.forEach((arg) => {
    const evaluatedArg = evaluate(arg, env);
    if (evaluatedArg.type === "number") {
      numbers.push(evaluatedArg.value);
    } else if (evaluatedArg.type === "array") {
      evaluatedArg.elements.forEach((element) => {
        if (element.type === "number") {
          numbers.push(element.value);
        }
      });
    }
  });

  if (numbers.length === 0) {
    console.error(
      chalk.yellow(
        "cheruthu function expects at least one number as an argument."
      )
    );
    return MK_NULL();
  }

  const smallest = Math.min(...numbers);
  const smallestVal = new NumberVal(smallest);
  env.declareVar(varName, smallestVal, false);
  return smallestVal;
};

export const input_eduku_native_function = (args, env, evaluate) => {
  if (args.length !== 2) {
    console.error(chalk.yellow("input function expects exactly 2 arguments."));
    return MK_NULL();
  }

  const varName = args[0].symbol;
  const promptMessage = args[1].value;
  const prompt = ps();

  const value = prompt(promptMessage);

  if (value.startsWith("[") && value.endsWith("]")) {
    const arrayContent = value.substring(1, value.length - 1).trim();
    const arrayElements = arrayContent.split(",").map((item) => item.trim());

    const evaluatedElements = arrayElements.map((element) => {
      const numericValue = Number(element);
      if (!isNaN(numericValue)) {
        return new NumberVal(numericValue);
      } else {
        return new StringVal(element);
      }
    });

    const arrayValue = new ArrayVal(evaluatedElements);

    env.declareVar(varName, arrayValue, false);
  } else {
    let evaluatedValue;
    if (!isNaN(value)) {
      evaluatedValue = new NumberVal(Number(value));
    } else {
      evaluatedValue = new StringVal(value);
    }

    env.declareVar(varName, evaluatedValue, false);
  }
};

export const inathe_date_native_function = (args, env, evaluate) => {
  const includeTime = args.length > 0 ? evaluate(args[0], env).value : false;
  const varName = args.length > 1 ? args[1].symbol : null;
  const date = new Date();

  let dateString = "";
  if (includeTime) {
    dateString = date.toLocaleString();
  } else {
    dateString = date.toLocaleDateString();
  }

  if (varName) {
    const stringVal = new StringVal(dateString);
    env.declareVar(varName, stringVal, false);
  } else {
    console.log(dateString);
  }

  return MK_NULL();
};

export const vayiku_native_function = async (args, env, evaluate) => {
  if (args.length < 1 || args.length > 2) {
    console.error(chalk.yellow("vayiku function expects 1 or 2 arguments."));
    return MK_NULL();
  }

  // Evaluate arguments to handle variables
  const filePathVal = evaluate(args[0], env);
  const varNameVal = args.length === 2 ? evaluate(args[1], env) : null;

  const filePath = filePathVal.value;
  const varName = varNameVal ? varNameVal.value : null;

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const read = new StringVal(data);
    if (varName) {
      env.declareVar(varName, read, false);
    } else {
      console.log(read.value);
    }
  } catch (error) {
    console.error(chalk.yellow(`Error reading file: ${error.message}`));
    return MK_NULL();
  }
};

export const ezhuthu_native_function = async (args, env, evaluate) => {
  if (args.length !== 2) {
    console.error(
      chalk.yellow("ezhuthu function expects exactly 2 arguments.")
    );
    return MK_NULL();
  }

  const filePathVal = evaluate(args[0], env);
  const dataVal = evaluate(args[1], env);

  const filePath = filePathVal.value;
  const data = dataVal.value;

  try {
    await fs.writeFile(filePath, data, "utf-8");
    console.log(chalk.green(`Successfully wrote to file: ${filePath}`));
    return MK_NULL();
  } catch (error) {
    console.error(chalk.red(`Error writing to file: ${error.message}`));
    return MK_NULL();
  }
};

export const random_number_native_function = (args, env, evaluate) => {
  const min = args.length > 0 ? evaluate(args[0], env).value : 0;
  const max = args.length > 1 ? evaluate(args[1], env).value : 1;
  const varName = args.length > 2 ? args[2].symbol : null;

  // Ensure min and max are integers
  const intMin = Math.floor(min);
  const intMax = Math.floor(max);

  // Generate random integer between intMin (inclusive) and intMax (inclusive)
  const random = new NumberVal(
    Math.floor(Math.random() * (intMax - intMin + 1) + intMin)
  );
  if (varName) {
    env.declareVar(varName, random, false);
  } else {
    console.log(random.value);
  }

  return MK_NULL();
};

export const factorial_native_function = (args, env, evaluate) => {
  const number = args.length > 0 ? evaluate(args[0], env).value : 0;
  const varName = args.length > 1 ? args[1].symbol : null;

  const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
  const fact = new NumberVal(factorial(number));

  if (varName) {
    env.declareVar(varName, fact, false);
  } else {
    console.log(fact.value);
  }
};

export const orangu_native_function = async (args, env, evaluate) => {
  if (args.length !== 1) {
    console.error(chalk.yellow("orangu function expects exactly 1 argument."));
    return MK_NULL();
  }

  const milliseconds = args[0].value;

  if (typeof milliseconds !== "number" || milliseconds < 0) {
    console.error(
      chalk.yellow("The argument to orangu must be a non-negative number.")
    );
    return MK_NULL();
  }

  // Use non-blocking sleep instead of busy-wait
  await new Promise(resolve => setTimeout(resolve, milliseconds));

  return MK_NULL();
};

// Array Functions
export const array_push_native = (args, env) => {
  const array = args[0];
  const value = args[1];
  
  if (array.type !== "array") {
    throw new Error("First argument to array_push must be an array.");
  }
  
  array.elements.push(value);
  return new NumberVal(array.elements.length);
};

export const array_pop_native = (args, env) => {
  const array = args[0];
  
  if (array.type !== "array") {
    throw new Error("Argument to array_pop must be an array.");
  }
  
  if (array.elements.length === 0) {
    return MK_NULL();
  }
  
  return array.elements.pop();
};

export const array_length_native = (args, env) => {
  const array = args[0];
  
  if (array.type !== "array") {
    throw new Error("Argument to array_length must be an array.");
  }
  
  return new NumberVal(array.elements.length);
};

export const array_join_native = (args, env) => {
  const array = args[0];
  const separator = args.length > 1 ? args[1].value : ",";
  
  if (array.type !== "array") {
    throw new Error("First argument to array_join must be an array.");
  }
  
  const str = array.elements.map(e => e.value).join(separator);
  return new StringVal(str);
};

export const array_slice_native = (args, env) => {
  const array = args[0];
  const start = args.length > 1 ? args[1].value : 0;
  const end = args.length > 2 ? args[2].value : array.elements.length;
  
  if (array.type !== "array") {
    throw new Error("First argument to array_slice must be an array.");
  }
  
  const sliced = array.elements.slice(start, end);
  return new ArrayVal(sliced);
};

// String Functions
export const string_length_native = (args, env) => {
  const str = args[0];
  
  if (str.type !== "string") {
    throw new Error("Argument to string_length must be a string.");
  }
  
  return new NumberVal(str.value.length);
};

export const string_substring_native = (args, env) => {
  const str = args[0];
  const start = args[1].value;
  const end = args.length > 2 ? args[2].value : undefined;
  
  if (str.type !== "string") {
    throw new Error("First argument to string_substring must be a string.");
  }
  
  return new StringVal(str.value.substring(start, end));
};

export const string_upper_native = (args, env) => {
  const str = args[0];
  
  if (str.type !== "string") {
    throw new Error("Argument to string_upper must be a string.");
  }
  
  return new StringVal(str.value.toUpperCase());
};

export const string_lower_native = (args, env) => {
  const str = args[0];
  
  if (str.type !== "string") {
    throw new Error("Argument to string_lower must be a string.");
  }
  
  return new StringVal(str.value.toLowerCase());
};

export const string_split_native = (args, env) => {
  const str = args[0];
  const separator = args[1].value;
  
  if (str.type !== "string") {
    throw new Error("First argument to string_split must be a string.");
  }
  
  const parts = str.value.split(separator).map(s => new StringVal(s));
  return new ArrayVal(parts);
};

// Object Functions
export const object_keys_native = (args, env) => {
  const obj = args[0];
  
  if (obj.type !== "object") {
    throw new Error("Argument to object_keys must be an object.");
  }
  
  const keys = Array.from(obj.properties.keys()).map(k => new StringVal(k));
  return new ArrayVal(keys);
};

export const object_values_native = (args, env) => {
  const obj = args[0];
  
  if (obj.type !== "object") {
    throw new Error("Argument to object_values must be an object.");
  }
  
  const values = Array.from(obj.properties.values());
  return new ArrayVal(values);
};

export const object_has_native = (args, env) => {
  const obj = args[0];
  const key = args[1].value;
  
  if (obj.type !== "object") {
    throw new Error("First argument to object_has must be an object.");
  }
  
  return new BoolVal(obj.properties.has(key));
};

// Math Functions
export const math_sqrt_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.sqrt(num));
};

export const math_power_native = (args, env) => {
  const base = args[0].value;
  const exp = args[1].value;
  return new NumberVal(Math.pow(base, exp));
};

export const math_abs_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.abs(num));
};

export const math_round_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.round(num));
};

export const math_floor_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.floor(num));
};

export const math_ceil_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.ceil(num));
};

// Type Checking Functions
export const is_number_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "number");
};

export const is_string_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "string");
};

export const is_array_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "array");
};

export const is_object_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "object");
};

export const nativeFunctionRegistry = {
  para: para_native_function,
  veluthu: veluthu_native_function,
  cheruthu: cheruthu_native_function,
  vayiku: vayiku_native_function,
  ezhuthu: ezhuthu_native_function,
  random: random_number_native_function,
  fact: factorial_native_function,
  orangu: orangu_native_function,
  
  // Array Functions
  array_push: array_push_native,
  array_pop: array_pop_native,
  array_length: array_length_native,
  array_join: array_join_native,
  array_slice: array_slice_native,
  
  // String Functions
  string_length: string_length_native,
  string_substring: string_substring_native,
  string_upper: string_upper_native,
  string_lower: string_lower_native,
  string_split: string_split_native,
  
  // Object Functions
  object_keys: object_keys_native,
  object_values: object_values_native,
  object_has: object_has_native,
  
  // Math Functions
  sqrt: math_sqrt_native,
  power: math_power_native,
  abs: math_abs_native,
  round: math_round_native,
  floor: math_floor_native,
  ceil: math_ceil_native,
  
  // Type Checking Functions (Malayalam names)
  number_ano: is_number_native,
  string_ano: is_string_native,
  array_ano: is_array_native,
  object_ano: is_object_native,
};

// Function to call a native function
export const call_native_function = (fnName, args, env, evaluate) => {
  const fn = nativeFunctionRegistry[fnName];
  if (!fn) {
    console.error(
      chalk.red("Machane pani kitti ") +
        chalk.yellow(`Native function '${fnName}' not found.`)
    );
    return MK_NULL();
  }
  return fn(args, env, evaluate);
};
