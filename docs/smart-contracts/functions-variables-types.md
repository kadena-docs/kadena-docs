---
title: Functions, variables, and types
description: "Work with common built-in functions and start write your own function declarations that include variables and types."
id: functions-variables
sidebar_position: 6
---

# Functions, variables, and types

In [Language features and conventions](/smart-contracts/lang-features), you were introduced to Pact built-in functions and function categories. 
In this part of the documentation, you'll begin working with common built-in functions and writing your own function declarations that include variables and types.

## View built-in functions

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

## Use common functions

Pact includes many built-in functions that enable you to perform common tasks like manipulating lists, assigning values, and formatting strings with variables.
A few of the most common general purpose functions include the following:

- at
- bind
- map
- format
  
You can use the [at](/pact-5/General/at) built-in function to return a value from a list or an object.
The [bind](/pact-5/General/bind) built-in function allows you to map a variable to a value from within an object.
You can use the [map](/pact-5/General/map) built-in function to apply a specific operation to all elements in a list and return the results.
The [format](/pact-5/General/format) built-in function allows you to create messages using strings and variables. 

Let's try a few simple examples to see how these functions work.

To use the common general functions:

1. Open a terminal shell on your local computer.
2. Start the Pact REPL interpreter you installed in [Install Pact](/smart-contracts/install) by running the following command:
   
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

## Prepare to write functions

Now that you've experimented with several built-in functions in Pact, you’re ready to write some simple functions of your own.
In Pact, functions are always defined in the context of a **module**. 
As you learned in [Pact smart contracts](/smart-contracts/basic-concepts), modules are one of the core components of the Pact programming language.
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

   The `defcap` function is a reserved keyword that defines a capability that controls the ownership of your contract.
   It must evaluate to true to allow changes to the module.
   You'll learn more about the power of capabilities in later tutorials and examples.
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

## Define a function

Functions are the core units of logic in a module.
They define all of the operations you want your application to offer and all of the features that your users want to access.
Although Pact includes many built-in functions for you to use, you typically need to define most of a contract's logic using your own functions.
Functions definitions start with the reserved keyword `defun` in Pact.
After the `defun` keyword, you must provide the function name followed by any arguments or other functions that the function uses.

The following is a simple example of the syntax to define a function in Pact:

```pact
(defun returnPhrase (a b) ;; Start of function declaration
    ;; COMMANDS GO HERE
)                         ;; End of function declaration
```

The `defun` function is a reserved keyword that signals the start of a function declaration.
In this example, the function is named `returnPhrase` and the function accepts inputs with the variable identifiers `a` and `b`.
The function includes comments by using two semi-colons (;;) to start each comment.

Let's add this function to your module.

To define your first function:

1. Open the code editor—such as Visual Studio Code—on your computer.

2. Open the `myModule.pact` file you created for your new Pact module.

3. Define the function in the module by replacing the comment with the following lines of code:
   
   ```pact
   (module myModule GOVERNANCE          ;; Start of module definition
     (defcap GOVERNANCE() true)
    
     (defun returnPhrase (a b)          ;; Start of function declaration
      (format "My {} has {}" [a b])
     )                                  ;; End of function declaration
   )                                    ;; End of module definition
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

   You should see output similar to the following:

   ```pact
   "Loading myModule.pact..."
   "Loaded module myModule, hash sa059rM_ifArkCn4vDWpc20C1FThTMtWRNIMpVcrE6w"
   ```

6. Call the `returnPhrase` function by running the following command:
   
   ```pact
   (returnPhrase "car" "bright lights")
   "My car has bright lights"
   ```
   
   You can now change these inputs to any values you’d like.

## Add calculator functions

Now that you have a working module with one function, you can add functions for the math operations that take any two numbers as input, and return the result.

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

## Variables

In the previous examples, you used the variable identifiers `a` and `b` to represent input arguments in your function declarations.
Variables represent and store any type of data that you want to reference and manipulate in a program.

### Constant values

In Pact, you can define variables for constant values using the `defconst` reserved keyword.

```pact
(defconst variable_name variable_value [optional_text])
``````

For example, the following statement illustrates defining the constant `PI` with eight decimal places followed by an optional comment:

```pact
(defconst PI 3.14159265 "Pi to 8 decimals")
```

The following example illustrates defining the constant `PENNY` with an explicit type of `decimal`:

```pact
(defconst PENNY:decimal 0.1)
```

By convention, constant variables use all uppercase letters.
However, this convention isn't required.

To use a constant in your module:

1. Open the code editor—such as Visual Studio Code—on your computer.

2. Open the `myModule.pact` file.

1. Add the constant variable for `PI` to your module and save your changes.
   
2. Load the `myModule.pact` file.

