import * as core from '@actions/core';
import madge from 'madge';

async function run() {
  try {
    // Get inputs from the action
    const modifiedFilesInput = core.getInput('modified_files');
    const pagesToCheckInput = core.getInput('pages_to_check');
    const host_output = core.getInput('host_output') || 'http://localhost:3000/';

    const modifiedFiles = modifiedFilesInput.split(' ');
    const pagesToCheck = pagesToCheckInput.split(',');

    // Filter to include only files that start with 'src' and remove the 'src/' prefix
    const filteredModifiedFiles = modifiedFiles
      .filter(file => file.startsWith('src'))
      .map(file => file.replace(/^src\//, '')); // Remove 'src/' prefix

    const affectedPages: string[] = [];

    // Iterate over each page to check dependencies with modified files
    for (const page of pagesToCheck) {
      // Run madge to analyze dependencies
      const dependencyTree = await madge(page, { tsConfig: `tsconfig.json` });

      // Get the list of dependencies for the current page
      const dependencies = dependencyTree.obj();

      // Check if any modified file is a dependency of the current page
      for (const modifiedFile of filteredModifiedFiles) {
        // Check if the modified file is part of the dependency path
        let isAffected = false;
        for (const dependencyFiles of Object.values(dependencies)) {
          if (dependencyFiles.some(dep => dep.includes(modifiedFile))) {
            affectedPages.push(page);
            isAffected = true;
            break;
          }
        }

        if (isAffected) break;
      }
    }

    console.log('affectedPages:', affectedPages);

    const formatOutput = affectedPages.map(page =>
      page.replace(/^src\/pages\//, '').replace(/^src\/app\//, '').replace(/\.tsx$/, '')
        .replace(/\/index$/, '').replace(/\/page$/, '').replace(/\/\([^)]*\)/g, '')
    )
      .map(page => `${host_output}${page}`);

    console.log('formatOutput:', formatOutput);

    // Output the affected pages as a comma-separated list
    core.setOutput('affected_pages', affectedPages.length > 0 ? formatOutput : []);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();