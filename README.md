# MachanScript

MachanScript is a [adipoli](https://www.akshharam.com/blog-detail/malayalam-slang-words-every-indian-must-know#:~:text=Adipoli,which%20is%20superb%20or%20fascinating.) 😎 programming language written in Javascript.

## ✨ Getting Started ✨

To start using MachanScript, follow these simple steps:

1. **Installation**: Install MachanScript globally using npm:

   ```sh
   npm i -g machan-script
   ```

   Note :- Assuming that you have [Node.js](https://nodejs.org/en/download/package-manager) installed, if not please install before continuing

2. **Syntax Overview**:

   - `Machane!!` : Every MachanScript file should start by calling Machan, or else the code will not run.
   - `ithu varName = value aanu` : Used to declare variables.
   - `ithu const varName = value aanu` : Used to declare constant variables.
   - `ithu b = "Hello World" aanu` : Used to declare strings.
   - `ithu arr = [ 1 , 4 , 6 , 8 , 3 ]` : Used to declare arrays.
   - `ithu obj = { x : 100 , y : 200 , } aanu` : Example of creating objects.
   - `obj . x | obj . y` : Accessing object properties.

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

   - `.ms` : Save the file with `.ms` extension.

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

## Control Statements

MachanScript supports the following control statements:

- `ipo` : Used for conditional execution. Followed by a condition and a block of code to execute if the condition is true.
- `anengi` : Marks the beginning of the block of code to execute if the condition in an `ipo` statement is true.
- `alengi` : Marks the beginning of the block of code to execute if the condition in an `ipo` statement is false.
- `switch machane` : Used for conditional execution. Different cases are declared by `ipo` value `anengi` and the default it set by `onnum_alengi`.

## Loop Statements

MachanScript supports the following loop statements:

- `machane` : Used to create while loops. Followed by a condition and a block of code to execute repeatedly as long as the condition is true.
- `avane` and `vare` : Marks the beginning and end of the block of code to execute in a `machane` loop.
- `for machane` : Used to create for loops. Followed by a condition and a block of code to execute repeatedly as long as the condition is true.
- `enit` : Marks the beginning block of code to execute in a `for machane` loop.

## Examples 😉

### Conditional Execution ( `ipo`, `anengi`, `alengi` )

- Usage:

```machan
Machane!!

ithu x = 5 aanu

ipo ( x < 10 ) anengi {

  para ( " x is less than 10 " ) ;

} alengi {

  para ( "x is greater than or equal to 10" ) ;

}
```

### Conditional Execution ( `swicth machane`, `ipo`, `anengi`, `onnum_alengi` )

- Usage:

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

### While Loop ( `machane`, `avane`, `vare` )

- Usage:

```machan
Machane!!

ithu a = 1 aanu

machane ( a <= 5 ) avane vare {

  para ( a ) ;
  a = a + 1

}
```

### For Loop ( `for`, `machane`, `enit` )

- Usage:

```machan
Machane!!

for machane ( ithu i = 0 aanu : i < 5 : i = i + 1 ) enit {

   para ( i ) ;

}
```

### Machan Native Functions

#### `input_eduku`

Usage :

```machan
Machane!!

input_eduku ( w , "Enter a number, a string or an array: ") ;
para ( w ) ;
para ( w [ 2 ] ) ; //arrays
```

#### `orangu`

Usage :

```machan
Machane!!

ithu b = 10 aanu
ithu c = 0 aanu

machane ( c <= b ) avane vare {

    para ( c ) ;
    orangu ( 2000 ) ;
    c = c + 1
}
```

#### `cheruthu` , `veluthu`

Usage :

```machan
Machane!!

ithu arr = [ 3 , 5 , 6 , 9 , 7 , 101 ] aanu

cheruthu ( arr , small ) ;
para ( small ) ;

veluthu ( arr , 12 , 4 , 65 , 1 , 100 , 99 , large ) ;
para ( large ) ;
```

#### `innathe_date`

Usage :

```machan
Machane!!

inathe_date ( ) ;
inathe_date ( true ) ;
inathe_date ( true , y ) ;
inathe_date ( false , x ) ;
para ( "date: " , x ) ;
```

#### `vayiku`

Usage :

```machan
Machane!!

vayiku ( "./test1.txt" ) ;
ithu filePath = "./test1.txt" aanu
vayiku ( filePath ) ;
```

#### `ezhuthu`

Usage :

```machan
Machane!!

ezhuthu ( "./test1.txt", "Hello") ;
ithu y = "./test1.txt" aanu
ithu x = "Hello" aanu
ezhuthu ( y , x ) ;
```

#### `random`

Usage :

```machan
Machane!!

random ( 1 , 5 ) ;
random ( 1 , 5 , a ) ;
para ( a ) ;
```

#### `fact`

Usage :

```machan
Machane!!

fact ( 4 ) ;
fact ( 4 , a ) ;
para ( a ) ;
```

## Running Code 🚀

You can run MachanScript files from the command line using the following command:

```sh
machane filename.ms
```

## VSCode Extension

The [MachanScript](https://marketplace.visualstudio.com/items?itemName=GeorgeET15.machanscript) extension enables syntax highlighting in VSCode.

## Version History 📝

### v0.1 (June-2024)

- Initial release of MachanScript.
- Basic functionality for variable declaration, object creation, and control statements.
- Machan Native Functions like `para`, `input_eduku`, `cheruthu`, `veluthu`, `inathe_date`, `vayiku`, `ezhuthu`, `random`, `fact`, `orangu`.
- Support for conditional execution with `ipo`, `anengi`, `alengi`, `switch machane`, `oonum-alengi`.
- Support for `while` Loops with `machane`, `avane`, `vare`.
- Support for `for` loops with `for`, `enit`.

## Author 😁

MachanScript was created by `GeorgeET15`. You can find more about the him on [GitHub](https://github.com/GeorgeET15), [LinknedIn](https://www.linkedin.com/in/george-emmanuel-thomas-518060202/).
