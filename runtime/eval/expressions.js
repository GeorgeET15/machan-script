import { NumberVal, MK_NULL, ObjectVal, BoolVal, ArrayVal } from "../values.js";
import { evaluate } from "../interpreter.js";
import { Assignment } from "../../frontend/ast.js";

const evaluate_binary_numeric_expression = (lhs, rhs, operator) => {
  switch (operator) {
    case "+":
      return new NumberVal(lhs.value + rhs.value);
    case "-":
      return new NumberVal(lhs.value - rhs.value);
    case "*":
      return new NumberVal(lhs.value * rhs.value);
    case "/":
      return new NumberVal(lhs.value / rhs.value);
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
      console.error(`Property '${property}' does not exist in the object.`);
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
        console.error(`Index '${intValue}' out of bounds for array.`);
        return MK_NULL();
      }
    } else {
      console.error("Index in array access must be an integer number.");
      return MK_NULL();
    }
  } else {
    console.error(
      "Left-hand side of member expression must be an object or array."
    );
    return MK_NULL();
  }
};

export const evaluate_string_literal = (stringLiteral) => {
  return new StringVal(stringLiteral.value); // Create a StringVal instance with the string literal's value
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
    console.error("Operands in comparison expression must be numbers.");
    return MK_NULL();
  }
};
