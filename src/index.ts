import * as core from '@actions/core';
import madge from 'madge';
import { exec } from 'child_process';

async function run() {
  try {
    // Get inputs from the action
    const modifiedFilesInput = core.getInput('modified_files');
    const pagesToCheckInput = core.getInput('pages_to_check');
    const projectDirectory = core.getInput('project_directory') || './';
    const madgeOptions = core.getInput('madge_options') || '';

    const modifiedFiles = modifiedFilesInput.split(' ');
    const pagesToCheck = pagesToCheckInput.split(',');

    //logs
    console.log('modifiedFilesInput:', modifiedFilesInput);
    console.log('pagesToCheckInput:', pagesToCheckInput);
    console.log('projectDirectory:', projectDirectory);
    console.log('madgeOptions:', madgeOptions);
    console.log('modifiedFiles:', modifiedFiles);
    console.log('pagesToCheck:', pagesToCheck);

    // Filter to include only files that start with 'src' and remove the 'src/' prefix
    const filteredModifiedFiles = modifiedFiles
      .filter(file => file.startsWith('src'))
      .map(file => file.replace(/^src\//, '')); // Remove 'src/' prefix
    console.log('filteredModifiedFiles:', filteredModifiedFiles);

    // ls -a in current directory
    exec('ls -a', (err: any, stdout: any, stderr: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    });

    const affectedPages: string[] = [];

    // Iterate over each page to check dependencies with modified files
    for (const page of pagesToCheck) {
      // Run madge to analyze dependencies
      const dependencyTree = await madge(page, { tsConfig: `tsconfig.json` });

      // Get the list of dependencies for the current page
      const dependencies = dependencyTree.obj();

      console.log('dependencies:', dependencies);

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
    // Output the affected pages as a comma-separated list
    core.setOutput('affected_pages', affectedPages.length > 0 ? affectedPages.join(',') : '[]');

  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();