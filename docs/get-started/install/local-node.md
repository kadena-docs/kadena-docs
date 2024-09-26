---
title: Local development network
id: local-dev-node
sidebar_position: 5
description: "Start a local development network with a standalone blockchain node."
---

# Set up a development network


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

## Connect to the development network

By default, Chainweaver lets you connect to the Kadena test network and the Kadena main network. However, as you start writing Pact modules, you'll want to test and deploy them on your local development network. Before you can do that, you need to configure Chainweaver to connect to the local host and port number running the development network.

To connect to the development network:

1.  Click **Settings** in the Chainweaver navigation panel.

2.  Click **Network**.

3.  In Edit Networks, type a network name, then click **Create**.

4.  Expand the new network, then add the localhost as a node for this network by typing `127.0.0.1:8080`.

    If the local computer is still running the development network Docker container, you should see the dot next to the node turn green.

5.  Click **Ok** to close the network settings.
