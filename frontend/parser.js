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
        chalk.red("Parser Error:\n"),
        err_message,
        prev,
        " - Expecting: ",
        chalk.green(type)
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
      case TokenType.KEYWORD:
        return this.parse_keyword_statement();
      default:
        return this.parse_expression();
    }
  }

  parse_keyword_statement() {
    switch (this.at().value) {
      case "ithu":
      case "const":
        return this.parse_var_declaration();
      case "para":
      case "veluthu":
      case "cheruthu":
      case "input_eduku":
        return this.parse_native_function_call();
      case "ipo":
        return this.parse_ipo_statement(); // Add support for if statements
      case "machane":
        return this.parse_while_statement(); // Add support for while loops
      case "for":
        return this.parse_for_statement();

      default:
        console.error(
          chalk.red("Machane pani kitti ") +
            chalk.yellow("Unexpected keyword statement")
        );
        process.exit(1);
    }
  }

  parse_for_statement() {
    this.expect(TokenType.KEYWORD, "Expected 'for' keyword.");
    this.expect(TokenType.KEYWORD, "Expected 'machane' keyword.");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after 'for' keyword.");

    const init = this.parse_var_declaration();
    this.expect(TokenType.COLON, "Expected ';' after initialization.");

    const condition = this.parse_expression();
    this.expect(TokenType.COLON, "Expected ';' after condition.");

    const increment = this.parse_expression();
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after increment.");
    this.expect(TokenType.KEYWORD, "Expected 'enit' keyword.");

    const body = this.parse_block();

    return new ForStatement(init, condition, increment, body);
  }

  parse_ipo_statement() {
    this.expect(TokenType.KEYWORD, "Expected 'ipo' keyword.");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after 'ipo' keyword.");
    const condition = this.parse_expression();
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after condition.");
    this.expect(TokenType.KEYWORD, "Expected 'anengi' keyword.");

    const thenBlock = this.parse_block();

    if (this.at().value === "alengi") {
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
    this.expect(TokenType.KEYWORD, "Expected 'machane' keyword");
    this.expect(TokenType.LEFT_PAREN, "Expected '(' after 'while'");
    const condition = this.parse_expression();
    this.expect(TokenType.RIGHT_PAREN, "Expected ')' after while condition");
    this.expect(TokenType.KEYWORD, "Expected 'avane' keyword");
    this.expect(TokenType.KEYWORD, "Expected 'vare' keyword");

    const body = this.parse_block();

    return new WhileStatement(condition, body);
  }

  parse_var_declaration() {
    this.expect(TokenType.KEYWORD, "Expected 'ithu' keyword");

    let isConstant = false;

    if (this.at().type === TokenType.IDENTIFIER) {
      const identifier = this.eat().value;
      this.expect(TokenType.EQUAL, "Equals expected in var declaration");

      const declaration = new VarDeclaration(
        isConstant,
        identifier,
        this.parse_expression()
      );

      this.expect(TokenType.KEYWORD, "Var declaration must end with 'aanu'");

      return declaration;
    } else if (
      this.at().type === TokenType.KEYWORD &&
      this.at().value === "const"
    ) {
      this.eat();
      isConstant = true;

      const identifier = this.expect(
        TokenType.IDENTIFIER,
        "Expected identifier name following 'ithu const'"
      ).value;

      this.expect(TokenType.EQUAL, "Equals expected in var declaration");

      const declaration = new VarDeclaration(
        isConstant,
        identifier,
        this.parse_expression()
      );

      this.expect(TokenType.KEYWORD, "Var declaration must end with 'aanu'");

      return declaration;
    } else {
      throw new Error("Unexpected token found while parsing var declaration");
    }
  }

  parse_expression() {
    return this.parse_assignment_expression();
  }

  parse_assignment_expression() {
    const left = this.parse_object_expression();
    if (this.at().type == TokenType.EQUAL) {
      this.eat();
      const value = this.parse_assignment_expression();
      return new Assignment(left, value);
    }

    return left;
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
          "Machane pani kitti " +
            chalk.yellow("Unexpected token found while parsing!")
        );
        process.exit(1);
    }
  }
}
