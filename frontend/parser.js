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
  BreakStatement,
  ContinueStatement,
  FunctionDeclaration,
  ReturnStatement,
  TryCatchStatement,
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
      case TokenType.NIRTH:
        this.eat(); // eat break kw
        return new BreakStatement();
      case TokenType.AAVANE:
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
      this.eat(); // Consume the 'alengi' keyword
      
      // Support 'alengi ipo' (else if)
      if (this.at().type === TokenType.IPO) {
         return new IfStatement(condition, thenBlock, this.parse_ipo_statement());
      }
      
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
    this.expect(TokenType.AAVANE, "Expected 'avane' keyword");
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
