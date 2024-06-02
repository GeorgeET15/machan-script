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
  "ComparisonExpression", // Added ComparisonExpression
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
