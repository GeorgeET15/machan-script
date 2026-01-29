# MachanScript 🥥

MachanScript is a [adipoli](https://www.akshharam.com/blog-detail/malayalam-slang-words-every-indian-must-know#:~:text=Adipoli,which%20is%20superb%20or%20fascinating.) 😎 programming language written in Javascript. It's designed to be friendly, expressive, and strictly for the Machans.

## ✨ What's New in V3.0.0 ✨

- **User-Defined Functions**: Create your own `pani` with parameters and return values.
- **Try-Catch Error Handling**: Gracefully handle your "pani kitti" moments.
- **Logical Operators**: Support for `&&`, `||`, and `!`.
- **Enhanced Native Library**: 25+ new functions for Arrays, Strings, Objects, and Math.
- **Improved CLI & REPL**: Better experience with localized Malayalam error messages.
- **Smart Packager**: A robust bundling tool for deployments.

## 🚀 Getting Started

1. **Installation**: Install MachanScript globally using npm:

   ```sh
   npm i -g machan-script
   ```

2. **Run a script**:
   ```sh
   machane filename.ms
   ```

3. **Open REPL**:
   ```sh
   machane
   ```

## 📝 Syntax Overview

- `Machane!!` : Every script must start with this call.
- `// comment` : Single-line comment.
- `/* comment */` : Multi-line comment.
- `ithu variable = value aanu` : Variable declaration.
- `ithu const constant = value aanu` : Constant declaration.

### Control Flow
- `ipo (condition) anengi { ... } alengi { ... }` : If-else statement.
- `switch machane (value) { ... }` : Switch statement.
- `machane (condition) avane vare { ... }` : While loop.
- `for machane (init : condition : step) enit { ... }` : For loop.
- `break;` , `continue;` : Loop control.

### Functions & Errors
- `machane pani name(args) { ... }` : Define a function.
- `return value;` : Return from a function.
- `machane try cheyu { ... } pidiku (err) { ... }` : Try-catch block.

---

## 📚 Standard Library

### 🔢 Math Functions
`sqrt(n)`, `power(base, exp)`, `abs(n)`, `round(n)`, `floor(n)`, `ceil(n)`

### 🧵 String Functions
- `string_length(str)` : Character count.
- `string_upper(str)` / `string_lower(str)` : Case conversion.
- `string_split(str, sep)` : Returns an array.
- `string_substring(str, start, end)` : Extract parts.

### 📦 Array Functions
- `array_push(arr, val)` : Add to end.
- `array_pop(arr)` : Remove from end.
- `array_length(arr)` : Get size.
- `array_join(arr, sep)` : Stringify array.
- `array_slice(arr, start, end)` : Partial array.

### 💎 Object Functions
- `object_keys(obj)` , `object_values(obj)`
- `object_has(obj, key)`

### 🔍 Type Checking (Malayalam)
`number_ano(v)`, `string_ano(v)`, `array_ano(v)`, `object_ano(v)`

### 🛠️ Utility Functions
- `para(args...)` : The classic print function.
- `input_eduku(var, prompt)` : Get user input.
- `orangu(ms)` : Non-blocking sleep.
- `random(min, max, var?)` : Random number.
- `fact(n, var?)` : Factorial calculation.
- `innathe_date(bool?, var?)` : Current date/time.

---

## 💻 Examples

### Function & Try-Catch
```machan
Machane!!

machane pani checkNumber(x) {
    machane try cheyu {
        ipo (x < 0) anengi {
            para("Pani kitti: Negative number!");
            return null;
        }
        return sqrt(x);
    } pidiku (err) {
        para("Caught error: ", err);
    }
}

ithu res = checkNumber(25) aanu
para("Result: ", res); // 5
```

### Array Mapping
```machan
Machane!!

ithu colors = ["red", "green", "blue"] aanu
array_push(colors, "yellow");

para("Count: ", array_length(colors));
para("Colors: ", array_join(colors, " | "));
```

---

## 📦 Bundling for NPM
Use the built-in packager to bundle your MachanScript project into a single `index.js`:
```sh
npm run package
```

## 🛠️ VSCode Extension
Get the [MachanScript Extension](https://marketplace.visualstudio.com/items?itemName=GeorgeET15.machanscript) for syntax highlighting and snippets.

## 📝 Version History
- **v3.0.0**: Added functions, try-catch, logical ops, comments, line control, and 25+ native functions. Fully localized Malayalam errors.
- **v0.1.0**: Initial release with variables, objects, and basic loops.

## 🤝 Credits & License
Created by [GeorgeET15](https://georgeemmanuelthomas.dev). 
Licensed under [MIT](./LICENSE). Acknowledgement is appreciated!

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
