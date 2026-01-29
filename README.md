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
   - `nirth;` , `continue;` : Control loop execution.
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

   - Save the file with `.ms` extension.

## Native Functions

MachanScript provides the following native functions:

- `para ( message ) ;` : Prints the message to the console.
- `input_eduku ( varName , prompt ) ;` : Prompts the user to enter a value and assigns it to the variable specified by `varName`.
- `orangu ( milliseconds ) ;` : It will synchronously pause the execution of other operations for the specified number of milliseconds before resuming.
- `veluthu ( arg1 , arg2...., varName ) ;` : Returns the largest. We can either pass sperate values or an array or seperate values and an array. The returned value will be stored in the last passed `varName`.
- `cheruthu ( arg1 , arg2...., varName) ;` : Same as of `veluthu` except it returns the smallest value
- `inathe_date ( boolVal , varName ) ;` : Returns the date, if true it also returns the time, if we pass the `varName` the returned value will be stored in the new variable created.
- `vayiku ( file , varName ) ;` : Prints the content in the file, if we pass the `varName` the returned content will be stored in the new variable created.
- `ezhuthu ( file , data ) ;` : Stores the data we passed to the file. We can either directly pass a string or a variable containing a string,
- `random ( min , max , varName ) ;` : Returns a random number between the min and max range, if we pass the `varName` the returned value will be stored in the new variable created.
- `fact ( number , varName ) ;` : Returns the factorial of the number, if we pass the `varName` the returned value will be stored in the new variable created.

### Array Functions (New in V3.0)
- `array_push ( arr , val ) ;` : Adds an element to the end of the array.
- `array_pop ( arr ) ;` : Removes and returns the last element.
- `array_length ( arr ) ;` : Returns the number of elements in the array.
- `array_join ( arr , separator ) ;` : Joins array elements into a string.
- `array_slice ( arr , start , end ) ;` : Returns a portion of the array.

### String Functions (New in V3.0)
- `string_length ( str ) ;` : Returns the character count.
- `string_substring ( str , start , end ) ;` : Extracts parts of the string.
- `string_upper ( str ) ;` : Converts string to uppercase.
- `string_lower ( str ) ;` : Converts string to lowercase.
- `string_split ( str , separator ) ;` : Splits string into an array.

### Math Functions (New in V3.0)
- `sqrt ( n ) ;`, `power ( base , exp ) ;`, `abs ( n ) ;`, `round ( n ) ;`, `floor ( n ) ;`, `ceil ( n ) ;`

### Type Checking (Malayalam)
- `number_ano ( val ) ;` : Is it a number?
- `string_ano ( val ) ;` : Is it a string?
- `array_ano ( val ) ;` : Is it an array?
- `object_ano ( val ) ;` : Is it an object?

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

### 1. Fibonacci Series (Recursion)
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

### 2. Complex Student Management (Objects & Arrays)
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
for machane (ithu s = 0 aanu : s < array_length(students) : s = i + 1) enit {
  ithu student = students[s] aanu
  para(student.name, " scored an average of: ", average(student.marks));
}
```

### 3. File Loader with Try-Catch (Robustness)
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

### 4. Advanced Loop Control (`nirth` & `continue`)
```machan
Machane!!

para("Finding the first number divisible by 7 and 3...");
ithu n = 1 aanu
machane (true) aavane vare {
  ipo (n % 7 == 0 && n % 3 == 0) anengi {
    para("Found it: ", n);
    nirth; // Stop the infinite loop
  }
  n = n + 1
  continue; // redundent but works!
}
```

### 5. Type checking and Native Math
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
machane filename.ms
```

## VSCode Extension

The [MachanScript](https://marketplace.visualstudio.com/items?itemName=GeorgeET15.machanscript) extension enables syntax highlighting in VSCode.

## Version History 📝

### v3.0.0 (August-2024)

- New and improved CLI
- Users can program in the CLI
- Fully localized Malayalam error messages
- Added Functions, Try-Catch, and Logical Operators
- Huge standard library upgrade (Arrays, Strings, Math)
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
