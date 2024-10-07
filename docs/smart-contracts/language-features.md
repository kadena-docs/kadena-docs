---
title: Language features and conventions
id: lang-features
sidebar_position: 3
description: "Learn the basics of Pact programming language features and coding conventions with an introduction to built-in functions and writing your own simple functions."
---

# Language features and conventions

Pact has a lot in common with other programming languages, but some of its conventions and intentional restrictions are either unique or unlike other programming languages you might be familiar with.
This part of the documentation presents an overview of Pact language features and conventions you should be familiar with as you start reading and writing smart contract code.

## Command-line interpreter

In the [Quick start](/quickstart), you got a first look at writing Pact smart contract code and using the Pact command-line interpreter, also referred to as the Pact read-eval-print-loop (REPL) environment.
The Pact REPL enables you to write and execute Pact code interactively from the command-line. but its real power lies in the ability to execute code in smart contract modules—that is, `.pact` files—or in test files with the `.repl` file extension that help you test your code as you go.
With test `.repl` files, you can execute `.pact` module code and take advantage of features that are only available to use in`.repl` files run by the Pact REPL interpreter.
For example, `.repl` files can include functions to set up environment data that's required for testing, but that is otherwise difficult to replicate in a test.
In most cases, you can use the features provided by the Pact REPL in combination with an integrated development environment (IDE), like Visual Studio Code, to provide an end-to-end development environment. 

## Parenthesis

Pact uses parentheses to enclose each statement in the code.
The statements enclosed by parentheses are often referred to as symbolic expressions or **S-expressions**.
Parentheses enclose all module declarations, all function declarations, and any related logic.
Often, the code requires nested parenthetical statements to resolve the logic.
For example, the outermost parentheses in the following code contain the **helloWorld** module:

```pact
(module helloWorld 'admin-keyset
  (defun hello (name)
    (format "Hello {}!" [name]))
)
```

Within the module `helloworld` declaration, the next set of parentheses contain a `hello` function declaration that includes an expression—also enclosed by parentheses—that uses the `format` built-in function.

## Comments

There are several ways that you can embed comments in Pact programs.
The most common convention is to use semicolons (;) at the start or end of a line to add comments in smart contracts.
With this notation, all comments are introduced by a single semi-colon followed by text to the end of the line.
Although there's no difference between using a single semi-colon and multiple semi-colons, it's common for code to follow a convention similar to the following for readability:

- A single semicolon (;) for short notes on a single line of code. 
  
  ```pact
  ; First Pact module
  (module greeting GOVERNANCE
      (defcap GOVERNANCE () true)
        (defun say-hello(name:string)
          (format "Hello, {}! ~ from Kadena" [name])
        )
   )
  
  (say-hello "Pistolas") ; Call the hello function
  ```

- Two semicolons (;;) inside or above definitions that describe functions or other top-level forms.

  ```pact
  ;;  In this example, the module defines a table for storing greeting 
  ;;  names and two functions:
  ;; 
  ;;  - (say-hello-to "name")
  ;;  - (greet)
  ```

- Three semicolons (;;;) or more file-level comments or to separate larger sections of code.
  
  ```pact
  ;;; Accounts module demonstrates using row-level keysets, private pacts, and escrow.
  ;;; Version: 0.2 
  ;;; Author: Stuart Popejoy
  ```

Depending on where you want to add a comment, you can also enclose strings using double quotation marks (`" "`) with or without the `@doc` metadata tag.
The following is an example of a multi-line documentation string that describes the create-token function the :

```pact
@doc "Initializes a TOKEN with given policies and parameters, \
\ and executes the enforce-init function for each listed policy."
```
 
The `@doc` metadata tag is optional.
For example, a module definition, function definition, or table definition can include comments in strings without the `@doc` tag:

```pact
(module helloWorld 'admin-keyset
  "A smart contract to greet the world."
  (defun hello (name)
    "Do the hello-world dance"
    (format "Hello {}!" [name]))
)
...
(deftable accounts:{account}
    "Main table for accounts module.")
```

