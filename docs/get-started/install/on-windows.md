---
title: Install on Windows
id: windows
sidebar_position: 2
description: "Install the Pact smart contract programming language and set up tooling for your development environment."
---

import CodeBlock from '@theme/CodeBlock';

# Install on Windows Subsystem for Linux (WSL)

You can install Pact on Microsoft Windows if you first install and configure the Windows Subsystem for Linux (WSL) on Windows 10, or later, or on Windows Server 2019, or later.
After you install and configure the WSL, you can install Pact from the Pact Linux release archive. 

## Pact versions

You can choose to download and install either the latest, stable version of Pact, version 4.x, or the development version of Pact Core, version 5 (beta) for Linux computers.

- Pact 4.13 is the latest stable release of the Pact smart contract language and interactive interpreter for Linux.
- Pact Core is a reinvention of the Pact language that focuses on enhanced scalability, maintainability, and performance.
  Pact Core enables sustainable growth of Pact features within the Kadena ecosystem by offering more modular and maintainable internal structures to better support community development and enhancements to the language and components that rely on it.

## Prerequisites

Before you can install Pact on Microsoft Windows, you must install and configure the Windows Subsystem for Linux (WSL).
For complete WSL installation instructions, see [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or [Install on Windows Server](https://learn.microsoft.com/en-us/windows/wsl/install-on-server).

To set up WSL:

1. Click **Start** to select **Windows PowerShell**, then click **Run as Administrator**.
2. Run the following command to enable WSL and install the Ubuntu distribution:
   
   ```powershell
   wsl --install --distribution Ubuntu
   ```

1. Restart the Windows computer to complete the WSL installation.
   
   After restarting, click Start to select the Ubuntu virtual machine and follow the instructions displayed to create a new user account and complete the setup process.

In addition to setting up WSL, if you are installing Pact 4.x, you should note that this version of Pact requires the `z3` theorem prover from Microsoft Research to support formal verification.
Pact Core doesn't support formal verification in this release.
You can install the `z3` package in the WSL Ubuntu virtual machine by running the following commands:

```bash
sudo apt update
sudo apt install z3
z3 --version
```

## Installation instructions

To install Pact on Window Subsystem for Linux (WSL):

1. Navigate to the appropriate Pact Releases page:
   
   - [Pact Releases](https://github.com/kadena-io/pact/releases) to download the latest stable version of Pact 4.x. 
   - [Releases/development-latest](https://github.com/kadena-io/pact-5/releases/tag/development-latest) to download the latest development version of Pact Core.

2. Download the latest `pact-<version>-linux-<arch>.tar.gz` file for the Linux operating system and architecture you use.

3. Open a terminal and extract the downloaded compressed archive by running the following command:

   ```bash
   tar -xvzf pact-<version>-linux-<arch>.tar.gz
   ```

4. Navigate to the extracted directory:

   ```bash
   cd pact-<version>-linux-<arch>
   ```

5. Move the `pact` binary to a directory in your system `PATH`, or update your `PATH` variable. 
   
   For example, to move the `pact` binary from the current working directory to the `/usr/local/bin` directory and update the `PATH`:
   
   ```bash
   sudo mv pact /usr/local/bin
   export PATH="/usr/local/bin:$PATH"
   ```

6. Reload the shell configuration.

   For example, reload the configuration for the `bash` shell by running the following command:

   ```bash
   source ~/.bashrc
   ```
   
   Replace `~/.bashrc` with `~/.zshrc` if you use the `zsh` shell.

7. Verify the installation by checking the Pact version:

   ```bash
   pact --version
   ```

8. View usage information for the pact interactive interpreter by running the following command:
   
   ```bash
   pact --help
   ```

   For more information about the command-line options, see Pact command-line interpreter.
   For an introduction to Pact programming and language features, see basic language features.

## Troubleshooting

If you encounter issues, check the following:

- Check the Pact version and, if Pact, version 4.x, is installed, verify that you have `z3` installed.

  ```bash
  pact --version
  ```
  
  This command should display output similar to the following:

  ```bash
  pact version 4.13
  ```

  If the Pact version is 4.x, check for the z3 package by running the following command:

  ```bash
  z3 --version
  ```

  If `z3` is installed correctly, the command should display output similar to the following:
  
  ```bash
  Z3 version 4.8.12 - 64 bit
  ```

  If necessary, install z3 by running the following commands:

  ```bash
  sudo apt update
  sudo apt install z3
  z3 --version
  ```

- Verify the `pact` binary can be located and is in a directory included in your `PATH` environment variable.
  
  First check the path to the `pact` binary by running the following command:

   ```bash
   which pact
   ```
   
   This command should display the current path to the `pact` binary.
   For example:

   ```bash
   /usr/local/bin/pact
   ```

   If the command doesn't display the path to the `pact` binary, you should try reinstalling `pact` from the prebuilt release archive or from the source code.
   If the `which pact` command displays the path to the `pact` binary, check the `PATH` environment variable to verify the path the the binary is include by running the following command:

   ```bash
   echo $PATH
   ```

   This command should display output similar to the following:
   
   ```bash
   /home/pistolas/.nix-profile/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
   ```
   
   The `$PATH` output should include the directory where the `pact` binary is located.
   If the PATH environment variable doesn't include the directory, open your shell profile—for example, the `~/.bashrc` or `~/.zshrc` file—in a text editor.
   Add the following line at the end of the file:

   ```bash
   export PATH="/path/to/pact-directory:$PATH"
   ```

   Save the shell profile file and exit.

   Open a new terminal or reload the shell profile to complete the update.

- Check [Pact GitHub Issues](https://github.com/kadena-io/pact/issues) for known issues or to report a problem with installing Pact.




## Install Pact tooling

### Language server

You can install the [Pact language server plugin](https://github.com/kadena-io/pact-lsp/releases) on your local computer to support syntax highlighting and other features in the code editor.

### Package manager

pactup

### Visual Studio Code extension

If you use Visual Studio Code as your integrated development environment (IDE), you can install the Pact extension to streamline your smart contract development experience. Before installing the extension, verify that you have Pact and the Pact Language Server installed.

To install the Pact extension:

1. Open Visual Studio Code.
2. Select **View**, then click **Extensions**.
3. Type **pact** in the Search field.
4. Select **PactLang**, then click **Install**. If you're prompted to install additional extensions, you should install them to enable the full functionality of the Pact extension.

To configure the Pact extension settings:

1. Select **Code**, **Settings**, then click **Settings** and search for **pact**.

2. Select **Pact configuration** and configure the settings appropriate for your development environment.
3. Select **Enable coverage** to enable code coverage reporting for `.pact` and `.repl` files.

   With this option enabled, code coverage is calculated for the `.repl` file and all of the `.pact` and `.repl` files that it loads every time you save a `.repl` file.

   Covered lines aree highlighted in green in your editor and uncovered lines aree highlighted in red. To view a code coverage report in HTML format, right-click the `./coverage/html/index.html` file relative to the file that was run. Click **Show preview** to open the report.

   To run code coverage for all your `.repl` files at once, create an entry point `.repl` file that loads all the other `.repl` files in your project. You can then open the entry point file and save it to run all of your tests.

4. Select **Enable Lsp** to enable the Pact Language server.

   With this option enabled, syntax errors are be highlighted in `.pact` files and problems are reported in the Visual Studio Code status bar and bottom panel.

5. Select **Enable trace** to enable the output trace for Pact.

   With this option enabled, the `pact` command runs with the `--trace` option every time you save a file. The `--trace` option provides detailed line by line information about `.pact` and `.repl` file execution.

6. Set the path to the Pact executable and the Pact Language server executable.

   If you added the executables to your `PATH`, you can use `pact` and `pact-lsp` for these settings.

   ![Configure Pact settings](/./img/vscode-pact.png)

## Install Chainweaver

Chainweaver integrates the management of wallets, accounts, and keys with signing and editing features that you can use as you develop smart contracts using the Pact programming language. With Chainweaver, you can build, test, and iterate on your smart contracts before deploying them to your local development network, the Kadena test network, or the Kadena [main network](https://medium.com/kadena-io/all-about-chainweb-101-and-faqs-6bd88c325b45).

Chainweaver includes a built-in read-eval-print-loop (REPL) interactive interpreter that enables you to write and execute Pact code in the desktop or web-based application. You can also use Chainweaver to:

- Explore smart contract modules and functions.
- Define and manage authorization rules in keysets.
- Deploy smart contracts on a network.
- Update previously-deployed contracts.

If you don't already have a Chainweaver account, you should create one using either the [Chainweaver desktop application](https://github.com/kadena-io/chainweaver/releases) or the [Chainweaver web application](https://chainweaver.kadena.network/). After you download and install the desktop application or open Chainweaver in a browser, you can create a wallet and accounts to interact with Kadena networks.

When you open and unlock Chainweaver, the navigation panel on the left is collapsed to only display icons by default. The navigation panel provides access to the tools for managing your accounts, keys, and development environment.

| Icon | Section | What you can do here |
| --- | --- | --- |
| ![](/./img/accounts-icon.png) | Accounts | View and manage your accounts, add account names to your watch list, transfer funds between accounts and across chains, and view transaction status. |
| ![](/./img/keys-icon.png) | Keys | Generate, view, and manage public keys associated with your secret key. |
| ![](/./img/sig-icon.png) | Signature Builder | Construct the signatures needed to sign transactions. |
| ![](/./img/contracts-icon.png) | Contracts | Access a code editor and development tools for writing, testing, and deploying Pact modules and smart contracts. |
| ![](/./img/resources-icon.png) | Resources | Explore documentation and Chainweaver resources. |
| ![](/./img/settings-icon.png) | Settings | Configure your network and account settings. |
| ![](/./img/logout-icon.png) | Log out | Log out of the current session. |

## Start the development network

If you haven't downloaded the Docker image for the development network or have stopped the container, you should pull the latest image and start the network on your local computer. The development network includes several commonly-used contracts deployed by default. These contracts provide functions you can reuse to perform common tasks like creating accounts and transferring funds.

To start the local development network:

1. Open a terminal shell on your computer.

2. Start the Docker service if it isn't configured to start automatically.

3. Start the container without a persistent volume by running the following command:

   ```shell
   docker run --interactive --tty --publish 8080:8080 kadena/devnet:latest
   ```

   You can stop the network at any time—and reset the blockchain state—by pressing Ctrl-c in the terminal.

### Connect to the development network

By default, Chainweaver lets you connect to the Kadena test network and the Kadena main network. However, as you start writing Pact modules, you'll want to test and deploy them on your local development network. Before you can do that, you need to configure Chainweaver to connect to the local host and port number running the development network.

To connect to the development network:

1.  Click **Settings** in the Chainweaver navigation panel.

2.  Click **Network**.

3.  In Edit Networks, type a network name, then click **Create**.

4.  Expand the new network, then add the localhost as a node for this network by typing `127.0.0.1:8080`.

    If the local computer is still running the development network Docker container, you should see the dot next to the node turn green.

5.  Click **Ok** to close the network settings.

### Navigate smart contracts

After you connect Chainweaver to the development network, you can use Chainweaver to deploy and manage the smart contracts you develop. You can access the Chainweaver development environment by clicking **Contracts** in the navigation panel.

After you click Contracts, Chainweaver displays common tasks and two working areas:

- The left side displays a sample contract in a code editor that you can use to view and edit contract code.
- The right side provides controls that enable you to navigate between contracts, view contract details, manage keys, and test operations for contracts you have deployed.

The common tasks enable you to:

- Browse to an open a file from the file system.
- Load your contract into the Pact interactive REPL where you can run Pact commands.
- Deploy the selected contract on the active blockchain network.

You'll use **Load into REPL** and **Deploy** frequently as you start writing Pact modules and deploy modules on the local development network.

## Code editor

Within the Contracts development environment, the code editor enables you to view and modify contract code using a familiar editing interface. It's similar to other code editors with support for copying and pasting text, syntax highlighting, and inline error reporting.

You can hover the cursor over lines that indicate errors to view information about the problem to help you determine how to fix it.

![Inline error](/./img/inline-error.png)

The Chainweaver code editor also supports **formal verification**. Formal verification is a process that enables you to automatically test the correctness of your code for potential errors and security vulnerabilities. With this process, you can mathematically prove that your contract has no security vulnerabilities, ensuring you can create secure code quickly and effectively.

For more information about how formal verification helps you develop safer smart contracts, see [Pact Formal Verification: Making Blockchain Smart Contracts Safer.](https://medium.com/kadena-io/pact-formal-verification-for-blockchain-smart-contracts-done-right-889058bd8c3f)

## Contract navigation and developer tools

The right side of the Contracts development environment provides many useful features and tools for developing smart contracts. For example, there are features to help you set up your environment, run commands in the interactive REPL, read messages, and explore other modules that exist on the network.

### Env

Select **Env** to view and fix errors or manage authorization data in keysets. If the error and warning detected can be fixed automatically, you'll see the Fix option.

![Environment errors](/./img/fix-error.png)

In this example, the error is a missing keyset and you can click **Fix** to automatically create the keyset and add it to the Data section.

![New admin-keyset](/./img/admin-keyset.png)

If you delete the keyset created for you, you can use the Data section to create a keyset by typing a keyset name, then clicking **Create**. By default, keysets require all of the keys associated with an account to sign transactions, so you'll see **keys-all** selected for the new keyset. You'll learn more about keysets, in [Keysets](/build/pact/keysets).

You can also create keysets manually using the JSON format by clicking **Raw**, then defining the keyset **name**, **keys**, and **pred** values. You can see the JSON format for keysets you have created by clicking **Result**.

![Keyset in JSON format](/./img/result.png)

The `pred` field specifies a `predicate` function to use for the keyset. The `predicate` function returns a boolean value evaluating to true or false. In this case, the predicate option evaluated is **keys-all** and it returns true if all of the keys listed in the keyset—in this example, only one key—sign the transaction.

### REPL

A great way to get started with Pact is by writing some simple code for yourself. The REPL enables you to run Pact commands directly in the browser. Select **REPL** to open the Pact interactive interpreter, then try running the following commands to start learning Pact syntax conventions.

**Numbers**

Pact uses **prefix notation** for math operators. With prefix notation, the operator precedes the values it’s operating on. For example, you can add two numbers with the following command:

```pact title=" "
(+ 2 2)
4
```

To subtract two numbers:

```pact title=" "
pact>(- 4 9)
-5
```

To multiply two numbers:

```pact
pact>(* 3 4)
12
```

**Strings**

You can concatenate strings using a plus (+) as a prefix. For example, you can concatenate the strings "Hello" and "REPL" with the following command:

```pact title=" "
pact > (+ "Hello" " REPL")
“Hello REPL”
```

**Lists**

You can specify lists using square brackets (`[ ]`) with or without commas. For example, you can specify the elements in a list without using commas:

```pact
pact> [1 2 3]
[1 2 3]
```

To specify the elements in a list using commas:

```pact
pact>["blue","yellow","green"]
["blue" "yellow" "green"]
```

**Objects**

You can create objects using curly braces (`{ }`) with key-value pairs separated by a colon (`:`). For example:

```pact
pact> { "foo": (+ 1 2), "bar": "baz" }
{ "foo": 3, "bar": "baz" }
```

You can view more commands to try in [Syntax and keywords](/reference/syntax) and [Pact functions](/reference/functions).

**Run commands in the code editor**

You can also run commands in the **code editor**. To run commands in the code editor, delete existing code from the code editor type a command, then click **Load into REPL**.

### Messages

Code editors often provide messages to help you identify errors and log outputs. These messages are useful for debugging programs and fixing potential issues with your contract. Select **Messages** to view messages from the code editor in Chainweaver.

### Module Explorer

Select **Module Explorer** to open and view sample smart contracts, search for and view deployed contracts, and call functions from any contract that exists on the active network.

![Module explorer](/./img/module-explorer.png)

Under **Examples**, you can click **Open** next to an example contract name to load the contract into the code editor. You can modify the code in the editor and reload the original contract code at any time, if needed. Click **View** to explore the Pact modules in a contract.

For example, if you select the **Simple Payment** contract, then click **View** for the **payments** modules, you'll see the functions and capabilities defined in the **payments** module.

![Simple payment functions and capabilities](/./img/example-functions.png)

Under **Deployed Contracts**, you san search for any contract that has been deployed to the network using the Module Explorer by name, by chain, or by navigating the pages using the arrow buttons.

After you select a deployed contract, you can click **View** to see details about what's defined in the contract, including implemented interfaces, functions, capabilities, and pact included in the contract. You can click **Open** to see the full contract code in the code editor.

You can also call individual functions from within the Module Explorer. You'll learn more about calling functions in [Hello World](/build/pact/hello-world).

## Next steps

In this section, you set up your development environment with a local development blockchain network, Pact, and Chainweaver. You also explored the Chainweaver development environment by viewing full contract logic in the code editor, running simple Pact commands in the interactive REPL, and navigating through the features and tools for writing and testing smart contracts.

Before moving on, you might want to use the code editor and Module Explorer to get a more detailed view of the modules defined in the example and deployed contracts.

WHen you're ready, the next section introduces Pact with a simple "Hello, World!" contract. For the next steps, you'll:

- Define a module for the `hello-world` contract.
- Define an owner for the module using a keyset.
- Define a function in the module.
- Execute the module using the interactive Pact REPL interpreter.