1. Call the `addNumbers` function with the `PI` constant.
   
   ```pact
   (addNumbers 1.0 PI)
   4.14159265
   ```
   
   You can experiment with using the `PI` constant in other functions.
   However, you should note that the data type for `PI` is a decimal value.
   Therefore, the other values you pass should also be decimal values—as in this example with 1.0—and not the integer values.

### Changeable values

You can also define variables for values that can be changed using `let` or `let*` expressions.
Within functions, you can use the `let` or `let*` keyword to bind a variable identifier to a value.
For example, you can assign the variable identifier `x` a value of `10` and perform a simple addition by entering the following in the Pact terminal:

```pact
(let ((x 10))
 (+ x 5)
)
```

This expression returns the result of adding `5` to `x` with the value `15`.

In most cases, you should use `let` expressions to bind variables to values.
However, you can use the `let*` keyword to reference previously-declared variables in the same `let` declaration. 
The following example illustrates referencing a previously-declared variable in the same `let*` declaration:

```pact
(let* ((x 2) (y (* x 10)))
(+ x y))
22
```

## Typing in variable declarations

Most of the examples you've seen so far haven't explicitly specified the data type being used.
However, in practice, you should explicitly identify the data type for each variable you define in a program.
By identifying the data type—for example, integer, decimal, boolean, or string—you can ensure that variables can be set and manipulated correctly and without introducing unexpected behavior by mismatching types.

For example, to specify that the variable `x` is an integer, you can add the `integer` data type to the declaration like this:

```pact
(let ((x:integer 10))x)
```

You can specify a variable is a `decimal` value like this:

```pact
(let ((x:decimal 10.0))x)
```

You can specify a variable is a `string` value like this:

```pact
(let ((state:string "CA"))state)
"CA"
```

## More built-in functions

You've already seen how to use several common built-in Pact functions.
However, there are many more built-in functions that you'll use frequently in Pact smart contracts, including the following general functions:

- `namespace`
- `hash`
- `if`
- `enforce`

### Entering a namespace

In the Kadena ecosystem, a **namespace** is conceptually similar to a domain name except that the name is a static prefix that establishes a private boundary for the contracts, keys, and other elements that you control.
When you are building, testing, and deploying smart contracts on your local development network, you don't need to define a namespace. 
Your work is isolated from others because your blockchain—and any smart contracts you deploy—run exclusively on your local computer.

However, if you want to deploy a smart contract on the Kadena test network or another public blockchain, the contract must have a unique name that distinguishes your Pact module from all the others. 
If you try to deploy a Pact module with a name that's already being used on the network where you are trying to deploy, the deployment will fail with an error and you'll pay a transaction fee for the failed attempt.

To prevent name collisions on the same network, Kadena allows you to define your own unique namespace on the blockchain. 
The namespace segregates your work—your smart contracts, keysets, and Pact modules—from applications and modules created and deployed by others. 
Within your namespace, you can define whatever keysets and modules you need and control who can update the namespace with changes. 
As long as you choose a unique name for your namespace, everything you define inside of that namespace is automatically unique, too.

Pact provides the `define-namespace` and `namespace` built-in functions for you define or enter the namespace you want to use as your current working environment. 
After you declare the namespace you want to work with, all of the modules and functions you define are contained within that namespace.

You can access the modules and functions in a namespace by using their fully qualified name. 
The fully-qualified name includes the namespace string as a prefix before the module name. 
For example, if you declare a principal namespace such as `ns-my-local-dev` for the module `my-calculator`, you can call functions in the module using a fully-qualified name similar to the following:

```pact
ns-my-local-dev.my-calculator.add
```

To define and enter a namespace:

1. Open a terminal shell on your local computer.
2. Start the Pact command-line interpreter to open the Pact terminal. 
1. Add a `user-keyset` guard and an `admin-keyset` guard to your working environment by entering the following lines:

   ```pact
   (env-data
    { 'user-keyset :
      { 'keys : [ 'user-public-key ]
      , 'pred : 'keys-all
      }
    , 'admin-keyset :
      { 'keys : [ 'admin-public-key ]
      , 'pred : 'keys-all
      }
    }
   )
   ```
   
   The `user-keyset` and `admin-keyset` are required to define a new namespace.
   In the terminal, you should see this information added to your working environment:

   ```pact
   pact> (env-data
   ....>  { 'user-keyset :
   ....>    { 'keys : [ 'user-public-key ]
   ....>    , 'pred : 'keys-all
   ....>    }
   ....>  , 'admin-keyset :
   ....>    { 'keys : [ 'admin-public-key ]
   ....>    , 'pred : 'keys-all
   ....>    }
   ....>  }
   ....> )
   "Setting transaction data"
   ```

