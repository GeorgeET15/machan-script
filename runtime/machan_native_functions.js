import { MK_NULL, NumberVal, StringVal } from "./values.js";
import { evaluate } from "./interpreter.js";
import ps from "prompt-sync";

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

  const varName = args[0].value;
  const promptMessage = args[1].value;
  const prompt = ps();

  const value = prompt(promptMessage);
  let evaluatedValue;
  if (!isNaN(value)) {
    evaluatedValue = new NumberVal(Number(value));
  } else {
    evaluatedValue = new StringVal(value);
  }

  for (const statement of args) {
    if (statement.kind === "Identifier") {
      let varName = statement.symbol;
      return env.declareVar(varName, evaluatedValue, false);
    }
  }
};

const nativeFunctionRegistry = {
  para: para_native_function,
  veluthu: veluthu_native_function,
  cheruthu: cheruthu_native_function,
  input_eduku: input_eduku_native_function,
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
