import { ArrayVal, MK_NULL, NumberVal, StringVal } from "./values.js";
import { evaluate } from "./interpreter.js";
import ps from "prompt-sync";
import { TokenType } from "../frontend/lexer.js";

// Define the para function
const para_native_function = (args, env) => {
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
        output += "Unsupported argument type for para function.";
        break;
    }
  }
  console.log(output);
  return MK_NULL();
};

export const veluthu_native_function = (args, env) => {
  if (args.length < 2) {
    console.error("veluthu function expects at least 2 arguments.");
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
      "veluthu function expects at least one number as an argument."
    );
    return MK_NULL();
  }

  const largest = Math.max(...numbers);
  const largestVal = new NumberVal(largest);
  env.declareVar(varName, largestVal, false);
  return largestVal;
};

export const cheruthu_native_function = (args, env) => {
  if (args.length < 2) {
    console.error("cheruthu function expects at least 2 arguments.");
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
      "cheruthu function expects at least one number as an argument."
    );
    return MK_NULL();
  }

  const smallest = Math.min(...numbers);
  const smallestVal = new NumberVal(smallest);
  env.declareVar(varName, smallestVal, false);
  return smallestVal;
};

export const input_eduku_native_function = (args, env) => {
  if (args.length !== 2) {
    console.error("input function expects exactly 2 arguments.");
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
    console.log("Regular value parsing...");
    let evaluatedValue;
    if (!isNaN(value)) {
      evaluatedValue = new NumberVal(Number(value));
    } else {
      evaluatedValue = new StringVal(value);
    }

    env.declareVar(varName, evaluatedValue, false);
  }
};

export const inathe_date_native_function = (args, env) => {
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

const nativeFunctionRegistry = {
  para: para_native_function,
  veluthu: veluthu_native_function,
  cheruthu: cheruthu_native_function,
  input_eduku: input_eduku_native_function,
  inathe_date: inathe_date_native_function,
};

// Function to call a native function
export const call_native_function = (name, args, env) => {
  const nativeFunction = nativeFunctionRegistry[name];
  if (nativeFunction) {
    return nativeFunction(args, env);
  } else {
    console.error(`Native function '${name}' is not defined.`);
    return MK_NULL();
  }
};
