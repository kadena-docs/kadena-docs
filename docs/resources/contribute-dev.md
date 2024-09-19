---
title: Contribute as a developer
description: "Get started as a code contributor to the Kadena project."
id: contribute-dev
---

# How to contribute as a developer

We appreciate your interested in contributing to the Kadena project.
There are a lot of ways to get involved.
For example, you can contribute by:

- Fixing bugs in existing features, code logic, or code comments.
- Suggesting design enhancements.
- Implementing new features.
- Providing usability testing and feedback.
- Translating code or documentation.

This guide describes how to get started with contributing as a developer.

## Set up a local development environment

To set up a local development environment for contributing to Kadena:

1. Navigate to the appropriate repository on GitHub. 

2. Click **Fork** tfor he repository on GitHub to create your own copy of the repository.

3. Open a terminal shell on your computer.

2. Clone your fork locally by running the following command:

   ```bash
   git clone https://github.com/YOUR_USERNAME/PROJECT_NAME.git
   ```

3. Install dependencies by running the following command:
   
   ```bash
   npm install
   ```

4. Set up pre-commit hooks by running the following command:
   
   ```bash
   npm run prepare
   ```

## Find issues to work on

- Check for open issues in the repository. 
  For example, check the Open issues for the [kadena.js](https://github.com/kadena-community/kadena.js/issues)
- Check for issues labeled **good first issue**.
- If you have an idea for a new feature, please open a new issue to discuss it before starting work.

## Branching strategy

We use a simplified Git flow:
- `main` branch for stable releases
- `develop` branch for ongoing development
- Feature branches should be created from `develop`

## Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Pull requests

1. Create a new branch from `develop`.
2. Make your changes and commit them.
3. Push to your fork and submit a pull request to the `develop` branch.
4. Ensure your PR description clearly describes the problem and solution.

## Recognizing contributors

We use the [All Contributors](https://allcontributors.org/) specification to recognize all types of contributions. After your first contribution is merged, you'll be added to the contributors list in the README.

<!-- ### Contribution rewards

More updates on this will be added shortly
To show our appreciation, we offer the following rewards for significant contributions:
- Contributor of the Month recognition
- Exclusive project swag for major contributions
- Opportunities to speak at project-related events -->

## Review process

1. Automated tests will run on your pull request.
2. A maintainer will review your contribution.
3. Address any feedback or requested changes.
4. Once approved, a maintainer will merge your contribution.

## Community

- Join the [Kadena Discord server](https://discord.gg/kadena) for real-time discussions. 
- Follow Kadena on [X](https://x.com/kadena_io) or [LinkedIn](https://www.linkedin.com/company/kadena-llc/mycompany/) for news and announcements.
