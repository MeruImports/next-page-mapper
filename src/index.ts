import * as core from '@actions/core';
import madge from 'madge';

async function run() {
  try {
    // Get inputs from the action
    const modifiedFilesInput = core.getInput('modified_files');
    const pagesToCheckInput = core.getInput('pages_to_check');
    const projectDirectory = core.getInput('project_directory') || './';
    const madgeOptions = core.getInput('madge_options') || '';

    const pagesToCheck = pagesToCheckInput.split(',');

    const affectedPages: string[] = [];

    // Iterate over each page to check dependencies with modified files
    for (const page of pagesToCheck) {
      // Run madge to analyze dependencies
      const dependencyTree = await madge(page, { baseDir: projectDirectory, tsConfig: `${projectDirectory}/tsconfig.json`, ...JSON.parse(madgeOptions) });

      // Get the list of dependencies for the current page
      const dependencies = dependencyTree.obj();

      // Check if any modified file is a dependency of the current page
      for (const modifiedFile of modifiedFilesInput) {
        if (dependencies[page] && dependencies[page].includes(modifiedFile)) {
          affectedPages.push(page);
          break;
        }
      }
    }

    // Output the affected pages as a comma-separated list
    core.setOutput('affected_pages', affectedPages.length > 0 ? affectedPages.join(',') : '[]');

  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();