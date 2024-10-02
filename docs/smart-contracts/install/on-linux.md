---
title: Install on Linux
id: linux
sidebar_position: 1
description: "Install the Pact smart contract programming language on Linux computers."
---

import CodeBlock from '@theme/CodeBlock';

# Install Pact on Linux

You can download and install the Pact programming language and interactive interpreter locally on your local computer as prebuilt binary file from a release archive or build Pact directly from its source code. 

## Prerequisites

If you are installing Pact 4.x, you should note that this version of Pact requires the `z3` theorem prover from Microsoft Research to support formal verification.
Pact Core doesn't support formal verification in this release.
You can install and verify the installation of the `z3` package on Linux by running the following commands:

```bash
sudo apt update
sudo apt install z3
z3 --version
```

## Installation instructions

To install Pact on Linux:

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
