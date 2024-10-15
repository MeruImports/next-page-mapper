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
| `project_directory`| The root directory of the Next.js project (if not the root).                 | No       | `./`    |
| `madge_options`    | Custom options for Madge to modify the dependency analysis.                  | No       | `''`    |

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
        uses: your-username/next-page-dependency-analyzer@v1
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
  
- **`project_directory`**: The root directory of your Next.js project, used to locate the `tsconfig.json` file. This input is optional, and by default, it assumes the project is in the root directory.
  
- **`madge_options`**: Additional Madge configuration to modify the behavior of dependency analysis, such as circular dependency detection.

### Contributing

We welcome contributions! Feel free to open an issue or submit a PR if you’d like to improve the action.
