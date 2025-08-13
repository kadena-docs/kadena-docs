---
title: Conditions and control flow
description: "This coding project demonstrates how to write conditional statements and control the order in which statements and instructions are evaluated and executed in Pact smart contracts."
id: conditions-control
sidebar_position: 9
---

# Conditions and control flow

Most programming languages provide several ways you can control how operations are executed in a program.
For example, you can use **conditional expressions** to execute a specific set of instructions only if a specific condition is met or to iterate through a set of instructions a given number of times, until some condition is met.
The most common control structures include the following:

- Conditional statements that use `if` to evaluate a condition and execute one set of instructions if the condition is true, and, optionally, a different set of instructions if the condition is false.

- Conditional statements that use `switch` to execute different sets of instructions based on the value of a variable or expression.

- Loops that use `for` to execute a block of code a fixed number of times.

- Loops that use `while` to execute a block of code as long as a specified condition remains true.

Many programming languages also support control flow keywords—such as the `break`, `continue`, and `return` keywords—that enable you to stop execution, skip program statements, or return a value to a calling function.
However, conditional statements, loops, and other patterns that you can use to control the execution of a program's logic also often increase the complexity of the program and the additional complexity can result in unexpected consequences or programming errors.

To make smart contracts simpler and safer to write, Pact only supports bounded loops and a limited set of conditional control structures.
In Pact, you can write conditional logic to control program execution using the following language features:

- `if` expressions
- `enforce` expressions
- `cond` expressions 

