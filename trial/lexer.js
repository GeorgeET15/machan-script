export class Token {
  constructor(value, type) {
    this.value = value;
    this.type = type;
  }

  equals(otherToken) {
    return this.value === otherToken.value && this.type === otherToken.type;
  }
}

export const TokenType = {
  NUMBER: "Number",
  IDENTIFIER: "Identifier",
  KEYWORD: "Keyword",
  STRING: "String",
  UNDEFINED: "Undefined",
  LET: "Let",
  CONST: "Const",

  // Operators
  // PLUS: "Plus",
  // MINUS: "Minus",
  // MULTIPLY: "Multiply",
  // DIVIDE: "Divide",
  // MODULO: "Modulo",
  // ASSIGN: "Assign",
  EQUAL: "Equal",
  // NOT_EQUAL: "NotEqual",
  // STRICT_EQUAL: "StrictEqual",
  // STRICT_NOT_EQUAL: "StrictNotEqual",
  // GREATER_THAN: "GreaterThan",
  // LESS_THAN: "LessThan",
  // GREATER_THAN_EQUAL: "GreaterThanEqual",
  // LESS_THAN_EQUAL: "LessThanEqual",
  // AND: "And",
  // OR: "Or",
  // NOT: "Not",

  // Punctuation
  LEFT_PAREN: "LeftParen",
  RIGHT_PAREN: "RightParen",
  // LEFT_BRACE: "LeftBrace",
  // RIGHT_BRACE: "RightBrace",
  // LEFT_BRACKET: "LeftBracket",
  // RIGHT_BRACKET: "RightBracket",
  // COMMA: "Comma",
  SEMICOLON: "Semicolon",
  // DOT: "Dot",
  // COLON: "Colon",
  // QUESTION: "Question",

  // Comments
  // COMMENT: "Comment",

  // End of File
  EOF: "EOF",
};

const keywords = {
  let: TokenType.LET,
  const: TokenType.CONST,
};

export const tokenize = (sourceCode) => {
  const tokens = [];
  const src = sourceCode.match(/(['"]).*?\1|\S+/g) || []; // Split by whitespace or string literals

  while (src.length > 0) {
    const word = src.shift();

    if (!isNaN(word)) {
      tokens.push(new Token(word, TokenType.NUMBER));
    } else if (/^"[^"]*"$/.test(word) || /^'[^']*'$/.test(word)) {
      tokens.push(new Token(word.slice(1, -1), TokenType.STRING));
    } else if (word.toLowerCase() in keywords) {
      tokens.push(new Token(word, keywords[word.toLowerCase()]));
    } else if (/^[a-zA-Z_]\w*$/.test(word)) {
      if (word === "undefined") {
        tokens.push(new Token(word, TokenType.UNDEFINED));
      } else {
        tokens.push(new Token(word, TokenType.IDENTIFIER));
      }
    } else {
      switch (word) {
        case "+":
          tokens.push(new Token(word, TokenType.PLUS));
          break;
        case "-":
          tokens.push(new Token(word, TokenType.MINUS));
          break;
        case "*":
          tokens.push(new Token(word, TokenType.MULTIPLY));
          break;
        case "/":
          tokens.push(new Token(word, TokenType.DIVIDE));
          break;
        case "%":
          tokens.push(new Token(word, TokenType.MODULO));
          break;
        case "=":
          tokens.push(new Token(word, TokenType.ASSIGN));
          break;
        case "==":
          tokens.push(new Token(word, TokenType.EQUAL));
          break;
        case "!=":
          tokens.push(new Token(word, TokenType.NOT_EQUAL));
          break;
        case "===":
          tokens.push(new Token(word, TokenType.STRICT_EQUAL));
          break;
        case "!==":
          tokens.push(new Token(word, TokenType.STRICT_NOT_EQUAL));
          break;
        case ">":
          tokens.push(new Token(word, TokenType.GREATER_THAN));
          break;
        case "<":
          tokens.push(new Token(word, TokenType.LESS_THAN));
          break;
        case ">=":
          tokens.push(new Token(word, TokenType.GREATER_THAN_EQUAL));
          break;
        case "<=":
          tokens.push(new Token(word, TokenType.LESS_THAN_EQUAL));
          break;
        case "&&":
          tokens.push(new Token(word, TokenType.AND));
          break;
        case "||":
          tokens.push(new Token(word, TokenType.OR));
          break;
        case "!":
          tokens.push(new Token(word, TokenType.NOT));
          break;
        case "(":
          tokens.push(new Token(word, TokenType.LEFT_PAREN));
          break;
        case ")":
          tokens.push(new Token(word, TokenType.RIGHT_PAREN));
          break;
        case "{":
          tokens.push(new Token(word, TokenType.LEFT_BRACE));
          break;
        case "}":
          tokens.push(new Token(word, TokenType.RIGHT_BRACE));
          break;
        case "[":
          tokens.push(new Token(word, TokenType.LEFT_BRACKET));
          break;
        case "]":
          tokens.push(new Token(word, TokenType.RIGHT_BRACKET));
          break;
        case ",":
          tokens.push(new Token(word, TokenType.COMMA));
          break;
        case ";":
          tokens.push(new Token(word, TokenType.SEMICOLON));
          break;
        case ".":
          tokens.push(new Token(word, TokenType.DOT));
          break;
        case ":":
          tokens.push(new Token(word, TokenType.COLON));
          break;
        case "?":
          tokens.push(new Token(word, TokenType.QUESTION));
          break;
        default:
          tokens.push(new Token(word, TokenType.IDENTIFIER)); // Default to identifier if unknown
          break;
      }
    }
  }

  tokens.push(new Token("", TokenType.EOF)); // End of File token
  return tokens;
};

// Example usage
// const sourceCode = await Deno.readTextFile("./src.txt");
// const tokens = tokenize(sourceCode);
// console.log(tokens);
