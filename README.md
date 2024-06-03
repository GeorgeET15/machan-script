# MachanScript

MachanScript is a simple scripting language designed for ease of use and readability. It offers basic functionality for variable declaration, object creation, and native function invocation.

## Getting Started

To start using MachanScript, follow these simple steps:

1. **Installation**: No installation is required. MachanScript is a lightweight language that can be run directly in your browser console or in any JavaScript environment.

2. **Syntax Overview**:

   - `ithu varName = value aanu`: Used to declare variables.
   - `ithu const variable = value aanu`: Used to declare constant variables.
   - `ithu obj = { x : 100 , y : 200 , } aanu`: Example of creating objects.
   - `obj . x | obj . y`: Accessing object properties.
   - `para () ;`: Native function for printing.

3. **Examples**:

   - Variable Declaration:

     ```
     ithu variableName = value aanu
     ithu const constantName = value aanu
     ```

   - Object Creation:

     ```
     ithu obj = { x : 100 , y : 200 , } aanu
     ```

   - Printing:
     ```
     para ( "Hello World!!" ) ;
     para ( obj . x + obj . y ) ;
     ```

## Native Functions

MachanScript provides the following native functions:

- `para( message ) ;`: Prints the message to the console.
- `input( varName , prompt ) ;`: Prompts the user to enter a value and assigns it to the variable specified by `varName`.
- `veluthu( arg1 , arg2 ) ;`: Returns the larger of the two arguments.
- `cheruthu( arg1 , arg2 ) ;`: Returns the smaller of the two arguments.

## Control Statements

MachanScript supports the following control statements:

- `ipo`: Used for conditional execution. Followed by a condition and a block of code to execute if the condition is true.
- `anengi`: Marks the beginning of the block of code to execute if the condition in an `ipo` statement is true.
- `alengi`: Marks the beginning of the block of code to execute if the condition in an `ipo` statement is false.
- `machane`: Used to create while loops. Followed by a condition and a block of code to execute repeatedly as long as the condition is true.
- `avane` and `vare`: Marks the beginning and end of the block of code to execute in a `machane` loop.

## Examples

### Conditional Execution (ipo, anengi, alengi)

- usage:

```
ithu x = 5 aanu
ipo ( x < 10 ) anengi { para( "x is less than 10" ) ; } alengi { para( "x is greater than or equal to 10" ) ; }
```

### While Loop (machane, avane, vare)

- usage:

```
ithu a = 1 aanu

machane ( a == 5 ) avane vare { para ( a ) ; a = a + 1 }
```
