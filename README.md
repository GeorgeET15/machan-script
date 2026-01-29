# MachanScript

MachanScript is a [adipoli](https://www.akshharam.com/blog-detail/malayalam-slang-words-every-indian-must-know#:~:text=Adipoli,which%20is%20superb%20or%20fascinating.) 😎 programming language written in Javascript.

## ✨ Getting Started ✨

To start using MachanScript, follow these simple steps:

1. **Installation**: Install MachanScript globally using npm:

   ```sh
   npm i -g machan-script
   ```

   Note :- Assuming that you have [Node.js](https://nodejs.org/en/download/prebuilt-installer) installed, if not please install before continuing

2. **Syntax Overview**:

   - `Machane!!` : Every MachanScript file should start by calling Machan, or else the code will not run.
   - `ithu varName = value aanu` : Used to declare variables.
   - `ithu const varName = value aanu` : Used to declare constant variables.
   - `ithu b = "Hello World" aanu` : Used to declare strings.
   - `ithu arr = [ 1 , 4 , 6 , 8 , 3 ] aanu` : Used to declare arrays.
   - `ithu obj = { x : 100 , y : 200 , } aanu` : Example of creating objects.
   - `obj . x | obj . y` : Accessing object properties.
   - `// comment` : Single-line comment.
   - `/* comment */` : Multi-line comment (New in V3.0).
   - `nirth;` : Break out of loops.
   - `aavane;` : Continue to next iteration.
   - `return value;` : Return from your functions.

3. **Examples**:

   - Variable Declaration:

     ```machan
     ithu variableName = value aanu
     ithu const constantName = value aanu
     ```

   - Object Creation:

     ```machan
     ithu obj1 = { x : 100 , y : 200 , } aanu
     ithu const obj2 = { z : 300 , v : 400 , } aanu
     ```

   - Printing:
     ```machan
     para ( "Hello World!!" ) ;
     para ( "Sum: " ,  obj1 . x + obj2 . z ) ;
     ```

4. **Saving the file**:

   - Save the file with `.mc` extension.

## Native Functions

MachanScript provides a variety of built-in functions to handle I/O, math, data structures, and more.

### Core Utilities
- `para ( ...args ) ;` : Prints messages to the console.

  ```machan
  para("Hello", "Machan!");
  ```
- `input_eduku ( varName , prompt ) ;` : Gets user input.
  ```machan
  input_eduku(name, "What is your name? ");
  ```
- `orangu ( ms ) ;` : Pause execution (non-blocking).
  ```machan
  orangu(1000); // 1 second sleep
  ```
- `inathe_date ( includeTime? , varName? ) ;` : Get current date.
  ```machan
  inathe_date();          // Prints date
  inathe_date(true, d);   // Saves date & time to 'd'
  ```

### File Management
- `vayiku ( path , varName? ) ;` : Read file content.

  ```machan
  vayiku("./src.ms", data);
  ```
- `ezhuthu ( path , data ) ;` : Write to a file.
  ```machan
  ezhuthu("./log.txt", "Action completed");
  ```

### Array Operations
- `array_push ( arr , val ) ;`, `array_pop ( arr ) ;`
- `array_length ( arr ) ;`, `array_join ( arr , sep ) ;`, `array_slice ( arr , start , end ) ;`
  ```machan
  ithu myArr = [1, 2] aanu
  array_push(myArr, 3);          // [1, 2, 3]
  ithu last = array_pop(myArr) aanu // 3
  para(array_join(myArr, "-"));   // "1-2"
  ```

### String Operations
- `string_length ( str ) ;`, `string_substring ( str , start , end ) ;`
- `string_upper ( str ) ;`, `string_lower ( str ) ;`, `string_split ( str , sep ) ;`
  ```machan
  ithu msg = "Hello World" aanu
  para(string_upper(msg));       // "HELLO WORLD"
  para(string_length(msg));      // 11
  ```

### Math & Numbers
- `sqrt(n)`, `power(b, e)`, `abs(n)`, `round(n)`, `floor(n)`, `ceil(n)`
- `random ( min , max , varName? ) ;` : Random integer.
- `fact ( n , varName? ) ;` : Factorial.
  ```machan
  para(sqrt(16));                // 4
  para(random(1, 10));           // Random 1-10
  ```

### Object Functions
- `object_keys(obj)`, `object_values(obj)`, `object_has(obj, key)`
  ```machan
  ithu user = {id: 1, name: "Ali"} aanu
  para(object_keys(user));       // ["id", "name"]
  ```

### Type Checking (Malayalam)
- `number_ano(v)`, `string_ano(v)`, `array_ano(v)`, `object_ano(v)`
  ```machan
  ipo (number_ano(10)) anengi { para("It is a number"); }
  ```

## Control Statements

MachanScript supports the following control statements:

- `ipo` : Used for conditional execution. Followed by a condition and a block of code to execute if the condition is true.
- `anengi` : Marks the beginning of the block of code to execute if the condition in an `ipo` statement is true.
- `alengi` : Marks the beginning of the block of code to execute if the condition in an `ipo` statement is false.
- `switch machane` : Used for conditional execution. Different cases are declared by `ipo` value `anengi` and the default it set by `onnum_alengi`.
- `machane try cheyu { ... } pidiku ( err ) { ... }` : Handle errors gracefully (New in V3.0).

## Loop Statements

MachanScript supports the following loop statements:

- `machane` : Used to create while loops. Followed by a condition and a block of code to execute repeatedly as long as the condition is true.
- `aavane` and `vare` : Marks the beginning and end of the block of code to execute in a `machane` loop.
- `for machane` : Used to create for loops. Followed by a condition and a block of code to execute repeatedly as long as the condition is true.
- `enit` : Marks the beginning block of code to execute in a `for machane` loop.
- `machane pani name ( args ) { ... }` : Define your own functions (New in V3.0).

## Examples 😉

### Basic Usage

#### Conditional Execution ( `ipo`, `anengi`, `alengi` )
```machan
Machane!!
ithu x = 5 aanu
ipo ( x < 10 ) anengi {
  para ( " x is less than 10 " ) ;
} alengi {
  para ( "x is greater than or equal to 10" ) ;
}
```

#### Switch Statement ( `switch machane` )
```machan
Machane!!
input_eduku ( x , "Enter a number: ") ;
switch machane ( x ) {
  ipo 1 anengi {
    para ( " You selected 1 " ) ;
  }
  ipo 2 anengi {
    para ( " You selected 2 " ) ;
  }
  onnum_alengi {
    para ( "MachanScript" ) ;
  }
}
```

#### While Loop ( `machane`, `aavane`, `vare` )
```machan
Machane!!
ithu a = 1 aanu
machane ( a <= 5 ) aavane vare {
  para ( a ) ;
  a = a + 1
}
```

#### For Loop ( `for`, `machane`, `enit` )
```machan
Machane!!
for machane ( ithu i = 0 aanu : i < 5 : i = i + 1 ) enit {
   para ( i ) ;
}
```

#### Function Declaration ( `machane pani` )
```machan
Machane!!
machane pani add(a, b) {
  return a + b;
}
ithu sum = add(10, 20) aanu
para(sum) ;
```

---

### Rich Showcase (New in V3.0)

#### 1. Fibonacci Series (Recursion)
```machan
Machane!!

machane pani fib(n) {
  ipo (n <= 1) anengi {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

for machane (ithu i = 0 aanu : i < 10 : i = i + 1) enit {
  para("Fib(", i, ") = ", fib(i));
}
```

#### 2. Complex Student Management (Objects & Arrays)
```machan
Machane!!

ithu students = [
  { name: "Rahul", marks: [80, 90, 75] },
  { name: "Anu", marks: [95, 85, 100] }
] aanu

machane pani average(marks) {
  ithu sum = 0 aanu
  ithu len = array_length(marks) aanu
  for machane (ithu i = 0 aanu : i < len : i = i + 1) enit {
    sum += marks[i]
  }
  return sum / len;
}

para("--- Student Report ---");
for machane (ithu s = 0 aanu : s < array_length(students) : s = s + 1) enit {
  ithu student = students[s] aanu
  para(student.name, " scored an average of: ", average(student.marks));
}
```

#### 3. File Loader with Try-Catch (Robustness)
```machan
Machane!!

machane pani safeLoad(path) {
  machane try cheyu {
    para("Loading file: ", path);
    vayiku(path, content) ;
    return content;
  } pidiku (err) {
    para("⚠️ Machane pani kitti: ", err);
    return null;
  }
}

ithu data = safeLoad("./config.ms") aanu
ipo (data != null) anengi {
  para("File content: ", data);
}
```

#### 4. Advanced Loop Control (`nirth` & `aavane`)
```machan
Machane!!

para("Finding the first number divisible by 7 and 3...");
ithu n = 1 aanu
machane (true) aavane vare {
  ipo (n % 7 == 0 && n % 3 == 0) anengi {
    para("Found it: ", n);
    nirth; // Stop the infinite loop
  }
  n = n + 1;
  aavane; // Continue to next iteration (redundant but works!)
}
```

#### 5. Type checking and Native Math
```machan
Machane!!

ithu input = 16 aanu
ipo (number_ano(input)) anengi {
  para("Square root of ", input, " is ", sqrt(input));
} alengi {
  para("Input is not a number!");
}

para("2 raised to 10 is: ", power(2, 10));
```




## Running Code 🚀

You can run MachanScript files from the command line using the following command:

```sh
machane filename.mc
```

## VSCode Extension

The [MachanScript](https://marketplace.visualstudio.com/items?itemName=GeorgeET15.machanscript) extension enables syntax highlighting in VSCode.

## Version History 📝

### v3.1.0 (January-2026)

- **User-defined functions** with `machane pani` syntax and `return` keyword
- **Try-Catch error handling** (`machane try cheyu ... pidiku`)
- **Logical operators** (`&&`, `||`, `!`)
- **Comprehensive test suite** covering all language features
- **Huge standard library upgrade**:
  - **Array operations**: `array_push`, `array_pop`, `array_length`, `array_join`, `array_slice`
  - **String operations**: `string_length`, `string_substring`, `string_upper`, `string_lower`, `string_split`
  - **Object functions**: `object_keys`, `object_values`, `object_has`
  - **Type checking**: `number_ano`, `string_ano`, `array_ano`, `object_ano`
  - **Math functions**: `sqrt`, `power`, `abs`, `round`, `floor`, `ceil`
- Enhanced native function support in expressions
- Improved **else-if** (`alengi ipo`) syntax support
- Updated Malayalam keywords (`aavane` for continue)
- Multi-line comments support (`/* */`)

### v3.0.0 (August-2024)

- New and improved CLI with interactive REPL
- Fully localized Malayalam error messages
- Smart Bundler/Packager for deployment

### v0.1 (June-2024)

- Initial release of MachanScript.
- Basic functionality for variable declaration, object creation, and control statements.
- Machan Native Functions like `para`, `input_eduku`, `cheruthu`, `veluthu`, `inathe_date`, `vayiku`, `ezhuthu`, `random`, `fact`, `orangu`.
- Support for conditional execution with `ipo`, `anengi`, `alengi`, `switch machane`, `oonum-alengi`.
- Support for `while` Loops with `machane`, `avane`, `vare`.
- Support for `for` loops with `for`, `enit`.

## Author 😁

MachanScript was created by [GeorgeET15](https://georgeemmanuelthomas.dev). You can find more about the him on [GitHub](https://github.com/GeorgeET15), [LinknedIn](https://www.linkedin.com/in/george-emmanuel-thomas-518060202/).

## License

This project is licensed under the [MIT License](./LICENSE). Please provide appropriate credit to the author when using this software. Contributions are welcome!

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## Credit

If you use MachanScript in your project, please acknowledge the author, **George Emmanuel Thomas**, in your documentation or credits section.
