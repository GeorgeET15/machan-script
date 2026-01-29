import { NumberVal, MK_NULL, ObjectVal, BoolVal, ArrayVal } from "../values.js";
import { evaluate } from "../interpreter.js";
import chalk from "chalk";
import { Environment } from "../environment.js";

const evaluate_binary_numeric_expression = (lhs, rhs, operator) => {
  if (rhs.value === 0 && operator === "/") {
    console.log(
      chalk.red("Ente ponnu ") +
        chalk.blue("machane ") +
        chalk.red("zero vechu ara divide cheyane!!")
    );
    process.exit(1);
  }

  switch (operator) {
    case "+":
      return new NumberVal(lhs.value + rhs.value);
    case "-":
      return new NumberVal(lhs.value - rhs.value);
    case "*":
      return new NumberVal(lhs.value * rhs.value);
    case "/":
      // Perform integer division using Math.floor()
      return new NumberVal(Math.floor(lhs.value / rhs.value));
    case "%":
      return new NumberVal(lhs.value % rhs.value);
    default:
      return MK_NULL();
  }
};

export const evaluate_binary_expression = (binop, env) => {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);
  if (lhs.type === "number" && rhs.type === "number") {
    return evaluate_binary_numeric_expression(lhs, rhs, binop.operator);
  }
  return MK_NULL();
};

export const evaluate_identifier = (identifier, environment) => {
  return environment.lookupVar(identifier.symbol);
};

export const evaluate_assignment = (node, env) => {
  if (node.assignee.kind !== "Identifier") {
    throw ` Invalid LHS inside assignment`;
  }

  const varname = node.assignee.symbol;
  return env.assignVar(varname, evaluate(node.value, env));
};

export const evaluate_object_expression = (obj, env) => {
  const object = new ObjectVal(); // Create a new ObjectVal instance

  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value == undefined ? env.lookupVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal); // Use object's properties map to set key-value pairs
  }
  return object;
};

export const evaluate_array_expression = (arrayExpr, env) => {
  const elements = arrayExpr.elements.map((element) => evaluate(element, env));
  return new ArrayVal(elements);
};

export const evaluate_member_expression = (memberExpr, env) => {
  const object = evaluate(memberExpr.object, env);

  if (object.type === "object") {
    const property = memberExpr.property.symbol;
    const value = object.properties.get(property);

    if (value) {
      return value;
    } else {
      console.error(
        chalk.yellow(`Property '${property}' does not exist in the object.`)
      );
      return MK_NULL();
    }
  } else if (object.type === "array") {
    // Handle ArrayLiteral
    const index = evaluate(memberExpr.property, env);

    if (index.type === "number" && Number.isInteger(index.value)) {
      const intValue = Math.floor(index.value);
      if (intValue >= 0 && intValue < object.elements.length) {
        return object.elements[intValue];
      } else {
        console.error(
          chalk.yellow(`Index '${intValue}' out of bounds for array.`)
        );
        return MK_NULL();
      }
    } else {
      console.error(
        chalk.yellow("Index in array access must be an integer number.")
      );
      return MK_NULL();
    }
  } else {
    console.error(
      chalk.yellow(
        "Left-hand side of member expression must be an object or array."
      )
    );
    return MK_NULL();
  }
};

export const evaluate_string_literal = (stringLiteral) => {
  return new StringVal(stringLiteral.value); // Create a StringVal instance with the string literal's value
};

export const evaluate_call_expression = (expr, env) => {
  const args = expr.args.map((arg) => evaluate(arg, env));
  const fn = evaluate(expr.callee, env);

  if (fn.type !== "function") {
    throw new Error("Cannot call something that is not a function");
  }

  const scope = new Environment(fn.env);

  // Bind arguments to parameters
  for (let i = 0; i < fn.parameters.length; i++) {
    // Check if enough args provided?
    // JavaScript allows undefined.
    // Let's assume passed args match or are undefined.
    const varname = fn.parameters[i];
    const value = args[i] || MK_NULL();
    scope.declareVar(varname, value, false);
  }

  // Evaluate function body
  let result = MK_NULL();
  for (const statement of fn.declaration.body) {
    result = evaluate(statement, scope);
    if (result.type === "return") {
      return result.value;
    }
  }

  // If no return statement, return last evaluated expression value?
  // Usually functions return null if explicit return is missing.
  return result;
};

export const evaluate_comparison_expression = (compExpr, env) => {
  const lhs = evaluate(compExpr.left, env);
  const rhs = evaluate(compExpr.right, env);

  if (lhs.type === "number" && rhs.type === "number") {
    switch (compExpr.operator) {
      case ">":
        return new BoolVal(lhs.value > rhs.value);
      case "<":
        return new BoolVal(lhs.value < rhs.value);
      case ">=":
        return new BoolVal(lhs.value >= rhs.value);
      case "<=":
        return new BoolVal(lhs.value <= rhs.value);
      case "==":
        return new BoolVal(lhs.value === rhs.value);
      case "!=":
        return new BoolVal(lhs.value !== rhs.value);
      default:
        return MK_NULL();
    }
  } else {
    console.log(
      chalk.red("Machane pani kitti ") +
        chalk.yellow("Operands in comparison expression must be numbers.")
    );
    return MK_NULL();
  }
};

export const evaluate_logical_expression = (logicExpr, env) => {
  const lhs = evaluate(logicExpr.left, env);
  
  // Short-circuit evaluation for OR
  if (logicExpr.operator === "||") {
    if (lhs.type === "boolean" && lhs.value === true) {
      return new BoolVal(true);
    }
    const rhs = evaluate(logicExpr.right, env);
    if (rhs.type === "boolean") {
      return new BoolVal(lhs.value || rhs.value);
    }
  }
  
  // Short-circuit evaluation for AND
  if (logicExpr.operator === "&&") {
    if (lhs.type === "boolean" && lhs.value === false) {
      return new BoolVal(false);
    }
    const rhs = evaluate(logicExpr.right, env);
    if (rhs.type === "boolean") {
      return new BoolVal(lhs.value && rhs.value);
    }
  }
  
  console.log(
    chalk.red("Machane pani kitti ") +
      chalk.yellow("Operands in logical expression must be booleans.")
  );
  return MK_NULL();
};

export const evaluate_unary_expression = (unaryExpr, env) => {
  const argument = evaluate(unaryExpr.argument, env);
  
  if (unaryExpr.operator === "!") {
    if (argument.type === "boolean") {
      return new BoolVal(!argument.value);
    }
    console.log(
      chalk.red("Machane pani kitti ") +
        chalk.yellow("Operand for NOT operator must be a boolean.")
    );
    return MK_NULL();
  }
  
  return MK_NULL();
};
