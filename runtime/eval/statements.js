import { MK_NULL, BreakVal, ContinueVal, FunctionVal, ReturnVal } from "../values.js";
import { evaluate } from "../interpreter.js";

export const evaluate_program = (program, env) => {
  let lastEvaluated = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
};

export const evaluate_var_declaration = (varDec, env) => {
  const value = varDec.value ? evaluate(varDec.value, env) : MK_NULL();
  return env.declareVar(varDec.identifier, value, varDec.constant);
};

export const evaluate_ipo_statement = (node, env) => {
  const conditionValue = evaluate(node.condition, env);

  if (conditionValue.type === "boolean") {
    if (conditionValue.value) {
      return evaluate_block(node.thenBlock, env);
    } else if (node.elseBlock) {
      return evaluate_block(node.elseBlock, env);
    } else {
      return MK_NULL(); // Return null if there's no else block
    }
  } else {
    console.error("Condition must be a boolean value.");
    return MK_NULL();
  }
};

export const evaluate_while_statement = (node, env) => {
  let result = MK_NULL();
  while (evaluate(node.condition, env).value) {
    result = evaluate_block(node.body, env);
    if (result.type === "break") break;
    if (result.type === "continue") continue;
  }
  return MK_NULL(); // Loops return null by default
};

const evaluate_block = (block, env) => {
  let result = MK_NULL();
  for (const statement of block) {
    result = evaluate(statement, env);
    // Propagate break/continue/return
    if (result.type === "break" || result.type === "continue" || result.type === "return") {
      return result;
    }
  }
  return result;
};

export const evaluate_for_statement = (node, env) => {
  evaluate(node.init, env);

  while (evaluate(node.condition, env).value) {
    const result = evaluate_block(node.body, env);
    
    if (result.type === "break") break;
    // For continue, we still execute the increment
    
    evaluate(node.increment, env);
  }

  return MK_NULL();
};

export const evaluate_break_statement = () => {
  return new BreakVal();
};

export const evaluate_continue_statement = () => {
  return new ContinueVal();
};

export const evaluate_function_declaration = (declaration, env) => {
  const func = new FunctionVal(
    declaration.name,
    declaration.parameters,
    declaration,
    env
  );

  env.declareVar(declaration.name, func, true);
  return func;
};

export const evaluate_return_statement = (declaration, env) => {
  const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
  return new ReturnVal(value);
};

export const evaluate_switch_statement = (node, env) => {
  const switchValue = evaluate(node.expression, env);
  let result = MK_NULL();
  let caseMatched = false;

  for (const caseNode of node.cases) {
    const caseValue = evaluate(caseNode.value, env);
    if (switchValue.value === caseValue.value) {
      result = evaluate_block(caseNode.body, env);
      caseMatched = true;
      break;
    }
  }

  if (!caseMatched && node.defaultCase) {
    result = evaluate_block(node.defaultCase.body, env);
  }

  return result;
};
