# MachanScript

MachanScript is a [adipoli](https://www.akshharam.com/blog-detail/malayalam-slang-words-every-indian-must-know#:~:text=Adipoli,which%20is%20superb%20or%20fascinating.) 😎 programming language written in Javascript.

## ✨ Getting Started ✨

To start using MachanScript, follow these simple steps:

1. **Installation**: Install MachanScript globally using npm:

   ```sh
   npm i -g machan-script.
   ```

2. **Syntax Overview**:

   - `ithu varName = value aanu`: Used to declare variables.
   - `ithu const variable = value aanu`: Used to declare constant variables.
   - `ithu obj = { x : 100 , y : 200 , } aanu`: Example of creating objects.
   - `obj.x | obj.y`: Accessing object properties.
   - `para() ;`: Native function for printing.

3. **Examples**:

   - Variable Declaration:

     ```machan
     ithu variableName = value aanu
     ithu const constantName = value aanu
     ```

   - Object Creation:

     ```machan
     ithu obj = { x : 100 , y : 200 , } aanu
     ithu const obj = { z : 300 , v : 400 , } aanu
     ```

   - Printing:
     ```machan
     para ( "Hello World!!" ) ;
     para ( obj.x + obj.y ) ;
     ```

## Native Functions

MachanScript provides the following native functions:

- `para(message);`: Prints the message to the console.
- `input(varName, prompt);`: Prompts the user to enter a value and assigns it to the variable specified by `varName`.
- `veluthu(arg1, arg2);`: Returns the larger of the two arguments.
- `cheruthu(arg1, arg2);`: Returns the smaller of the two arguments.

## Control Statements

MachanScript supports the following control statements:

- `ipo`: Used for conditional execution. Followed by a condition and a block of code to execute if the condition is true.
- `anengi`: Marks the beginning of the block of code to execute if the condition in an `ipo` statement is true.
- `alengi`: Marks the beginning of the block of code to execute if the condition in an `ipo` statement is false.
- `machane`: Used to create while loops. Followed by a condition and a block of code to execute repeatedly as long as the condition is true.
- `avane` and `vare`: Marks the beginning and end of the block of code to execute in a `machane` loop.

## Examples 😉

### Conditional Execution (`ipo`, `anengi`, `alengi`)

- Usage:

```machan
ithu x = 5 aanu

ipo (x < 10) anengi { para ( " x is less than 10 " ) ; } alengi { para ( "x is greater than or equal to 10" ) ; }
```

### While Loop (`machane`, `avane`, `vare`)

- Usage:

```machan
ithu a = 1 aanu

machane (a == 5) avane vare { para ( a ) ; a = a + 1 }
```

### For Loop (`for`, `machane`, `enit`)

- Usage:

```machan
for ( ithu i = 0 aanu : i < 5 : i = i + 1 ) enit { para ( i ) ; }
```

## Running Code 🚀

You can run MachanScript files from the command line using the following command:

```sh
machane filename.ms
```

## VSCode Extension

MachanScript also has a VSCode extension for syntax highlighting. You can install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=georgeet15.machan-script).

## Version History

### v0.1 (June-2024)

- Initial release of MachanScript.
- Basic functionality for variable declaration, object creation, and control statements.
- Native functions for printing, input, and basic arithmetic operations.
- Support for conditional execution with `ipo`, `anengi`, `alengi`.
- Support for `while` Loops with `machane`, `avane`, `vare`.
- Support for `for` loops with `for`, `enitu`, `para`.

## Author 😁

MachanScript was created by [GeorgeET15](https://github.com/GeorgeET15). You can find more about the him on [GitHub](https://github.com/GeorgeET15), [LinknedIn](https://www.linkedin.com/in/george-emmanuel-thomas-518060202/).
