---
title: Create new accounts
description: "How to create a new Kadena account without transferring any digital assets into it using the coin contract function s, Kadena CLI, and Kadena client library functions."
id: howto-create-accounts
---

import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Create new accounts

This guide provides instructions and examples for creating an on-chain account without an account balance.
If you want to create a new account without transferring any digital assets (KDA) into it, you can create the account with a zero balance by using an API call, Kadena CLI with YAML configuration, or the Kadena client TypeScript library.

## Use Kadena client libraries

<CodeBlock language="typescript">
const HELP = `Usage example: \n\nnode create-account.js k:{public-key} -- Replace {public-key} with an actual key`;
</CodeBlock>
