#!/usr/bin/env node
import ps from "prompt-sync";
import fs from "fs/promises";
import chalk from "chalk";
import readline from "readline";

// --- Source: ./runtime/values.js ---
 const ValueType = ["null", "number", "boolean", "objects"];

 class RuntimeVal {
  constructor(type) {
    this.type = type;
  }
}

 class NullVal extends RuntimeVal {
  constructor() {
    super("null");
    this.value = null;
  }
}

 class NumberVal extends RuntimeVal {
  constructor(value) {
    super("number");
    this.value = value;
  }
}

 class BoolVal extends RuntimeVal {
  constructor(value) {
    super("boolean");
    this.value = value;
  }
}

 const MK_BOOL = (bVal = true) => {
  return new BoolVal(bVal);
};

 const MK_NUMBER = (number = 0) => {
  return new NumberVal(number);
};

 const MK_NULL = () => {
  return new NullVal();
};

 class ObjectVal extends RuntimeVal {
  constructor(value) {
    super("object");
    this.properties = new Map();
  }
}

 class StringVal extends RuntimeVal {
  constructor(value) {
    super("string");
    this.value = value;
  }
}

 const MK_STRING = (value = "") => {
  return new StringVal(value);
};

 class ArrayVal extends RuntimeVal {
  constructor(elements) {
    super("array");
    this.elements = elements || [];
  }
}

 const MK_ARRAY = (elements = []) => {
  return new ArrayVal(elements);
};

 class BreakVal extends RuntimeVal {
  constructor() {
    super("break");
  }
}

 class ContinueVal extends RuntimeVal {
  constructor() {
    super("continue");
  }
}

 class FunctionVal extends RuntimeVal {
  constructor(name, parameters, declaration, env) {
    super("function");
    this.name = name;
    this.parameters = parameters;
    this.declaration = declaration;
    this.env = env;
  }
}

 class ReturnVal extends RuntimeVal {
  constructor(value) {
    super("return");
    this.value = value;
  }
}

 class NativeFunctionVal extends RuntimeVal {
  constructor(call) {
    super("native-function");
    this.call = call;
  }
}


