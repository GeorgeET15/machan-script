import chalk from "chalk";
import {
  Statement,
  Program,
  Expression,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  VarDeclaration,
  Assignment,
  Property,
  ObjectLiteral,
  CallExpression,
  MemberExpression,
  StringLiteral,
  NativeFunctionCall,
  ArrayLiteral,
  IfStatement,
  WhileStatement,
  ForStatement,
  SwitchStatement,
  CaseStatement,
  DefaultStatement,
  LogicalExpression,
  UnaryExpression,
} from "./ast.js";

import { tokenize, Token, TokenType } from "./lexer.js";

export class Parser {
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
      console.error(
        chalk.red("Machane pani kitti ") + chalk.yellow(err_message)
      );
      process.exit(1);
    }

    return prev;
  }

  produceAST = ({ sourceCode }) => {
    this.tokens = tokenize(sourceCode);
    const program = new Program();

    while (this.not_eof()) {
      // Corrected: added parentheses to call not_eof method
      program.body.push(this.parse_statement());
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
        return this.parse_while_statement(); // Add support for while loops
      case TokenType.FOR:
        return this.parse_for_statement();
      case TokenType.SWITCH:
        return this.parse_switch_statement(); // Add support for switch statements

      default:
        return this.parse_expression();
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
        "Expected identifier name following 'ithu const'"
      ).value;
    } else {
      identifier = this.expect(
        TokenType.IDENTIFIER,
        "Expected identifier name following 'ithu'"
      ).value;
    }

    this.expect(TokenType.EQUAL, "Equals expected in var declaration");

    const declaration = new VarDeclaration(
      isConstant,
      identifier,
      this.parse_expression()
    );

    this.expect(TokenType.AANU, "Var declaration must end with 'aanu'");

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
    if (this.at().type === TokenType.NOT) {
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
    this.expect(
      TokenType.LEFT_PAREN,
      "Expected open parenthesis after function call"
    );

    const args = this.parse_arguments();
    this.expect(
      TokenType.RIGHT_PAREN,
      "Expected closing parenthesis after function call"
    );

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
        console.log(
          chalk.red("Machane pani kitti ") +
            chalk.yellow("Unexpected token found while parsing!", tk)
        );
        process.exit(1);
    }
  }
}
