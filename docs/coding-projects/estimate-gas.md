---
title: Estimate gas
description: "Calculate the approximate cost to execute a specific transaction."
id: estimate-gas
---

# Estimate gas

Because transaction fees vary depending on the resources required to execute specific operations, it can use useful to calculate potential fees by testing contract functions using the Pact REPL and `.repl` files.
This coding project demonstrates the basic steps for calculating the gas required to execute any method in a `.repl` file.

This coding project assumes you're familiar with the basic built-in functions for testing smart contracts in your local development environment using `.repl` files.
As an extension of the [Local testing](/coding-projects/local-testing), the project demonstrates how to gas-related built-in functions with the `loans-estimate.pact` module as the sample smart contract to test.

In this coding project, you'll learn about:

- Using the built-in environment configuration functions.
- Setting and updating gas limits.
- Testing the gas consumed for individual functions.
- Combining functions in transaction blocks.

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the Pact programming language and command-line interpreter.
- You have installed the `kadena-cli` package and have a working directory with initial configuration settings.
- You have a local development node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.
- You should be familiar with defining modules and using keysets.

## Get the starter code

(env-gasmodel "table")
(env-gaslimit 150000)
^ preamble to enable gas charging.
(method 1 2 3)
^ method under test.

(env-gas)
^ retrieve the consumed gas.

You will likely want to:
(env-gas 0)
^ reset the consumed gas after.