// --- Source: ./frontend/lexer.js ---
 class Token {
  constructor(value, type) {
    this.value = value;
    this.type = type;
  }

  equals(otherToken) {
    return this.value === otherToken.value && this.type === otherToken.type;
  }
}

 const TokenType = {
  NUMBER: "Number",
  IDENTIFIER: "Identifier",
  STRING: "String",
  UNDEFINED: "Undefined",
  START: "Start",

  // Operators
  EQUAL: "Equal",
  PLUS: "Plus",
  MINUS: "Minus",
  STAR: "Star",
  SLASH: "Slash",
  PERCENT: "Percent",
  GREATER_THAN: "Greaterthan",
  LESS_THAN: "Lessthan",
  GREATER_THAN_OR_EQUAL: "GreaterThanOrEqual",
  LESS_THAN_OR_EQUAL: "LessThanOrEqual",
  EQUAL_EQUAL: "EqualEqual",
  NOT_EQUAL: "NotEqual",
  
  // Compound Assignment
  PLUS_EQUALS: "PlusEquals",
  MINUS_EQUALS: "MinusEquals",
  STAR_EQUALS: "StarEquals",
  SLASH_EQUALS: "SlashEquals",
  PERCENT_EQUALS: "PercentEquals",
  
  // Increment/Decrement
  PLUS_PLUS: "PlusPlus",
  MINUS_MINUS: "MinusMinus",

  AND: "And",
  OR: "Or",
  NOT: "Not",

  // Punctuation
  LEFT_PAREN: "LeftParen",
  RIGHT_PAREN: "RightParen",
  LEFT_BRACE: "LeftBrace",
  RIGHT_BRACE: "RightBrace",
  LEFT_BRACKET: "LeftBracket",
  RIGHT_BRACKET: "RightBracket",
  SEMICOLON: "Semicolon",
  COMMA: "Comma",
  COLON: "Colon",
  DOT: "Dot",

  // Keywords
  MACHANE: "machane",
  ITHU: "ithu",
  AANU: "aanu",
  CONST: "const",
  PARA: "para",
  VELUTHU: "veluthu",
  CHERUTHU: "cheruthu",
  IPO: "ipo",
  ANENGI: "anengi",
  ALENGI: "alengi",
  AVANE: "avane",
  VARE: "vare",
  ENIT: "enit",
  INPUT_EDUKU: "inputEduku",
  WHILE: "while",
  FOR: "for",
  SWITCH: "switch",
  ONNUM_ALENGI: "onnum_alengi",
  INATHE_DATE: "inathe_date",
  VAYIKU: "vayiku",
  EZHUTHU: "ezhuthu",
  RANDOM: "random",
  FACT: "fact",
  ORANGU: "orangu",
  BREAK: "break",
  CONTINUE: "continue",
  PANI: "pani",
  RETURN: "return",
  TRY: "try",
  CHEYU: "cheyu",
  PIDIKU: "pidiku",

  // End of File
  EOF: "EOF",
};

 const tokenize = (sourceCode) => {
  const tokens = [];
  // Improved regex that properly separates operators, strings, comments, and other tokens
  // Order matters: Strings -> Comments -> Multi-char ops -> Single-char ops -> Words
  // Added \d+\.\d+ to match floats before dot operator
  const pattern = /(['"])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\/|&&|\|\||==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\+\+|--|\d+\.\d+|[+\-*\/%=<>!(){}\[\];:,.]|[^\s+\-*\/%=<>!(){}\[\];:,.]+/g;
  const src = sourceCode.match(pattern) || [];

  for (const word of src) {
    // Skip comments
    if (word.startsWith("//") || word.startsWith("/*")) {
      continue;
    }

    if (!isNaN(word)) {
      tokens.push(new Token(word, TokenType.NUMBER));
    } else if (/^["'].*["']$/.test(word)) {
      tokens.push(new Token(word.slice(1, -1), TokenType.STRING));
    } else if (word.toUpperCase() in TokenType) {
      tokens.push(new Token(word, TokenType[word.toUpperCase()]));
    } else if (/^[a-zA-Z_]\w*$/.test(word)) {
      tokens.push(
        new Token(
          word,
          word === "undefined" ? TokenType.UNDEFINED : TokenType.IDENTIFIER
        )
      );
    } else {
      const tokenType =
        {
          "=": TokenType.EQUAL,
          "+": TokenType.PLUS,
          "-": TokenType.MINUS,
          "*": TokenType.STAR,
          "/": TokenType.SLASH,
          "%": TokenType.PERCENT,
          "+=": TokenType.PLUS_EQUALS,
          "-=": TokenType.MINUS_EQUALS,
          "*=": TokenType.STAR_EQUALS,
          "/=": TokenType.SLASH_EQUALS,
          "%=": TokenType.PERCENT_EQUALS,
          "++": TokenType.PLUS_PLUS,
          "--": TokenType.MINUS_MINUS,
          "(": TokenType.LEFT_PAREN,
          ")": TokenType.RIGHT_PAREN,
          "{": TokenType.LEFT_BRACE,
          "}": TokenType.RIGHT_BRACE,
          "[": TokenType.LEFT_BRACKET,
          "]": TokenType.RIGHT_BRACKET,
          ";": TokenType.SEMICOLON,
          ":": TokenType.COLON,
          ",": TokenType.COMMA,
          ".": TokenType.DOT,
          "<": TokenType.LESS_THAN,
          ">": TokenType.GREATER_THAN,
          "<=": TokenType.LESS_THAN_OR_EQUAL,
          ">=": TokenType.GREATER_THAN_OR_EQUAL,
          "==": TokenType.EQUAL_EQUAL,
          "!=": TokenType.NOT_EQUAL,
          "&&": TokenType.AND,
          "||": TokenType.OR,
          "!": TokenType.NOT,
        }[word] || TokenType.IDENTIFIER;

      tokens.push(new Token(word, tokenType));
    }
  }

  tokens.push(new Token("", TokenType.EOF));
  return tokens;
};


// --- Source: ./frontend/ast.js ---
 const NodeType = [
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

 class Statement {
  constructor(kind) {
    this.kind = kind;
  }
}

 class Program extends Statement {
  constructor() {
    super("Program");
    this.body = [];
  }
}

 class VarDeclaration extends Statement {
  constructor(constant, identifier, value = null) {
    super("VarDeclaration");
    this.constant = constant;
    this.identifier = identifier;
    this.value = value;
  }
}

 class Expression extends Statement {}

 class Assignment extends Expression {
  constructor(assignee, value) {
    super("Assignment");
    this.assignee = assignee;
    this.value = value;
  }
}

 class BinaryExpr extends Expression {
  constructor(kind, left, right, operator) {
    super(kind);
    this.left = left;
    this.right = right;
    this.operator = operator;
  }
}

 class CallExpression extends Expression {
  constructor(callee, args) {
    super("CallExpression");
    this.callee = callee;
    this.args = args;
  }
}

 class MemberExpression extends Expression {
  constructor(object, property, boolean) {
    super("MemberExpression");
    this.object = object;
    this.property = property;
    this.boolean = boolean;
  }
}

 class Identifier extends Expression {
  constructor(symbol) {
    super("Identifier");
    this.symbol = symbol;
  }
}

 class NumericLiteral extends Expression {
  constructor(value) {
    super("NumericLiteral");
    this.value = value;
  }
}

 class StringLiteral extends Expression {
  constructor(value) {
    super("StringLiteral");
    this.value = value;
  }
}

 class ArrayLiteral extends Expression {
  constructor(elements = []) {
    super("ArrayLiteral");
    this.elements = elements;
  }
}

 class Property {
  constructor(key, value = null) {
    this.kind = "Property";
    this.key = key;
    this.value = value;
  }
}

 class ObjectLiteral {
  constructor(properties = []) {
    this.kind = "ObjectLiteral";
    this.properties = properties;
  }
}

 class NativeFunctionCall extends Expression {
  constructor(name, args) {
    super("NativeFunctionCall");
    this.name = name;
    this.args = args;
  }
}

 class ComparisonExpression extends BinaryExpr {
  constructor(left, right, operator) {
    super("Comparison", left, right, operator);
  }
}

 class LogicalExpression extends BinaryExpr {
  constructor(left, right, operator) {
    super("LogicalExpression", left, right, operator);
  }
}

 class UnaryExpression extends Expression {
  constructor(operator, argument) {
    super("UnaryExpression");
    this.operator = operator;
    this.argument = argument;
  }
}

 class IfStatement extends Statement {
  constructor(condition, thenBlock, elseBlock) {
    super("IfStatement");
    this.condition = condition;
    this.thenBlock = thenBlock;
    this.elseBlock = elseBlock;
  }
}

 class WhileStatement extends Statement {
  constructor(condition, body) {
    super("WhileStatement");
    this.condition = condition;
    this.body = body;
  }
}

 class ForStatement extends Statement {
  constructor(init, condition, increment, body) {
    super("ForStatement");
    this.init = init;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
}

 class SwitchStatement extends Statement {
  constructor(expression, cases, defaultCase) {
    super("SwitchStatement");
    this.expression = expression;
    this.cases = cases;
    this.defaultCase = defaultCase;
  }
}

 class CaseStatement extends Statement {
  constructor(value, body) {
    super("CaseStatement");
    this.value = value;
    this.body = body;
  }
}

 class DefaultStatement extends Statement {
  constructor(body) {
    super("DefaultStatement");
    this.body = body;
  }
}

 class BreakStatement extends Statement {
  constructor() {
    super("BreakStatement");
  }
}

 class ContinueStatement extends Statement {
  constructor() {
    super("ContinueStatement");
  }
}

 class FunctionDeclaration extends Statement {
  constructor(name, parameters, body) {
    super("FunctionDeclaration");
    this.name = name;
    this.parameters = parameters;
    this.body = body;
  }
}

 class ReturnStatement extends Statement {
  constructor(value) {
    super("ReturnStatement");
    this.value = value;
  }
}

 class TryCatchStatement extends Statement {
  constructor(tryBlock, paramName, catchBlock) {
    super("TryCatchStatement");
    this.tryBlock = tryBlock;
    this.paramName = paramName;
    this.catchBlock = catchBlock;
  }
}


// --- Source: ./frontend/parser.js ---




 class Parser {
  constructor() {
    this.tokens = []; // Array to store tokens
  }

  not_eof() {
    return this.tokens[0].type != TokenType.EOF;
  }

  at() {
    return this.tokens[0];
  }

  eat() {
    const prev = this.tokens.shift();
    return prev;
  }

  expect(type, err_message) {
    const prev = this.tokens.shift();

    if (!prev || prev.type !== type) {
      throw new Error(
        `Machane pani kitti ${err_message}\nFound: ${prev ? JSON.stringify(prev) : "End of File"}`
      );
    }

    return prev;
  }

  produceAST = ({ sourceCode }) => {
    this.tokens = tokenize(sourceCode);
    const program = new Program();

    while (this.not_eof()) {
      const stmt = this.parse_statement();
      if (stmt) {
        program.body.push(stmt);
      }
    }

    return program;
  };

  parse_statement() {
    switch (this.at().type) {
      case TokenType.ITHU:
      case TokenType.CONST:
        return this.parse_var_declaration();
      case TokenType.PARA:
      case TokenType.VELUTHU:
      case TokenType.CHERUTHU:
      case TokenType.INPUT_EDUKU:
      case TokenType.INATHE_DATE:
      case TokenType.VAYIKU:
      case TokenType.EZHUTHU:
      case TokenType.RANDOM:
      case TokenType.FACT:
      case TokenType.ORANGU:
        return this.parse_native_function_call();
      case TokenType.IPO:
        return this.parse_ipo_statement(); // Add support for if statements
      case TokenType.MACHANE:
        // Check if it's a function declaration (machane pani) or while loop (machane)
        if (this.tokens[1] && this.tokens[1].type === TokenType.PANI) {
          return this.parse_function_declaration();
        }
        // Check if it's try-catch (machane try cheyu)
        if (this.tokens[1] && this.tokens[1].type === TokenType.TRY) {
           return this.parse_try_catch_statement();
        }
        return this.parse_while_statement();
      case TokenType.FOR:
        return this.parse_for_statement();
      case TokenType.SWITCH:
        return this.parse_switch_statement(); // Add support for switch statements
      case TokenType.BREAK:
        this.eat(); // eat break kw
        return new BreakStatement();
      case TokenType.CONTINUE:
        this.eat(); // eat continue kw
        return new ContinueStatement();
      case TokenType.RETURN:
        return this.parse_return_statement();
      case TokenType.SEMICOLON:
        this.eat();
        return null; // Empty statement

      default:
        const expr = this.parse_expression();
        if (this.at().type === TokenType.SEMICOLON) {
          this.eat();
        }
        return expr;
    }
  }

  parse_switch_statement() {
    this.expect(TokenType.SWITCH, "Expected 'switch' keyword.");
    this.expect(TokenType.MACHANE, "Expected 'machane' keyword.");
    const expression = this.parse_expression();
    this.expect(TokenType.LEFT_BRACE, "Expected '{' after switch expression.");
    const cases = [];
    let defaultCase = null;

    while (this.not_eof() && this.at().type !== TokenType.RIGHT_BRACE) {
      switch (this.at().type) {
        case TokenType.IPO:
          cases.push(this.parse_case_statement());
          break;
        case TokenType.ONNUM_ALENGI:
          defaultCase = this.parse_default_statement();
          break;
        default:
          console.log(
            chalk.red("Machane pani kitti ") +
              chalk.yellow(
                "Unexpected token inside switch statement!",
                this.at().value
              )
          );
          process.exit(1);
      }
    }

    this.expect(TokenType.RIGHT_BRACE, "Expected '}' to end switch statement.");
    return new SwitchStatement(expression, cases, defaultCase);
  }

  parse_case_statement() {
    this.expect(TokenType.IPO, "Expected 'case' keyword.");
    const value = this.parse_expression();
    this.expect(TokenType.ANENGI, "Expected 'anengi' after case value.");
    const body = this.parse_block();
    return new CaseStatement(value, body);
  }

  parse_default_statement() {
    this.expect(TokenType.ONNUM_ALENGI, "Expected 'default' keyword.");
    const body = this.parse_block();
    return new DefaultStatement(body);
  }
  parse_try_catch_statement() {
    this.eat(); // eat machane
    this.expect(TokenType.TRY, "Expected 'try' keyword");
    this.expect(TokenType.CHEYU, "Expected 'cheyu' keyword");
    
    const tryBlock = this.parse_block();
    
    this.expect(TokenType.PIDIKU, "Expected 'pidiku' (catch) keyword");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after pidiku");
    const paramName = this.expect(TokenType.IDENTIFIER, "Expected catch parameter name").value;
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after catch parameter");
    
    const catchBlock = this.parse_block();
    
    return new TryCatchStatement(tryBlock, paramName, catchBlock);
  }

  parse_function_declaration() {
    this.eat(); // eat machane
    this.expect(TokenType.PANI, "Expected 'pani' keyword");
    const name = this.expect(TokenType.IDENTIFIER, "Machane function name adiku").value;
    const args = this.parse_args();
    const params = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        console.log(chalk.red("Machane pani kitti ") + chalk.yellow("Inside function declaration parameters must be strings."));
        process.exit(1);
      }
      params.push(arg.symbol);
    }
    const body = this.parse_block();
    return new FunctionDeclaration(name, params, body);
  }

  parse_return_statement() {
    this.eat(); // eat return
    let value = null;
    if (this.at().type !== TokenType.SEMICOLON && this.at().type !== TokenType.RIGHT_BRACE) {
       value = this.parse_expression();
    }
    if (this.at().type === TokenType.SEMICOLON) {
      this.eat();
    }
    return new ReturnStatement(value);
  }

  parse_args() {
    this.expect(TokenType.LEFT_PAREN, "Expected open parenthesis");
    const args =
      this.at().type == TokenType.RIGHT_PAREN
        ? []
        : this.parse_arguments_list();
    this.expect(TokenType.RIGHT_PAREN, "Missing closing parenthesis inside arguments list");
    return args;
  }

  parse_for_statement() {
    this.expect(TokenType.FOR, "Expected 'for' keyword.");
    this.expect(TokenType.MACHANE, "Expected 'machane' keyword.");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after 'for' keyword.");

    const init = this.parse_var_declaration();
    this.expect(TokenType.COLON, "Expected ';' after initialization.");

    const condition = this.parse_expression();
    this.expect(TokenType.COLON, "Expected ';' after condition.");

    const increment = this.parse_expression();
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after increment.");
    this.expect(TokenType.ENIT, "Expected 'enit' keyword.");

    const body = this.parse_block();

    return new ForStatement(init, condition, increment, body);
  }

  parse_ipo_statement() {
    this.expect(TokenType.IPO, "Expected 'ipo' keyword.");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after 'ipo' keyword.");
    const condition = this.parse_expression();
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after condition.");
    this.expect(TokenType.ANENGI, "Expected 'anengi' keyword.");

    const thenBlock = this.parse_block();

    if (this.at().type === TokenType.ALENGI) {
      this.eat(); // Consume the 'else' keyword
      const elseBlock = this.parse_block();
      return new IfStatement(condition, thenBlock, elseBlock);
    }

    return new IfStatement(condition, thenBlock, null);
  }

  parse_block() {
    this.expect(TokenType.LEFT_BRACE, "Expected '{' to start block.");
    const statements = [];

    while (this.at().type !== TokenType.RIGHT_BRACE && this.not_eof()) {
      const statement = this.parse_statement();
      statements.push(statement);
    }

    this.expect(TokenType.RIGHT_BRACE, "Expected '}' to end block.");

    return statements;
  }

  // Implement parse_while_statement method to parse while loops
  parse_while_statement() {
    this.expect(TokenType.MACHANE, "Expected 'machane' keyword");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after 'while'");
    const condition = this.parse_expression();
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after while condition");
    this.expect(TokenType.AVANE, "Expected 'avane' keyword");
    this.expect(TokenType.VARE, "Expected 'vare' keyword");

    const body = this.parse_block();

    return new WhileStatement(condition, body);
  }

  parse_var_declaration() {
    this.expect(TokenType.ITHU, "Expected 'ithu' keyword");

    let isConstant = false;
    let identifier;

    if (this.at().type === TokenType.CONST) {
      this.eat(); // consume the 'const' token
      isConstant = true;

      identifier = this.expect(
        TokenType.IDENTIFIER,
        "Machane 'ithu' kazhinu oru var name adiku"
      ).value;
    } else {
      identifier = this.expect(
        TokenType.IDENTIFIER,
        "Machane 'ithu' kazhinu oru var name adiku"
      ).value;
    }

    this.expect(TokenType.EQUAL, "Equals expected in var declaration");

    const declaration = new VarDeclaration(
      isConstant,
      identifier,
      this.parse_expression()
    );

    this.expect(TokenType.AANU, "Machane var name kazhinu 'aanu' adiku");

    return declaration;
  }

  parse_expression() {
    return this.parse_assignment_expression();
  }

  parse_assignment_expression() {
    const left = this.parse_logical_or_expression();
    
    if (this.at().type == TokenType.EQUAL) {
      this.eat();
      const value = this.parse_assignment_expression();
      return new Assignment(left, value);
    }
    
    // Compound Assignment: +=, -=, *=, /=, %=
    if (
      this.at().type == TokenType.PLUS_EQUALS ||
      this.at().type == TokenType.MINUS_EQUALS ||
      this.at().type == TokenType.STAR_EQUALS ||
      this.at().type == TokenType.SLASH_EQUALS ||
      this.at().type == TokenType.PERCENT_EQUALS
    ) {
      const operatorToken = this.eat();
      const operator = {
        [TokenType.PLUS_EQUALS]: "+",
        [TokenType.MINUS_EQUALS]: "-",
        [TokenType.STAR_EQUALS]: "*",
        [TokenType.SLASH_EQUALS]: "/",
        [TokenType.PERCENT_EQUALS]: "%",
      }[operatorToken.type];
      
      const value = this.parse_assignment_expression();
      // Desugar to: left = left op value
      return new Assignment(left, new BinaryExpr("BinaryExpression", left, value, operator));
    }
    
    // Increment/Decrement: ++, --
    if (this.at().type == TokenType.PLUS_PLUS) {
      this.eat();
      // Desugar to: left = left + 1
      return new Assignment(left, new BinaryExpr("BinaryExpression", left, new NumericLiteral(1), "+"));
    }
    
    if (this.at().type == TokenType.MINUS_MINUS) {
      this.eat();
      // Desugar to: left = left - 1
      return new Assignment(left, new BinaryExpr("BinaryExpression", left, new NumericLiteral(1), "-"));
    }

    return left;
  }

  parse_logical_or_expression() {
    let left = this.parse_logical_and_expression();

    while (this.at().value === "||") {
      const operator = this.eat().value;
      const right = this.parse_logical_and_expression();
      left = new LogicalExpression(left, right, operator);
    }

    return left;
  }

  parse_logical_and_expression() {
    let left = this.parse_unary_expression();

    while (this.at().value === "&&") {
      const operator = this.eat().value;
      const right = this.parse_unary_expression();
      left = new LogicalExpression(left, right, operator);
    }

    return left;
  }

  parse_unary_expression() {
    if (this.at().type === TokenType.NOT || this.at().type === TokenType.MINUS) {
      const operator = this.eat().value;
      const argument = this.parse_unary_expression();
      return new UnaryExpression(operator, argument);
    }
    return this.parse_object_expression();
  }

  parse_object_expression() {
    if (this.at().type !== TokenType.LEFT_BRACE) {
      return this.parse_addition_expression();
    } else if (this.at().type === TokenType.LEFT_BRACKET) {
      return this.parse_array_literal();
    }

    this.eat(); // Eat the '{'
    const properties = [];

    while (this.not_eof() && this.at().type !== TokenType.RIGHT_BRACE) {
      const key = this.expect(
        TokenType.IDENTIFIER,
        "Expected identifier for key in object literal"
      ).value;

      this.expect(TokenType.COLON, "Expected ':' after key in object literal");

      const value = this.parse_expression();

      properties.push(new Property(key, value));

      if (this.at().type === TokenType.COMMA) {
        this.eat(); // Eat the ',' and continue to the next property
      } else if (this.at().type !== TokenType.RIGHT_BRACE) {
        this.expect(
          TokenType.COMMA,
          "Expected comma or closing brace in object literal"
        );
      }
    }

    this.expect(
      TokenType.RIGHT_BRACE,
      "Expected closing brace for object literal"
    );

    return new ObjectLiteral(properties);
  }

  parse_array_literal() {
    this.expect(TokenType.LEFT_BRACKET, "Expected '[' to start ArrayLiteral");
    const elements = [];

    while (this.not_eof() && this.at().type !== TokenType.RIGHT_BRACKET) {
      const value = this.parse_expression();
      elements.push(value);

      if (this.at().type === TokenType.COMMA) {
        this.eat(); // Eat the ',' and continue to the next element
      } else if (this.at().type !== TokenType.RIGHT_BRACKET) {
        this.expect(
          TokenType.COMMA,
          "Expected comma or closing bracket in ArrayLiteral"
        );
      }
    }

    this.expect(
      TokenType.RIGHT_BRACKET,
      "Expected closing bracket for ArrayLiteral"
    );

    return new ArrayLiteral(elements);
  }

  parse_addition_expression() {
    let left = this.parse_multiplication_expression();

    while (
      this.at().value === "+" ||
      this.at().value === "-" ||
      this.at().value === ">" ||
      this.at().value === "<" ||
      this.at().value === ">=" ||
      this.at().value === "<=" ||
      this.at().value === "==" ||
      this.at().value === "!="
    ) {
      const operator = this.eat().value;
      const right = this.parse_multiplication_expression();

      if (
        operator === ">" ||
        operator === "<" ||
        operator === ">=" ||
        operator === "<=" ||
        operator === "==" ||
        operator === "!="
      ) {
        left = new BinaryExpr("ComparisonExpression", left, right, operator);
      } else {
        left = new BinaryExpr("BinaryExpression", left, right, operator);
      }
    }

    return left;
  }

  parse_multiplication_expression() {
    let left = this.parse_call_member_expression();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_member_expression();
      left = new BinaryExpr("BinaryExpression", left, right, operator);
    }

    return left;
  }

  parse_call_member_expression() {
    const member = this.parse_member_expression();

    if (this.at().type == TokenType.LEFT_PAREN) {
      return this.parse_call_expression(member);
    }

    return member;
  }

  parse_call_expression(callee) {
    const args = this.parse_arguments();
    return new CallExpression(callee, args);
  }

  parse_arguments() {
    this.expect(TokenType.LEFT_PAREN, "Expected open parenthesis");
    const args =
      this.at().type == TokenType.RIGHT_PAREN
        ? []
        : this.parse_arguments_list();

    this.expect(
      TokenType.RIGHT_PAREN,
      "Missing closing parenthesis inside arguments list"
    );
    return args;
  }

  parse_arguments_list() {
    const args = [this.parse_assignment_expression()];

    while (this.at().type == TokenType.COMMA && this.eat()) {
      args.push(this.parse_assignment_expression());
    }

    return args;
  }

  parse_member_expression() {
    let object = this.parse_primary_expression();

    while (
      this.at().type == TokenType.DOT ||
      this.at().type == TokenType.LEFT_BRACKET
    ) {
      const operator = this.eat();
      let property;
      let computed;

      if (operator.type == TokenType.DOT) {
        computed = false;
        property = this.parse_primary_expression();
        if (property.kind != "Identifier") {
          throw `Cannot use dot operator without right hand side being an identifier`;
        }
      } else {
        computed = true;
        property = this.parse_expression();
        this.expect(
          TokenType.RIGHT_BRACKET,
          "Missing closing bracket in computed value."
        );
      }

      object = new MemberExpression(object, property, computed);
    }

    return object;
  }

  parse_native_function_call() {
    const keyword = this.eat().value; // eat 'para'
    const args = this.parse_arguments();
    this.expect(
      TokenType.SEMICOLON,
      "Expected semicolon after native function call"
    );
    return new NativeFunctionCall(keyword, args);
  }

  parse_primary_expression() {
    const tk = this.at().type;
    switch (tk) {
      case TokenType.IDENTIFIER:
        return new Identifier(this.eat().value);

      case TokenType.NUMBER:
        return new NumericLiteral(parseFloat(this.eat().value));

      case TokenType.STRING:
        return new StringLiteral(this.eat().value); // Parse string literals
      case TokenType.LEFT_BRACKET:
        return this.parse_array_literal();

      case TokenType.LEFT_PAREN:
        this.eat();
        const value = this.parse_expression();
        this.expect(
          TokenType.RIGHT_PAREN,
          "Unexpected token found inside parenthesized expression. Expected closing parenthesis."
        );
        return value;

      default:
        throw new Error(
          "Machaneee etho unxepected item ondalo code check cheyu."
        );
    }
  }
}


// --- Source: ./runtime/environment.js ---


 const setUpScope = (env) => {
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);
};

 class Environment {
  constructor(parentENV = null) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
    setUpScope(this);
  }

  declareVar(varname, value, constant) {
    if (this.variables.has(varname)) {
      throw new Error(
        chalk.yellow(
          `Machane ${varname} already declared aanalo`
        )
      );
    }
    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  assignVar(varname, value) {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw new Error(
        chalk.yellow(`${varname} is a const variable, cannot reassign value`)
      );
    }
    env.variables.set(varname, value);
    return value;
  }

  resolve(varname) {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent === null) {
      throw new Error(`Machane '${varname}' inagen oru item illa`);
    }
    return this.parent.resolve(varname);
  }

  lookupVar(varname) {
    const env = this.resolve(varname);
    return env.variables.get(varname);
  }
}