For more information about metadata, see [Pact syntax](/reference/syntax).

## Data types

Pact, like most programming languages, supports the data types that you would expect.
For example, Pact allows you define the following types of data:

| Data type | Description | Examples |
| :--------- | :----------- | :------- |
| Integer | Any whole number value—positive or negative—that doesn't include a decimal.| `1`, `2`, `-19` |
| Decimal | Any number value that includes a decimal. Decimal precision is represented as `m*10^(-e)` in which `m` is unbounded, but `e` has, at most, a value of 255. As a result, decimal values have, at most, 255 decimal places, but the total number can be unbounded with a potentially unlimited precision. | `1.0`, `23.5`, `3.14159265359` |
| String | Any text within quotes. You can represent strings using double quotes. It's also possible to prepend strings used as function names or table names with a single quotation mark (').| `“Hello”`, `"Welcome to the show"`, `'balances` |
| Boolean | Anything that is represented by true and false literals. | `true`, `false` |
| List | List literals are created inside square brackets (`[ ]`). List items can be separated with spaces or commas. If all of the items in the list have the same type, then the type is defined by the content of the list. Otherwise, the type is just defined as a “list”. | `[1,2,3]` or `[1 2 3]`  is an integer list, `[1 2 true]` is a list |
| Object | Objects are dictionaries specifying key-value pairs created inside curly braces (`{ }`). |` {“house”:”blue”, “locked”:”no”}` |

For more information about data types, see [Pact syntax](/reference/syntax).

If you aren't sure about the data type when you are working in Pact, you can check its data type by using the Pact `typeof`
built-in function.

To try it yourself:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Use the `typeof` built-in function to test different data types.
   
   In Pact, functions are enclosed by parenthesis, so to test a list data type, for example:
   
   ```pact
   (typeof [1,2,3])
   ```
   
   After you run the command, the `typeof` function returns that this is a list with any type of data items:

   ```pact
   "[list]"
   ```

### String operations

