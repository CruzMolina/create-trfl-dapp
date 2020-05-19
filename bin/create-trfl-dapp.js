#!/usr/bin/env node
const {
  processParams,
  createFolder,
  downloadTemplate,
  updateProjectFiles,
  notifyUser,
} = require("./helpers");

const templates = {
  js: `CruzMolina/truffle-template-js`,
};

const main = async () => {
  const args = require("yargs").argv;
  const projectLocation = args._[0];
  let projectPath, projectName;

  try {
    ({ projectPath, projectName } = await processParams(projectLocation));
  } catch (error) {
    throw error;
  }

  const templateLocation = templates.js;

  await createFolder(projectPath);
  await downloadTemplate(templateLocation, projectPath);
  await updateProjectFiles(projectPath, projectName);
  await notifyUser(projectPath, projectName);
};

main().catch(console.error);