// --- Source: ./runtime/eval/expressions.js ---




const evaluate_binary_numeric_expression = (lhs, rhs, operator) => {
  if (rhs.value === 0 && operator === "/") {
    // Throw error instead of exiting process
    throw new Error("Ente ponnu machane zero vechu ara divide cheyane!!");
  }

  switch (operator) {
    case "+":
      return new NumberVal(lhs.value + rhs.value);
    case "-":
      return new NumberVal(lhs.value - rhs.value);
    case "*":
      return new NumberVal(lhs.value * rhs.value);
    case "/":
      // Perform float division
      return new NumberVal(lhs.value / rhs.value);
    case "%":
      return new NumberVal(lhs.value % rhs.value);
    default:
      return MK_NULL();
  }
};

 const evaluate_binary_expression = (binop, env) => {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);
  
  // Numeric operations
  if (lhs.type === "number" && rhs.type === "number") {
    return evaluate_binary_numeric_expression(lhs, rhs, binop.operator);
  }
  
  // String concatenation with +
  if (binop.operator === "+") {
    return new StringVal(lhs.value.toString() + rhs.value.toString());
  }
  
  return MK_NULL();
};

 const evaluate_identifier = (identifier, environment) => {
  return environment.lookupVar(identifier.symbol);
};

 const evaluate_assignment = (node, env) => {
  if (node.assignee.kind !== "Identifier") {
    throw ` Invalid LHS inside assignment`;
  }

  const varname = node.assignee.symbol;
  return env.assignVar(varname, evaluate(node.value, env));
};

 const evaluate_object_expression = (obj, env) => {
  const object = new ObjectVal(); // Create a new ObjectVal instance

  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value == undefined ? env.lookupVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal); // Use object's properties map to set key-value pairs
  }
  return object;
};

 const evaluate_array_expression = (arrayExpr, env) => {
  const elements = arrayExpr.elements.map((element) => evaluate(element, env));
  return new ArrayVal(elements);
};

 const evaluate_member_expression = (memberExpr, env) => {
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
          chalk.yellow(`Machane array il athrem items ilaloo`)
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

 const evaluate_string_literal = (stringLiteral) => {
  return new StringVal(stringLiteral.value); // Create a StringVal instance with the string literal's value
};

 const evaluate_call_expression = (expr, env) => {
  const args = expr.args.map((arg) => evaluate(arg, env));
  const fn = evaluate(expr.callee, env);

  if (fn.type === "native-function") {
    // console.log("Calling native function");
    const result = fn.call(args, env);
    return result;
  }
  
  // console.log("Calling regular function", fn.type);

  if (fn.type === "function") {
    const scope = new Environment(fn.env);

    // Bind arguments to parameters
    for (let i = 0; i < fn.parameters.length; i++) {
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
    return result;
  }

  throw new Error("Ithu function alla machane, call cheyyaan pattilla");
};

 const evaluate_comparison_expression = (compExpr, env) => {
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

 const evaluate_logical_expression = (logicExpr, env) => {
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

 const evaluate_unary_expression = (unaryExpr, env) => {
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
  } else if (unaryExpr.operator === "-") {
    // Unary minus
    if (argument.type === "number") {
      return new NumberVal(-argument.value);
    }
    console.log(
      chalk.red("Machane pani kitti ") +
        chalk.yellow("Operand for unary minus must be a number.")
    );
    return MK_NULL();
  }
  
  return MK_NULL();
};


// --- Source: ./runtime/eval/statements.js ---




 const evaluate_program = (program, env) => {
  let lastEvaluated = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
};

 const evaluate_var_declaration = (varDec, env) => {
  const value = varDec.value ? evaluate(varDec.value, env) : MK_NULL();
  return env.declareVar(varDec.identifier, value, varDec.constant);
};

 const evaluate_ipo_statement = (node, env) => {
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

 const evaluate_while_statement = (node, env) => {
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

 const evaluate_for_statement = (node, env) => {
  evaluate(node.init, env);

  while (evaluate(node.condition, env).value) {
    const result = evaluate_block(node.body, env);
    
    if (result.type === "break") break;
    // For continue, we still execute the increment
    
    evaluate(node.increment, env);
  }

  return MK_NULL();
};

 const evaluate_break_statement = () => {
  return new BreakVal();
};

 const evaluate_continue_statement = () => {
  return new ContinueVal();
};

 const evaluate_function_declaration = (declaration, env) => {
  const func = new FunctionVal(
    declaration.name,
    declaration.parameters,
    declaration,
    env
  );

  env.declareVar(declaration.name, func, true);
  return func;
};

 const evaluate_return_statement = (declaration, env) => {
  const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
  return new ReturnVal(value);
};

 const evaluate_try_catch_statement = (node, env) => {
  try {
    const tryEnv = new Environment(env);
    return evaluate_block(node.tryBlock, tryEnv);
  } catch (error) {
    const catchEnv = new Environment(env);
    // Error is currently a string or Error object
    const errorMsg = error.message || String(error);
    catchEnv.declareVar(node.paramName, new StringVal(errorMsg), true);
    return evaluate_block(node.catchBlock, catchEnv);
  }
};

 const evaluate_switch_statement = (node, env) => {
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


// --- Source: ./runtime/machan_native_functions.js ---





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

 const veluthu_native_function = (args, env, evaluate) => {
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

 const cheruthu_native_function = (args, env, evaluate) => {
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

 const input_eduku_native_function = (args, env, evaluate) => {
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

 const inathe_date_native_function = (args, env, evaluate) => {
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

 const vayiku_native_function = async (args, env, evaluate) => {
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

 const ezhuthu_native_function = async (args, env, evaluate) => {
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

 const random_number_native_function = (args, env, evaluate) => {
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

 const factorial_native_function = (args, env, evaluate) => {
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

 const orangu_native_function = async (args, env, evaluate) => {
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
 const array_push_native = (args, env) => {
  const array = args[0];
  const value = args[1];
  
  if (array.type !== "array") {
    throw new Error("First argument to array_push must be an array.");
  }
  
  array.elements.push(value);
  return new NumberVal(array.elements.length);
};

 const array_pop_native = (args, env) => {
  const array = args[0];
  
  if (array.type !== "array") {
    throw new Error("Argument to array_pop must be an array.");
  }
  
  if (array.elements.length === 0) {
    return MK_NULL();
  }
  
  return array.elements.pop();
};

 const array_length_native = (args, env) => {
  const array = args[0];
  
  if (array.type !== "array") {
    throw new Error("Argument to array_length must be an array.");
  }
  
  return new NumberVal(array.elements.length);
};

 const array_join_native = (args, env) => {
  const array = args[0];
  const separator = args.length > 1 ? args[1].value : ",";
  
  if (array.type !== "array") {
    throw new Error("First argument to array_join must be an array.");
  }
  
  const str = array.elements.map(e => e.value).join(separator);
  return new StringVal(str);
};

 const array_slice_native = (args, env) => {
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
 const string_length_native = (args, env) => {
  const str = args[0];
  
  if (str.type !== "string") {
    throw new Error("Argument to string_length must be a string.");
  }
  
  return new NumberVal(str.value.length);
};

 const string_substring_native = (args, env) => {
  const str = args[0];
  const start = args[1].value;
  const end = args.length > 2 ? args[2].value : undefined;
  
  if (str.type !== "string") {
    throw new Error("First argument to string_substring must be a string.");
  }
  
  return new StringVal(str.value.substring(start, end));
};

 const string_upper_native = (args, env) => {
  const str = args[0];
  
  if (str.type !== "string") {
    throw new Error("Argument to string_upper must be a string.");
  }
  
  return new StringVal(str.value.toUpperCase());
};

 const string_lower_native = (args, env) => {
  const str = args[0];
  
  if (str.type !== "string") {
    throw new Error("Argument to string_lower must be a string.");
  }
  
  return new StringVal(str.value.toLowerCase());
};

 const string_split_native = (args, env) => {
  const str = args[0];
  const separator = args[1].value;
  
  if (str.type !== "string") {
    throw new Error("First argument to string_split must be a string.");
  }
  
  const parts = str.value.split(separator).map(s => new StringVal(s));
  return new ArrayVal(parts);
};

// Object Functions
 const object_keys_native = (args, env) => {
  const obj = args[0];
  
  if (obj.type !== "object") {
    throw new Error("Argument to object_keys must be an object.");
  }
  
  const keys = Array.from(obj.properties.keys()).map(k => new StringVal(k));
  return new ArrayVal(keys);
};

 const object_values_native = (args, env) => {
  const obj = args[0];
  
  if (obj.type !== "object") {
    throw new Error("Argument to object_values must be an object.");
  }
  
  const values = Array.from(obj.properties.values());
  return new ArrayVal(values);
};

 const object_has_native = (args, env) => {
  const obj = args[0];
  const key = args[1].value;
  
  if (obj.type !== "object") {
    throw new Error("First argument to object_has must be an object.");
  }
  
  return new BoolVal(obj.properties.has(key));
};

// Math Functions
 const math_sqrt_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.sqrt(num));
};

 const math_power_native = (args, env) => {
  const base = args[0].value;
  const exp = args[1].value;
  return new NumberVal(Math.pow(base, exp));
};

 const math_abs_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.abs(num));
};

 const math_round_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.round(num));
};

 const math_floor_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.floor(num));
};

 const math_ceil_native = (args, env) => {
  const num = args[0].value;
  return new NumberVal(Math.ceil(num));
};

// Type Checking Functions
 const is_number_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "number");
};

 const is_string_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "string");
};

 const is_array_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "array");
};

 const is_object_native = (args, env) => {
  const val = args[0];
  return new BoolVal(val.type === "object");
};

 const nativeFunctionRegistry = {
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
 const call_native_function = (fnName, args, env, evaluate) => {
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


// --- Source: ./runtime/interpreter.js ---







// Main evaluate function to handle different AST nodes
 const evaluate = (astNode, env) => {
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
    case "ArrayLiteral":
      return evaluate_array_expression(astNode, env);
    case "Assignment":
      return evaluate_assignment(astNode, env);
    case "VarDeclaration":
      return evaluate_var_declaration(astNode, env);
    case "Program":
      return evaluate_program(astNode, env);
    case "MemberExpression":
      return evaluate_member_expression(astNode, env);
    case "ComparisonExpression":
      return evaluate_comparison_expression(astNode, env);
    case "LogicalExpression":
      return evaluate_logical_expression(astNode, env);
    case "UnaryExpression":
      return evaluate_unary_expression(astNode, env);
    case "NativeFunctionCall":
      return call_native_function(astNode.name, astNode.args, env, evaluate);
    case "IfStatement":
      return evaluate_ipo_statement(astNode, env);
    case "WhileStatement":
      return evaluate_while_statement(astNode, env);
    case "ForStatement":
      return evaluate_for_statement(astNode, env);
    case "SwitchStatement":
      return evaluate_switch_statement(astNode, env);
    case "BreakStatement":
      return evaluate_break_statement();
    case "ContinueStatement":
      return evaluate_continue_statement();
    case "FunctionDeclaration":
      return evaluate_function_declaration(astNode, env);
    case "ReturnStatement":
      return evaluate_return_statement(astNode, env);
    case "TryCatchStatement":
      return evaluate_try_catch_statement(astNode, env);
    case "CallExpression":
      return evaluate_call_expression(astNode, env);

    default:
      console.error(
        chalk.red("Machane pani kitti ") +
          chalk.yellow(
            "This AST Node has not yet been setup for interpretation.",
            astNode
          )
      );
      return MK_NULL();
  }
};


// --- Source: ./main.js ---







const yellow = chalk.hex("#fbde4d");
const red = chalk.bold.hex("#a00");

const createGlobalEnv = () => {
  const env = new Environment();
  for (const [name, func] of Object.entries(nativeFunctionRegistry)) {
    env.declareVar(name, new NativeFunctionVal(func), true);
  }
  return env;
};

// Function to animate text
const typeText = async (text, delay = 100) => {
  let i = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      process.stdout.write(text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        console.log();
        resolve();
      }
    }, delay);
  });
};

