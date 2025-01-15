---
title: Conditions and control flow
description: "This coding project demonstrates how to write conditional statements and control the order in which statements and instructions are evaluated and executed in Pact smart contracts."
id: conditions-control
sidebar_position: 9
---

# Conditions and control flow

Most programming languages provide several ways you can control the order in which the lines in a program are executed or which parts of the code should be executed.
For example, you can use conditional statements to execute a set of instructions only if a specific condition is met or iterate through a set of instructions zero or more times, until some condition is met.
The most common control structures include the following:

- Conditional statements that use `if` to evaluate a condition and execute a set of instructions if the condition is true, and, optionally a different set of instructions if the condition is false.

- Conditional statements that use `switch` to execute different sets of instructions based on the value of an expression.

- Loops that use `for` to execute a block of code a fixed number of times.

- Loops that use `while` to execute a block of code as long as a specified condition remains true.

Many programming languages also support control flow keywords—such as the `break`, `continue`, and `return` keywords—that enable you to stop execution, skip program statements, or return a value to a calling function.
However, conditional statements, loops, and other patterns that you can use to control the execution of a program's logic also often increase the complexity of the program and the additional complexity can result in unexpected consequences or programming errors.

To make smart contracts simpler and safer to write, Pact only supports two types of control structures:

- Conditional `if` statements.
- Conditional `enforce` statements.

This coding project illustrates how to use these statements appropriately to write simpler and safer smart contracts.

## Using if statements

In general, you should `if` statements when you want to invoke conditional branches depending on whether a certain condition is true or false.
For example, you might have an application that allows users to collect points and unlock a VIP access code when they've collect a required number of points, that is, the required number of points evaluates to true. 
For users who don't have the required number of points, you might want to display a message indicating the number of points still needed to unlock the VIP access code. 
In this example, there are two possible code paths:

- If `points => required_points` is `true`, display "Congratulations!" and the VIP access code.
- If `points => required_points` is `false`, display "Sorry, you need" and the number of points still needed for VIP access.

For this application, you don't want to stop execution because a condition is false.
Instead, you want provide different messages and, potentially, different behaviors based on whether the `if` condition evaluates to true or false.
The following code snippet illustrates hoe you might write a function that uses an `if` statement to provide similar behavior in Pact:

```pact
(defun unlock-access-code:string (user:string contribution:decimal)
  ; Check that the user is valid
  (validate-account user)
  ; Use the `contribute` function to add points to a user's total balance
  (let* ((points (contribute user contribution)))
  (if (>= points VIP_UNLOCK_THRESHOLD)  
    (with-capability (UNLOCK user) (unlock-for user user)) ; Hooray! A user reached enough points to unlock
    (format "Sorry, you need {} more points to unlock!" [points])))
```

## Using enforce statements

You should use `enforce` statements when you want to ensure a specific condition is met and stop any further execution if the condition is false.
Because `enforce` statements prevent transactions from continuing instead of providing a conditional branch, they can provide a safer alternative to `if` statements in smart contracts that execute business transactions.
For example, if you're writing a `debit` function to subtract a specified `amount` from the `balance` for a specified `account`, you could use an `if` statement to check whether the `balance` is sufficient for the operation to continue.

```pact
   ;; Debit using if
  (defun debit:string (account:string amount:decimal)
    @doc "Debit amount from account balance"
    ;; Read the "balance" for the account and bind the value to a variable
      (with-read my-coin-table account
        { "balance" := balance }
        ;;Check if "balance" is sufficient for the amount to debit
        (if (> balance amount)
          ;;If condition is true, update my-coin-table
          (update my-coin-table account
            { "balance" : (- balance amount) })
          ;;If condition is false, print message
          "Balance is not sufficient for transfer" )))
```

You can simplify this code by refactoring with an `enforce` statement.
By using `enforce`, you no longer need to create branching logic dependent on the outcome of the `if` statement.

```pact
  ;; refactor with enforce
  (defun debit:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance"
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



Demonstration #2: Unsafe
Next, I’ll walk through another demonstration showing the difference between if and enforce. This is another situation where it may be tempting to use if. Though it is a similar idea, there are a few subtle differences in this demonstration that will be valuable to understand.

Here is a look at the starting code.

```pact
  ;;TEMPTING USE of "IF" (type 2)
  (defun credit-if:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance"
 
   ;;STEP 1: Fetch all keys in my-coin-table and see if account exists.
 
 
    ;;STEP 2: if the row exists, check keyset and update the balance
 
 
       ;;STEP 3: If the keysets do match, update the balance.
       ;;Otherwise, print error message.
 
 
 
 
 
    ;;STEP 4: if the row does not exist, insert a row into the table.
 
 
 
      ))
```

As you can see, you’ll need to check that an account exists, update its balance if the row exists or if the keysets match, or insert a row if it does not exist. Each of these cases make it tempting to use if. For that reason, I’ll walk through now coding each line using if statements.

Step 1: Check that Account Exists

First, fetch all keys in my-coin-table to see if the account exists.

```pact
;;STEP 1: Fetch all keys in my-coin-table and see if account exists.If true, go to step 2, or else go to step 4
(if (contains account (keys my-coin-table))
```

Step 2: Update Balance if Row Exists

Within the if statement, check the keyset and update the balance if it is found that the row exists.

```pact
    ;;STEP 2: if the row exists, bind variables
    (with-read my-coin-table account { "balance":= balance,
                                       "keyset":= retk }
```

Step 3: Update Balance if Keysets Match

Then, if the keysets match update the balance.

```pact
       ;;STEP 3: If the keysets do match, update the balance.
       ;;Otherwise, print error message.
       (if (= retk keyset)
         (update my-coin-table account {
           "balance": (+ amount balance)})
         "The keysets do not match" ))
```

Step 4: Insert Row if it Does not Exist

Next, if the row does not exist, insert the balance and keyset into the account on my-coin-table.

```pact
    ;;STEP 4: if the row does not exist, insert a row into the table.
    (insert my-coin-table account{
       "balance": amount,
       "keyset": keyset
      }))
