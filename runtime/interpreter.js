import { NumberVal, MK_NULL, StringVal } from "./values.js";
import {
  evaluate_identifier,
  evaluate_binary_expression,
  evaluate_assignment,
  evaluate_object_expression,
  evaluate_member_expression,
  evaluate_comparison_expression,
  evaluate_array_expression,
} from "./eval/expressions.js";
import {
  evaluate_program,
  evaluate_var_declaration,
  evaluate_ipo_statement,
  evaluate_while_statement,
  evaluate_for_statement,
} from "./eval/statements.js";

import { call_native_function } from "./machan_native_functions.js";

// Main evaluate function to handle different AST nodes
export const evaluate = (astNode, env) => {
  switch (astNode.kind) {
    case "NumericLiteral":
      return new NumberVal(astNode.value);
    case "StringLiteral":
      return new StringVal(astNode.value);
    case "Identifier":
      return evaluate_identifier(astNode, env);
    case "BinaryExpression":
      return evaluate_binary_expression(astNode, env);
    case "ObjectLiteral":
      return evaluate_object_expression(astNode, env);
    case "ArrayLiteral": // Adding case for ArrayLiteral
      return evaluate_array_expression(astNode, env);
    case "Assignment":
      return evaluate_assignment(astNode, env);
    case "VarDeclaration":
      return evaluate_var_declaration(astNode, env);
    case "Program":
      return evaluate_program(astNode, env);
    case "MemberExpression":
      return evaluate_member_expression(astNode, env);
    case "ComparisonExpression": // Added case for ComparisonExpression
      return evaluate_comparison_expression(astNode, env);
    case "NativeFunctionCall":
      return call_native_function(astNode.name, astNode.args, env);
    case "IfStatement":
      return evaluate_ipo_statement(astNode, env); // Add support for IfStatement
    case "WhileStatement":
      return evaluate_while_statement(astNode, env); // Add support for WhileStatement
    case "ForStatement": // Add support for ForStatement
      return evaluate_for_statement(astNode, env);

    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode
      );
      return MK_NULL();
  }
};
