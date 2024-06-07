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

  // End of File
  EOF: "EOF",
};

export const tokenize = (sourceCode) => {
  const tokens = [];
  const src = sourceCode.match(/(['"]).*?\1|\S+/g) || [];

  for (const word of src) {
    if (!isNaN(word)) {
      tokens.push(new Token(word, TokenType.NUMBER));
    } else if (/^"[^"]*"$/.test(word) || /^'[^']*'$/.test(word)) {
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
    } else if (word.startsWith('"') && word.endsWith('"')) {
      tokens.push(new Token(word.slice(1, -1), TokenType.STRING));
    } else if (/^"[^"]*"$/.test(word) || /^'[^']*'$/.test(word)) {
      tokens.push(new Token(word.slice(1, -1), TokenType.STRING));
    } else {
      const tokenType =
        {
          "=": TokenType.EQUAL,
          "+": TokenType.PLUS,
          "-": TokenType.MINUS,
          "*": TokenType.STAR,
          "/": TokenType.SLASH,
          "%": TokenType.PERCENT,
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
        }[word] || TokenType.IDENTIFIER;

      tokens.push(new Token(word, tokenType));
    }
  }

  tokens.push(new Token("", TokenType.EOF));
  return tokens;
};
