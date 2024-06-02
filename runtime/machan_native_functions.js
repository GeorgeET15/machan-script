// Import necessary modules and classes
import { MK_NULL, NumberVal } from "./values.js";
import { evaluate } from "./interpreter.js";

// Define the para function
export const para_native_function = (args, env) => {
  for (const arg of args) {
    const evaluatedArg = evaluate(arg, env);
    switch (evaluatedArg.type) {
      case "number":
      case "string":
      case "boolean":
        console.log(evaluatedArg.value);
        break;
      case "array":
        if (
          arg.kind === "MemberExpression" &&
          arg.property.type === "NumericLiteral"
        ) {
          const index = Math.floor(arg.property.value);
          if (index >= 0 && index < evaluatedArg.elements.length) {
            console.log(evaluatedArg.elements[index]);
          } else {
            console.error(`Index '${index}' out of bounds for array.`);
          }
        } else {
          const values = evaluatedArg.elements
            .map((element) => element.value)
            .join(", ");
          console.log(`[${values}]`);
        }
        break;
      default:
        console.error("Unsupported argument type for para function.");
        break;
    }
  }
  return MK_NULL();
};

export const veluthu_native_function = (args, env) => {
  if (args.length !== 2) {
    console.error("veluthu function expects exactly 2 arguments.");
    return MK_NULL();
  }

  const arg1 = evaluate(args[0], env);
  const arg2 = evaluate(args[1], env);

  if (arg1.type !== "number" || arg2.type !== "number") {
    console.error("Both arguments to veluthu must be numbers.");
    return MK_NULL();
  }

  const largest = arg1.value > arg2.value ? arg1.value : arg2.value;
  console.log(largest);
  return new NumberVal(largest);
};

export const cheruthu_native_function = (args, env) => {
  if (args.length !== 2) {
    console.error("veluthu function expects exactly 2 arguments.");
    return MK_NULL();
  }

  const arg1 = evaluate(args[0], env);
  const arg2 = evaluate(args[1], env);

  if (arg1.type !== "number" || arg2.type !== "number") {
    console.error("Both arguments to veluthu must be numbers.");
    return MK_NULL();
  }

  const smallest = arg1.value < arg2.value ? arg1.value : arg2.value;
  console.log(smallest);
  return new NumberVal(smallest);
};

const nativeFunctionRegistry = {
  para: para_native_function,
  veluthu: veluthu_native_function,
  cheruthu: cheruthu_native_function,
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
