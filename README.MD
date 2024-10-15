# Next.js Page Dependency Analyzer GitHub Action 📜

## Overview

**Next.js Page Dependency Analyzer** is a GitHub Action that automates the process of identifying Next.js pages impacted by modified files in a Pull Request (PR). This action uses [Madge](https://github.com/pahen/madge) to analyze the dependency graph between specific files and pages, ensuring that any modified components or utilities are linked to the affected pages in your Next.js project.

### Features:

- Detects Next.js pages impacted by changes in modified files.
- Uses Madge for dependency analysis, including TypeScript projects with custom `tsconfig.json`.
- Customizable with additional Madge options.

## Inputs

| Name               | Description                                                                 | Required | Default |
|--------------------|-----------------------------------------------------------------------------|----------|---------|
| `modified_files`   | A list of modified files from the PR.                                        | Yes      | N/A     |
| `pages_to_check`   | A list of Next.js pages to compare against the modified files.               | Yes      | N/A     |
| `host_output`      | The output host for the affected pages list.                                 | No       | http://localhost:3000/ |

## Outputs

| Name              | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `affected_pages`  | A list of Next.js pages impacted by the modified files.                      |

## Example Workflow

Here’s an example of how to use the **Next.js Page Dependency Analyzer** in a GitHub Actions workflow:

```yaml
name: Analyze Next.js Pages Affected by PR

on:
  pull_request:
    branches:
      - main

jobs:
  analyze-pages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Get modified files
        id: changed-files
        uses: tj-actions/changed-files@v45.0.3

      - name: Run Next.js Page Dependency Analyzer
        uses: MeruImports/next-page-mapper@v1
        id: analyze_pages
        with:
          modified_files: ${{ steps.changed-files.outputs.all_changed_files }}
          pages_to_check: './src/pages/index.tsx,./src/pages/about.tsx,./src/pages/blog/[slug].tsx'

      - name: Display affected pages
        run: echo "Affected pages: ${{ steps.analyze_pages.outputs.affected_pages }}"
```

## How It Works

1. The action scans the modified files from the PR.
2. It uses Madge to analyze the dependencies between the modified files and the specified Next.js pages.
3. Based on the dependency results, the action generates a list of affected pages, if any.
4. The list of affected pages is returned as the output.

## Inputs in Detail

- **`modified_files`**: Provide the list of modified files, typically fetched using another GitHub action that lists the changed files in a PR.
  
- **`pages_to_check`**: A comma-separated list of Next.js pages to compare against the modified files. This helps focus the analysis on critical pages.
  
- **`host_output`**: The output host for the affected pages list.


### Contributing

We welcome contributions! Feel free to open an issue or submit a PR if you’d like to improve the action.
