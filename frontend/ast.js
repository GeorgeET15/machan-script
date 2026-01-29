export const NodeType = [
  "Program",
  "VarDeclaration",
  "NumericLiteral",
  "StringLiteral",
  "Identifier",
  "BinaryExpression",
  "Assignment",
  "Property",
  "ObjectLiteral",
  "MemberExpression",
  "CallExpression",
  "ComparisonExpression",
  "LogicalExpression",
  "UnaryExpression",
];

export class Statement {
  constructor(kind) {
    this.kind = kind;
  }
}

export class Program extends Statement {
  constructor() {
    super("Program");
    this.body = [];
  }
}

export class VarDeclaration extends Statement {
  constructor(constant, identifier, value = null) {
    super("VarDeclaration");
    this.constant = constant;
    this.identifier = identifier;
    this.value = value;
  }
}

export class Expression extends Statement {}

export class Assignment extends Expression {
  constructor(assignee, value) {
    super("Assignment");
    this.assignee = assignee;
    this.value = value;
  }
}

export class BinaryExpr extends Expression {
  constructor(kind, left, right, operator) {
    super(kind);
    this.left = left;
    this.right = right;
    this.operator = operator;
  }
}

export class CallExpression extends Expression {
  constructor(callee, args) {
    super("CallExpression");
    this.callee = callee;
    this.args = args;
  }
}

export class MemberExpression extends Expression {
  constructor(object, property, boolean) {
    super("MemberExpression");
    this.object = object;
    this.property = property;
    this.boolean = boolean;
  }
}

export class Identifier extends Expression {
  constructor(symbol) {
    super("Identifier");
    this.symbol = symbol;
  }
}

export class NumericLiteral extends Expression {
  constructor(value) {
    super("NumericLiteral");
    this.value = value;
  }
}

export class StringLiteral extends Expression {
  constructor(value) {
    super("StringLiteral");
    this.value = value;
  }
}

export class ArrayLiteral extends Expression {
  constructor(elements = []) {
    super("ArrayLiteral");
    this.elements = elements;
  }
}

export class Property {
  constructor(key, value = null) {
    this.kind = "Property";
    this.key = key;
    this.value = value;
  }
}

export class ObjectLiteral {
  constructor(properties = []) {
    this.kind = "ObjectLiteral";
    this.properties = properties;
  }
}

export class NativeFunctionCall extends Expression {
  constructor(name, args) {
    super("NativeFunctionCall");
    this.name = name;
    this.args = args;
  }
}

export class ComparisonExpression extends BinaryExpr {
  constructor(left, right, operator) {
    super("Comparison", left, right, operator);
  }
}

export class LogicalExpression extends BinaryExpr {
  constructor(left, right, operator) {
    super("LogicalExpression", left, right, operator);
  }
}

export class UnaryExpression extends Expression {
  constructor(operator, argument) {
    super("UnaryExpression");
    this.operator = operator;
    this.argument = argument;
  }
}

export class IfStatement extends Statement {
  constructor(condition, thenBlock, elseBlock) {
    super("IfStatement");
    this.condition = condition;
    this.thenBlock = thenBlock;
    this.elseBlock = elseBlock;
  }
}

export class WhileStatement extends Statement {
  constructor(condition, body) {
    super("WhileStatement");
    this.condition = condition;
    this.body = body;
  }
}

export class ForStatement extends Statement {
  constructor(init, condition, increment, body) {
    super("ForStatement");
    this.init = init;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
}

export class SwitchStatement extends Statement {
  constructor(expression, cases, defaultCase) {
    super("SwitchStatement");
    this.expression = expression;
    this.cases = cases;
    this.defaultCase = defaultCase;
  }
}

export class CaseStatement extends Statement {
  constructor(value, body) {
    super("CaseStatement");
    this.value = value;
    this.body = body;
  }
}

export class DefaultStatement extends Statement {
  constructor(body) {
    super("DefaultStatement");
    this.body = body;
  }
}

export class BreakStatement extends Statement {
  constructor() {
    super("BreakStatement");
  }
}

export class ContinueStatement extends Statement {
  constructor() {
    super("ContinueStatement");
  }
}

export class FunctionDeclaration extends Statement {
  constructor(name, parameters, body) {
    super("FunctionDeclaration");
    this.name = name;
    this.parameters = parameters;
    this.body = body;
  }
}

export class ReturnStatement extends Statement {
  constructor(value) {
    super("ReturnStatement");
    this.value = value;
  }
}