1. Define a new namespace by running the following command:
   
   ```pact
   pact>  (define-namespace 'ns-my-local-dev (read-keyset 'user-keyset) (read-keyset 'admin-keyset))
   ```

   In the terminal, you should see this information added to your working environment:

   ```pact
   "Namespace defined: ns-my-local-dev"
   ```

1. Enter the new namespace by running the following command:
   
   ```pact
   pact> (namespace 'ns-my-local-dev)
   ```

   In the terminal, you should see this information added to your working environment:

   ```pact
   "Namespace set to ns-my-local-dev"
   ```

   If you define a module in this workspace, you would set the first line to specify the namespace before any of the module code.
   For example:
   
   ```pact
   (namespace "ns-my-local-dev")
   
   (module myModule GOVERNANCE
       (defcap GOVERNANCE() true)
       ...
   ) 
   ```
   
   The module is created with the fully-qualified `ns-my-local-dev.[contract_name]` name.

### Hashing values

The `hash` function enables you to compute a unique Base64Url-encoded string for a specified `value` using the BLAKE2b 256-bit hashing algorithm.
Using a hashing algorithm is a common operation for blockchain networks when you need to create unique values.
You can create hashes for any type of data.
Strings values are converted directly.
Other data type values are converted using their JSON representation.

The following example demonstrates how to use the `hash` function to create a unique index for the `"hello"` string value:

```pact
pact> (hash "hello")
"Mk3PAn3UowqTLEQfNlol6GsXPe-kuOWJSCU0cbgbcs8"
```

Because `"hello"` is a string value, the `hash` function computes the BLAKE2b 256-bit hash of the string "hello" and returns the hash value.
If you change the string to “hello1”, the hash function returns different value.
For example:

```pact
(hash "hello1")
"zbEgnuUZLD7FFPPH9VD91-Ah9KzCeCLqBVL2hGAg8d4"
```

You can also use the `hash` function to compute the hash for lists, objects, and other data types.
For example:

```pact
(hash [1 2 3])
"qPorDZllGgkv-ZaODZMQE0tUgv2ghZ4G86OTDmKANXg"
```

The following example computes the hash for the JSON representation of an object and returns the hash value:

```pact
(hash { 'foo: 1 })
"h9BZgylRf_M4HxcBXr15IcSXXXSz74ZC2IAViGle_z4"
```

The hash enables you to reference and manipulate the specific data in complex ways.


### Defining conditions with if statements

Because Pact doesn't support recursion or unbounded looping, the `if` function is particularly useful for testing conditions.
The basic format for testing conditions with `if` statements looks like this:

```pact
(if condition then else)
```

If the specified `condition` is true, evaluate the `then` expression.
If the specified `condition` is false, evaluate the `else` expression.

The following example demonstrates the use of `if` to test a condition—whether (2 + 2 =4)—in the Pact REPL:

```pact
pact>(if (= (+ 2 2) 4) "Sanity prevails" "Chaos reigns")
"Sanity prevails"
```

In this example, the condition `(= (+ 2 2) 4)` evaluates to true, so the expression `"Sanity prevails"` is returned.

```pact
pact>(if (= (+ 2 2) 5) "Sanity prevails" "Chaos reigns")
"Chaos reigns"
```

In this example, the condition `(= (+ 2 2) 5)` evaluates to false, so the expression `"Chaos reigns"` is returned.

### Enforcing conditions

Pact provides several `enforce` functions that enable you to evaluate conditions and allow or block further operations based on the result.
One critical function in Pact is `enforce`. 
If you hit an enforce block and invalidate it, it will stop you from executing any further.

With the `enforce` function, you can test whether a specified `expression` evaluates to true or false.
If the specified `expression` evaluates to true, the function returns true and operation continues.
If the specified `expression` evaluates to false, the function halts execution and displays a specified error `message`.

The following example tests the expression (1 + 3 != 5):

```pact
pact> (enforce (!= (+ 1 3) 5) "whoops")
true
```

Because the specified expression (`4 != 5`) is true, the function returns true and the operation continues. 

The following example demonstrates how to use the `enforce` function to evaluate the expression `(2 + 2) != 4`:

```pact
pact> (enforce (!= (+ 2 2) 4) "The expression is false")
The expression is false
 at <interactive>:0:0: (enforce (native `!=`  True if X does not equal Y.  Type: x... "The expression is false")
```

There are many situations where the enforcement functions are useful for testing specific behavior.
For example, one of the most common enforcement functions is the `enforce-guard` function.
This function ensures that the logic for a specified `guard` or `keyset` is enforced before protected operations can be executed.
You'll learn more about guards and enforcing guard logic in [Guards](/smart-contracts/guards).