const startREPL = () => {
  const parser = new Parser();
  const env = createGlobalEnv();
  console.log(chalk.green("Machane, REPL set aayi! (Nirthan 'exit' adicha mathi)"));
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: yellow(">> "),
  });

  let codeBuffer = [];

  rl.prompt();

  rl.on("line", (line) => {
    if (line.trim() === "exit") {
      rl.close();
    } else if (line.trim() === "") {
      // If the user enters a blank line, assume they are done entering code
      const fullCode = codeBuffer.join("\n");
      codeBuffer = []; // Clear the buffer

      try {
        const program = parser.produceAST({ sourceCode: fullCode });
        const result = evaluate(program, env);
        // if (result !== undefined) {
        //   console.log(yellow(result));
        // }
      } catch (error) {
        console.error(
          chalk.red("Machane pani kitti: ") + chalk.yellow(error.message)
        );
      }

      rl.setPrompt(yellow(">> "));
      rl.prompt();
    } else {
      // Add the line to the buffer and continue reading input
      codeBuffer.push(line);
      rl.setPrompt(yellow(".. "));
      rl.prompt();
    }
  }).on("close", () => {
    console.log(chalk.green("\nSheri Enna!"));
    // Do not call process.exit here to keep the program running
  });
};

// Main CLI function to execute a script file
const machan_script_cli = async (filePath) => {
  const parser = new Parser();
  const env = createGlobalEnv();

  try {
    const input = await fs.readFile(filePath, "utf-8");
    const lines = input.split("\n");

    if (lines[0].trim() !== "Machane!!") {
      console.log(chalk.yellow("First Line 'Mahcnae!!' eenu aarikanam buddy"));
      return;
    }

    const scriptContent = lines.slice(1).join("\n");
    const program = parser.produceAST({ sourceCode: scriptContent });

    await evaluate(program, env);
  } catch (error) {
    console.error(
      chalk.red("Machane pani kitti: ") + chalk.yellow(error.message)
    );
  }
};

// Function to get file path interactively
const getFilePath = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "filePath",
      message: chalk.cyan("📄 Machane file name adiku:"),
      default: "./src.ms",
      validate: (input) => {
        if (!input) {
          return chalk.yellow(" ⚠️ Please enter a file path.");
        }
        return true;
      },
    },
  ]);
  return answers.filePath;
};

// Function to show welcome message
const showWelcomeMessage = async () => {
  console.log(
    yellow(figlet.textSync("MachanScript", { horizontalLayout: "full" }))
  );
  console.log(red("Welcome to MachanScript V3.0\n"));
  await typeText(
    chalk.gray("A adipoli programming language written in Javascript.")
  );
};

// Main script execution
const fileNameArg = process.argv[2];

if (fileNameArg) {
  machan_script_cli(fileNameArg);
} else {
  await showWelcomeMessage(); // Ensure welcome message is shown before prompting

  const isInteractive = await inquirer.prompt([
    {
      type: "confirm",
      name: "replMode",
      message: chalk.cyan("🚀 Do you want to code in MachanScript cli?"),
      default: true,
    },
  ]);

  if (isInteractive.replMode) {
    startREPL();
  } else {
    const filePath = await getFilePath();
    machan_script_cli(filePath);
  }
}