This coding project illustrates how to write simpler and safer smart contracts using these conditional expressions.

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the [Pact](/smart-contracts/install) programming language and command-line interpreter.
- You have installed the [`kadena-cli`](/smart-contracts/install/tooling#kadena-command-line-interface) package and have a working directory with initial configuration settings.
- You have a [local development](/smart-contracts/install/local-dev-node) node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.
- You should be familiar with defining [modules](/smart-contracts/modules) and using keysets.
  
## Get the starter code

To get started:

1. Open a terminal shell on your computer.

2. Clone the `pact-coding-projects` repository by running the following command:

   ```bash
   git clone https://github.com/kadena-docs/pact-coding-projects.git
   ```

3. Change to the `08-control-flow` directory by running the following command:

   ```bash
   cd pact-coding-projects/08-control-flow
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-control-flow.pact` provides a starting point with the framework for the project code and comments for every challenge.
   - `final-control-flow.pact` contains the final solution code with examples of using `if`, `enforce`, and c`ond` expressions.
   - `final-control-flow.repl` provides test cases for testing the functions defined in the my-coin module and for comparing the results from testing `if` expressions and `enforce` expressions.

4. Open and review the `starter-control-flow` file.
   
   This file describes all of the tasks that you need to complete for the _Conditions and control flow_ coding project.
   You can follow the instructions embedded in the file to try to tackle this coding project on your own without looking at the solutions to each step, or follow the instructions in the next sections if you need additional guidance.

## Using if expressions

In general, you should only use `if` expressions when you want to invoke conditional branches depending on whether a certain condition is true or false.
For example, you might have an application that allows users to collect points and unlock a VIP access code when they've collect a required number of points, that is, the required number of points evaluates to true. 
For users who don't have the required number of points, you might want to display a message indicating the number of points still needed to unlock the VIP access code. 
In this example, there are two possible code paths:

- If `points => required_points` is `true`, display a "Congratulations!" message if a user has unlocked the VIP access code.
- If `points => required_points` is `false`, display a "Sorry, you need more points" message and the number of points still needed for VIP access.

For this application, you don't want to stop execution because a condition is false.
Instead, you want provide different messages and, potentially, different behaviors based on whether the `if` condition evaluates to true or false.
The following code snippet illustrates how you might write a function that uses an `if` statement to provide similar behavior in Pact:

```pact
(defconst VIP_UNLOCK 10)
  
(defun unlock-access:string (user:string contribution:integer)
  (with-read my-points-table user
    { "balance" := access-points }
    (update my-points-table user
    { "balance" : (+ access-points contribution)})
      (if (>= access-points VIP_UNLOCK)
        (format "Congratulations! You have {} points and unlocked VIP access." [access-points])
        (format "Sorry, you need {} more points to unlock!" [(- VIP_UNLOCK access-points)])
      )
  )
)
```

## Using enforce expressions

You should use `enforce` statements when you want to ensure a specific condition is met and **stop any further execution** if the condition is false.
Because `enforce` statements prevent transactions from continuing instead of providing a conditional branch, they can provide a safer alternative to `if` statements in smart contracts that execute business transactions.
For example, if you're writing a `debit` function to subtract a specified `amount` from the `balance` for a specified `account`, you could use an `if` statement to check whether the `balance` is sufficient for the operation to continue.

```pact
   ;; Debit using if
  (defun debit:string (account:string amount:decimal)
    @doc "Debit amount from account balance"

    ;; Read the "balance" for the account and bind the value to a variable
      (with-read my-coin-table account
        { "balance" := balance }

        ;; Check if "balance" is sufficient for the amount to debit
        (if (> balance amount)

          ;; If condition is true, update my-coin-table
          (update my-coin-table account
            { "balance" : (- balance amount) })

          ;; If condition is false, print message
          "Balance is not sufficient for transfer" )))
```

You can simplify this code by refactoring with an `enforce` statement.
By using `enforce`, you no longer need to create branching logic dependent on the outcome of the `if` statement.
For example:

```pact
  ;; Refactor with enforce
  (defun debit:string (account:string amount:decimal)
    @doc "Debit amount from account balance"
      (with-read my-coin-table account
        { "balance" := balance }

        ;; Use enforce to exit the transaction if the condition isn't met.
        (enforce (> balance amount) "Balance is not sufficient for transfer")

        ;; Update the balance if the condition is met.
        (update my-coin-table account
          { "balance" : (- balance amount) })))
```

The advantage to using `enforce` is that the transaction execution ends immediately if the required condition isn't met.
The code doesn't require a conditional branch to handle the enforcement failure.

## Using cond expressions

You can use `cond` expressions to evaluate a series of expressions one after another.
With `cond` expressions, you specify a series of conditions to evaluate and operations to perform in the order you want them executed.

```pact
  (defun check-condition:string (user:string)
     (with-read my-points-table user
       { "balance" := points }
         (cond ((= 0 points) "New user") ((< points 10) "Play again") (do (+ 1 points) "Bonus points"))
     )
  )
```

If the first condition evaluated is true, then first code branch is executed.
In this simplified example, if the `(= 0 points)` condition is true, then the `"New user"` string is returned. 
If the first condition isn't met, the second condition is evaluated and, if that condition is true, then the second code branch is executed.

The final `else-branch` is only evaluated if all other conditions fail.
For example:

```pact
pact> (cond ((= "a" "b") "strings test") ((= 1 2) "numbers test") ((= true false) "boolean test") "no conditions are met")
"no conditions are met"
```

## Comparing if and enforce expressions

There are often subtle differences between using `if` and `enforce` expressions that can make smart contract code unsafe. 
In the following example, the code uses `if` statements to do the following:

- Check whether a specified account exists.
- Update the account balance if the row exists and the keyset matches the account keyset.
- Insert a new row if the account doesn't exist. 

```pact
  ;; TEMPTING USE of "IF"
  (defun credit-if:string (account:string keyset:keyset amount:decimal)
 
  ;; STEP 1: Fetch all keys in "my-coin-table" and see if "account" exists.
     (if (contains account (keys my-coin-table))
  
  ;; STEP 2: if the row exists, check the keyset
     (with-read my-coin-table account 
       { "balance":= balance,
         "keyset":= retk }
       
  ;; STEP 3: If the keysets match, update the balance.
  ;; Otherwise, print an error message.
        (if (= retk keyset)
          (update my-coin-table account {
            "balance": (+ amount balance)})
          "The keysets do not match" ))
 
  ;; STEP 4: if the row doesn't exist, insert a row into the table.
     (insert my-coin-table account{
        "balance": amount,
        "keyset": keyset}
     )
   )
 )
```

As you can see, the nested `if` statements make this code more difficult to follow and more complicated than necessary.

You can simplify this code by refactoring to use `with-default-read`, `write`, and `enforce` expressions instead of the `if` statements.
To simplify the code, you can start by setting the default row balance to 0.0 and taking the keyset as an input value. 
If the row exists, you can then bind the `balance` and `keyset` value from the table.

```pact
  (defun credit:string (account:string keyset:guard amount:decimal)
 
    ;; STEP 1: Set the default balance to 0.0 and get the keyset as an input value.
    ;; If row exists, then bind "balance" and "keyset" values from the table.
    (with-default-read my-coin-table account
      { "balance": 0.0, "keyset": keyset }
      { "balance":= balance, "keyset":= retg }
 
 
      ;; STEP 2: Check that the input keyset is the same as the row's keyset
      (enforce (= retg keyset)
        "account guards do not match")
 
      ;; STEP 3: Write the row to the table.
      (write my-coin-table account
        { "balance" : (+ balance amount)
        , "keyset"   : retg
        }
      )
    )
  )
```

As you can see from this example, the code now combines steps to look up the account and check its keyset. 
By simplifying the logic to remove `if` statements, you can write functions that are more straightforward to read and safer to execute.

## Testing contract functions

The `final-control-flow.repl` file provides test cases for executing the functions defined in the `my-coin` Pact module. 
The `final-control-flow.repl` file includes both successful and failing test cases for the `debit-if` and `credit-if` functions and for the `debit` and `credit` functions that use `enforce`.
You should note that the `final-control-flow.repl` file uses the `expect-failure` function to check the expected failure messages for the `debit` and `credit` functions.

Because the `debit` and `credit` functions use the `enforce` function, those functions fail transactions if the enforced condition isn't met.
For example, the `expect-failure` tests return results for the refactored `debit` and `credit` functions that look like this:

```pact
"Expect failure: Success: Balance is not sufficient for transfer"
"Expect failure: Success: Keysets do not match"
```

The `if` statements in the `debit-if` and `credit-if` functions don't fail the transaction when the condition evaluated is false. 
Because those function return an error message without causing the transaction to fail, the `expect-failure` test is less predictable when the condition is evaluated.

If you test`debit-if` and `credit-if` functions, you'll see the expected error messages.
However, if you use the `expect-failure` function with the `debit-if` and `credit-if` functions, you'll see that the test itself fails: 

```pact
"Balance is not sufficient for transfer"
"FAILURE: Balance is not sufficient for transfer: expected failure, got result"
"Keysets do not match"
"FAILURE: Keysets do not match: expected failure, got result"
```