In most cases, you use double quotation marks (" ") around strings to support whitespace or multi-line strings.
However, you can also represent strings by prepending the string with a single quotation mark (').

Typically, you use a single quotation mark to identify strings that are used as function names or table names. 
You can't identify a string with a single quotation mark if the string includes whitespace or requires multiple lines, but this can be a helpful way to identify certain type of strings more succinctly.

For more information about using a single quotation mark for function or table names, see [symbols](/reference/syntax).

To work with strings:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Use double quotation marks to identify a string.

   ```pact
   pact> "Where the wild things are"
   "Where the wild things are"
   ```

3. Use a single quotation mark to identify a string.

   ```pact
   pact> 'hello
   "hello"
   ```

1. Concatenate two strings using the built-in `add` function.
   
   ```pact
   pact> (+ 'Hello " darkness my old friend")
   "Hello darkness my old friend"
   ```

### List and object operations

Pact allows you to express lists using square brackets and objects using curly braces.
Pact objects are similar to JavaScript objects defined using key-value pairs.

To create lists and objects:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Use double quotation marks to identify strings in a list using square brackets.
   
   ```pact
   pact> ["Alice" "Dinesh" "Lee"]
   ["Alice" "Dinesh" "Lee"]
   ```

4. Use double quotation marks to identify strings in an object that describes a cat named Scratchy who’s 6 years old.

   ```pact
   pact> { "type": "cat", "name": "Scratchy", "age": 6 }
   {"type": "cat", "name": "Scratchy", "age": 6}
   ```

5. Make a list that that contains two objects that describe a cat named Scratchy and a dog named Fluffy.
   
   ```pact
   pact> [ { "type": "cat", "name": "Scratchy", "age": 6 } { "type": "dog", "name": "Fluffy", "age": 3 } ]
   [{"type": "cat","name": "Scratchy","age": 6}
   {"type": "dog","name": "Fluffy","age": 3}]
   ```

## Time formats

Pact supports many different time properties and formats. 
The following example illustrates using a `format-time` built-in function to format the time specified using the `time` built-in function:

```bash title=" "
pact> (format-time "%Y-%m-%d %H:%M:%S%N" (time "2024-07-23T13:30:45Z"))
"2024-07-23 13:30:45+00:00"
```

The `time` function constructs a time object from a UTC value using the ISO8601 format (%Y-%m-%dT%H:%M:%SZ).
The format-time built-in functions takes a format argument and a time argument to produce the specified time in the specified format.
The following table provides a summary of time formats used in the previous example:

| format | purpose |
| --- | --- |
| %Y | Year, no padding. |
| %m | Month of the year, 0-padded to two chars, "01"–"12" |
| %d | Day of the month, 0-padded to two chars, "01"–"31" |
| %H | Hour of the day (24-hour), 0-padded to two chars, "00"–"23" |
| %M | Minute of of the hour, 0-padded to two chars, "00"–"59" |
| %S | Second of the minute (without decimal part), 0-padded to two chars, "00"–"60" |
| %N | ISO 8601 style numeric time zone (for example, "-06:00" or "+01:00")|

There are many other formatting options than included in the previous example.
For example, you can replace the numeric representing the month of the year with the short or long name for the month.

```pact
pact> (format-time "%Y-%b-%d" (time "2024-07-24T13:30:45Z"))
"2024-Jul-24"
```
For more information about all of the formats supported, see [Time formats](/reference/functions/time).

## Operators

Pact provides operator functions to perform common arithmetic, comparison, and logical operations.
The most common of these operator functions are listed in this section.
For a complete list with more information about each function, including function signatures and examples, see [Operators](/reference/functions/operators).

### Arithmetic operators

- [+](operators/addition.md): Addition
- [-](operators/subtraction.md): Subtraction
- [*](operators/multiplication.md): Multiplication
- [/](operators/division.md): Division
- [^](operators/exponentiation.md): Exponentiation

### Comparison operators

- [=](operators/equality.md): Equality
- [!=](operators/inequality.md): Inequality
- [`<`](operators/less-than.md): Less than
- [`<=`](operators/less-than-or-equal.md): Less than or equal to
- [`>`](operators/greater-than.md): Greater than
- [`>=`](operators/greater-than-or-equal.md): Greater than or equal to

### Logical operators

- [and](operators/and.md): Logical AND
- [or](operators/or.md): Logical OR
- [not](operators/not.md): Logical NOT

### Bitwise operators

- [&](operators/bitwise-and.md): Bitwise AND
- [|](operators/bitwise-or.md): Bitwise OR
- [~](operators/bitwise-not.md): Bitwise NOT
- [xor](operators/bitwise-xor.md): Bitwise XOR
- [shift](operators/shift.md): Bitwise shift

## Math-related operators

- [mod](operators/modulus.md): Modulus
- [abs](operators/absolute-value.md): Absolute value
- [round](operators/round.md): Rounding
- [ceiling](operators/ceiling.md): Ceiling
- [floor](operators/floor.md): Floor

## Functions

Functions are an important part of any programming language, whether you are working with built-in libraries or writing your own functions. 
In addition to the operator functions, Pact provides many other built-in functions to handle different types of tasks.
The functions are grouped into the following categories:

- Capabilities
- Commitments
- Database
- General
- Guards
- Keysets
- Operators
- Repl
- SPV
- Time
- ZK

Click a category to see a complete list of the functions in that category.
Within each category, you can click individual function names to see more information, including function signatures and examples.
You can also view information about built-in functions using the Pact command-line interpreter and interactive REPL.

### View built-in functions

To view information about Pact built-in functions:

1. Open a terminal shell on your local computer.
2. Display the list of built-in functions by running the following command:
   
   ```bash
   pact --builtins
   ```
   
   You might want to save the output from this command to a file for quick reference.
   For example:

   ```pact
   pact --builtins > builtin-functions.txt
   ```

3. Start the Pact REPL interpreter by running the following command:
   
   ```bash
   pact
   ```

4. View usage information for a specific built-in function by typing the function name in the interpreter.
   
   For example, to see information about the format function, type `format` at the `pact>` prompt:

   ```pact
   pact> format
   ```
   
   After you enter the function name, you'll see information about the function in the interpreter.
   For example:

   ```pact
   native `format`
  
     Interpolate VARS into TEMPLATE using {}.
  
     Type:
     template:string vars:[*] -> string
     
     Examples:
     > (format "My {} has {}" ["dog" "fleas"])
   ```

### Use common functions

Pact includes many built-in functions that enable you to perform common tasks like manipulating lists, assigning values, and formatting strings with variables.
A few of the most common general purpose functions include the following:

- at
- bind
- map
- format
  
You can use the [at](/reference/functions/general#at) built-in function to return a value from a list or an object.
The [bind](/reference/functions/general#bind) built-in function allows you to map a variable to a value from within an object.
You can use the [map](/reference/functions/general#map) built-in function to apply a specific operation to all elements in a list and return the results.
The [format](/reference/functions/general#format) built-in function allows you to create messages using strings and variables. 

Let's try a few simple examples to see how these functions work.

To use the common general functions:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/build/pact/dev-network#install-pacth1989060372) by running the following command:
   
   ```bash
   pact
   ```

3. Select an item from a list using its place—its index location—in the list.
   
   ```pact
   (at 1 ["red" 4 true])
   4
   ```

   The index location starts with position 0, so at index position 1, the result is `4`.
   As this example illustrates, the list can include different data types.
   If you change the index to 0, the result is `"red"`. 
   If you change the index to 2, the result is `true`.

4. Select a value from an object by specifying the object key.

   ```pact
   pact > (at "name" { "type": "cat", "name": "Scratchy", "age": 6 })
   "Scratchy"
   ```
   
   In this example, you use the `"name"` key instead of an index location to return the value—"Scratchy"—from that key.

5. Bind a variable from a source object to a value in another object using the `:=` symbol.

   ```pact
   pact > (bind { "a": 1, "b": 2 } { "a" := a-value } a-value)
   1
   ```

   In this example, the value from the `"a"` key in the source object is assigned to the `a-value` variable, so the value returned by the `a-value` variable is 1.

   A more common use case for binding values using the `:=` symbol is when you want to bind the values from a table object to a variable. 
   The following example illustrates how you might bind a value from a table in a function:

   ```pact
   (defun pay (from to)
       (with-read payments from { "balance":= from-bal }
       ...code 
       )
   )
   ```

   This example reads a table named **payments** that includes a user **from** that is sending a balance. 
   A binding is used in this case to map the **balance** column in the payments table to the value of **from-bal** variable that is provided by the user.
   In this example,the function calls the balance of the user using the **balance** variable rather than the **from-bal** variable.

6. Apply a specific operation to each element in a list and return the results using the `map` built-in function.

   ```pact
   pact > (map (+ 1) [1 2 3])
   [2 3 4]
   ```

   This expression adds the value 1 to each element in the specified list then returns the result in a new list.
   You can also use the `map` function with other values, including strings, and with any of the operators available in Pact. 
   For example, if you have a list of names, you can map “Hello ” to each of them to returning a friendly message for each list item.

   ```bash title=" "
   pact> (map (+ "Hello ") ["Kadena" "Pact" "Standard Library"])
   ["Hello Kadena" "Hello Pact" "Hello Standard Library"]
   ```

7. Format a message using strings, curly braces (`{ }`) for placeholders and a list of values or variables.

   ```pact
   (format "My {} has {}" ["dog" "fleas"])
   "My dog has fleas"
   ```

   The first set of curly braces is the placeholder for the first value in the list.
   The second set of curly braces is the placeholder for the second value in the list.
   You can create as many placeholders and list values as you need for your messages.
   In a more typical use case, you would use the `format` function to create dynamic strings with variables inserted into specific locations in Pact contracts.

8. Close the Pact REPL interpreter session by pressing Control-d.

### Prepare to write functions

Now that you've experimented with several built-in functions in Pact, you’re ready to write some simple functions of your own.
In Pact, functions are always defined in the context of a **module**. 
As you learned in [Pact smart contracts](/build/pact#pact-smart-contractsh589005042), modules are one of the core components of the Pact programming language.
A module definition must include information about who has ownership of the module using either an administrator keyset or by defining a GOVERNANCE capability.
So, before you start writing functions, you need to create a module and identify the module owner.

To prepare to write your first functions:

1. Open a code editor—such as Visual Studio Code—on your computer.

2. Create a new file named `myModule.pact` for your new Pact module.

3. Add a module definition and a GOVERNANCE capability to the file with the following lines of code:
   
   ```pact
   (module myModule GOVERNANCE
       (defcap GOVERNANCE() true)
   
       ;; DEFINE FUNCTION HERE
   )
   ```

   The `defcap` function defines a capability that controls the ownership of your contract.
   It must evaluate to true to allow changes to the module.
   You'll learn more about the power of capabilities in later tutorials.
   These lines of code represent the bare minimum required to define a module.
   Before moving on to writing functions within the module, you can test that the module runs using the Pact REPL interpreter.

4. Start the Pact REPL interpreter by running the following command:
   
   ```bash
   pact
   ```

5. Load the `myModule.pact` file by running a command similar to the following with the path to the `myModule.pact` file:
   
   ```pact
   pact> (load "myModule.pact")
   ```
   
   You should see output similar to the following:

   ```pact
   "Loading myModule.pact..."
   "Loaded module myModule, hash lt47sdWmlQKnqv66VwNBolJqjRg1TcZpteGps5H0xCc"
   ```

### Define a function

Functions are the core units of logic in a module.
They define all of the operations you want your application to offer and all of the features that your users want to access.
Although Pact includes many built-in functions for you to use, you typically need to define most of a contract's logic using your own functions.
Functions definitions start with the reserved keyword `defun` in Pact.
After the `defun` keyword, you must provide the function name followed by any arguments or other functions that the function uses.

The following is a simple example of the syntax to define a function in Pact:

```pact
(defun returnPhrase (a b)
    ;; COMMANDS GO HERE
)
```

In this example, a function named `returnPhrase` accepts inputs `a` and `b`.

Let's add this function to your module.

To define your first function:

1. Open the code editor—such as Visual Studio Code—on your computer.

2. Open the `myModule.pact` file you created for your new Pact module.

3. Define the function in the module by replacing the comment with the following lines of code:
   
   ```pact
   (module myModule GOVERNANCE
     (defcap GOVERNANCE() true)
    
     (defun returnPhrase (a b)
      (format "My {} has {}" [a b])
     )
   )
   ```

   The `returnPhrase` function can now take any two inputs and return a formatted string value.

4. Start the Pact REPL interpreter by running the following command:
   
   ```bash
   pact
   ```

5. Load the `myModule.pact` file by running the following command:
   
   ```pact
   pact> (load "myModule.pact")
   ```

1. Call the function by running the following command:
   
   ```pact
   (returnPhrase "car" "bright lights")
   "My car has bright lights"
   ```
   
   You can now change these inputs to any values you’d like.

### Add calculator functions

Now that you have a working module with one function, you can add functions for the math operations that take any two numbers as input, and returns the result.

To add simple calculator functions:

1. Open the code editor—such as Visual Studio Code—on your computer.

2. Open the `myModule.pact` file you created for your new Pact module.

3. Define functions for adding, subtracting, multiplying, or dividing any input values:
   
   ```pact   
    (defun addNumbers (a b)
      (+ a b)
    )

    (defun subtractNumbers (a b)
      (- a b)
    )

    (defun multiplyNumbers (a b)
      (* a b)
    )

    (defun divNumbers (a b)
      (/ a b)
    )
   ```

1. Call the functions with different values to see the results.
   
   For example:

   ```pact
   pact> (addNumbers 3 4)
   7   
   pact> (subtractNumbers 23 4)
   19   
   pact> (multiplyNumbers 12 4)
   48
   (round (divNumbers 63.5 4.1) 8)
   15.48780488
   ```