```

Final Unsafe Code Using If

Looking back at the final code, we can see that it is working, but that it is using an unsafe if statement. This is causing logic that is more complicated than necessary and is something that would be better written using enforce.

```pact
  ;;TEMPTING USE of "IF" (type 2)
  (defun credit-if:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"
 
   ;;STEP 1: Fetch all keys in my-coin-table and see if account exists.
   (if (contains account (keys my-coin-table))
 
    ;;STEP 2: if the row exists, check keyset and update the balance
    (with-read my-coin-table account { "balance":= balance,
                                       "keyset":= retk }
       ;;STEP 3: If the keysets do match, update the balance.
       ;;Otherwise, print error message.
       (if (= retk keyset)
         (update my-coin-table account {
           "balance": (+ amount balance)})
         "The keysets do not match" ))
 
    ;;STEP 4: if the row does not exist, insert a row into the table.
    (insert my-coin-table account{
       "balance": amount,
       "keyset": keyset
      })))
```

This code can be refactored using enforce.

Demonstration #2: Safe
Take some time now to reconsider the code you wrote previously. Read through the new comments and decide how you may be able to approach writing this same logic with enforce rather than if.

```pact
  ;;refactor with with-default-read & write & enforce
  (defun credit:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"
 
    ;;STEP 1: Default the row to balance at 0.0 and keyset at input keyset
    ;;If row exists, then bind balance and keyset value from the table.
    ;;This allows one time key lookup - increases efficiency.
 
 
 
      ;;STEP 2: Check that the input keyset is the same as the row's keyset
 
 
      ;;STEP 3: Writes the row to the table. (write adds the table with the key and the row.
 
 
 
 
)
```

As you can see, you will again need to check that an account exists, update its balance if the row exists or if the keysets match, or insert a row if it does not exist. You can do all of this using enforce as shown below.

Step 1: Create Efficient One Time Key Lookup

To start, you will need to reorder the code slightly.

You’ll start by setting the default row balance to 0.0 and a keyset at input keyset. If the row exists, then bind the balance and keyset value from the table.

```pact
    ;;STEP 1: Default the row to balance at 0.0 and keyset at input keyset
    ;;If row exists, then bind balance and keyset value from the table.
    ;;This allows one time key lookup - increases efficiency.
    (with-default-read my-coin-table account
      { "balance": 0.0, "keyset": keyset }
      { "balance":= balance, "keyset":= retg }
```

This is more efficient than the previous code and allows for a one time key lookup.

Previous Code Using If

As a comparison, look back at steps 2 and 4 from the earlier code you wrote. Take some time to understand how the code above is combining each of these steps by allowing for a single lookup.

```pact
    …code
 
    ;;STEP 2: if the row exists, check keyset and update the balance
    (with-read my-coin-table account { "balance":= balance,
                                       "keyset":= retk }
 
    …code
 
    ;;STEP 4: if the row does not exist, insert a row into the table.
    (insert my-coin-table account{
       "balance": amount,
       "keyset": keyset
    …code
```

Step 2: Check Input Key vs Row’s Keyset

Next, use enforce to check that the input keyset is the same as the row’s keyset. If not, return that the account guards do not match.

```pact
      ;;STEP 2: Check that the input keyset is the same as the row's keyset
      (enforce (= retg keyset)
        "account guards do not match")
```

Step 3: Write Row to Table

Finally, write the account balance and keyset to a row in the my-coin-table.

```pact
      ;;STEP 3: Writes the row to the table. (write adds the table with the key and the row.
      (write my-coin-table account
        { "balance" : (+ balance amount)
        , "keyset"   : retg
        })))
```

Final Enforce Statement

Looking back at the final version of the code, you can see that we have completed the same logic without ever using an if statement. This again allows for simpler logic and can help you write safer code.

```pact
  ;;refactor with with-default-read & write & enforce
  (defun credit:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"
 
    ;;STEP 1: Default the row to balance at 0.0 and keyset at input keyset
    ;;If row exists, then bind balance and keyset value from the table.
    ;;This allows one time key lookup - increases efficiency.
    (with-default-read my-coin-table account
      { "balance": 0.0, "keyset": keyset }
      { "balance":= balance, "keyset":= retg }
      ;;STEP 2: Check that the input keyset is the same as the row's keyset
      (enforce (= retg keyset)
        "account guards do not match")
      ;;STEP 3: Writes the row to the table. (write adds the table with the key and the row.
      (write my-coin-table account
        { "balance" : (+ balance amount)
        , "keyset"   : retg
        })))
)
```

Take a moment now to look back and compare both versions of this code. Ensure that you keep these patterns in mind as you write your own code.

my-coin.repl
In my-coin.repl file, you can check that the failing cases of debit-if and credit-if are tested with expect ... by checking if the output matches the expected failure message. The refactored code allows us to test with expect-failure ...to check if the function succeeds or not.

Note
For more information on running .repl files from Atom, see the tutorial Contract Interaction > Run REPL File.

Review
That wraps up this tutorial on Pact safety using control flow.

Throughout this tutorial, you learned that using enforce can help make your the control flow of your Pact smart contracts even simpler and safer. You went over a few demonstrations teaching you ways to avoid using if statements in favor of enforce.

This is one of a few key patterns that you can use to improve the safety of your smart contracts. Coming up, we’ll go over a few more safety tips to keep in mind as you develop Pact smart contracts.

