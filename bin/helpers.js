const { join, basename } = require("path");
const fs = require("fs");
const { promisify } = require("util");
const download = require("download-git-repo");
const githubDownload = promisify(download);

module.exports = {
  processParams: async (projectLocation) => {
    let projectPath;
    try {
      projectPath = join(process.cwd(), projectLocation);
    } catch (error) {
      throw `  Please specify a project directory:
    \x1b[36mcreate-trfl-dapp\x1b[0m \x1b[35m<project-directory>\x1b[0m

  For example:
    \x1b[36mcreate-trfl-dapp\x1b[0m \x1b[35mmy-truffle-dapp\x1b[0m
    `;
    }
    const projectName =
      projectLocation === "."
        ? basename(projectPath)
        : basename(projectLocation);
    return { projectPath, projectName };
  },

  createFolder: async (projectPath) => {
    // create folder if it does not exist
    const folderExists = fs.existsSync(projectPath);
    if (!folderExists) {
      process.stdout.write("  Creating directory...");
      fs.mkdirSync(projectPath, { recursive: true });
      process.stdout.write("\x1b[35m DONE\x1b[0m\n");
    }
  },

  downloadTemplate: async (templateUrl, projectPath) => {
    // download template project from github
    process.stdout.write("  Downloading template project...");
    await githubDownload(templateUrl, projectPath);
    process.stdout.write("\x1b[35m DONE\x1b[0m\n\n");
  },

  updateProjectFiles: async (projectPath, projectName) => {
    // change package.json project name
    const pkgJsonPath = join(projectPath, "package.json");
    const packageJSON = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const newPackageJSON = {
      ...packageJSON,
      name: projectName,
      description: "",
    };

    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify(newPackageJSON, null, 2),
      "utf8"
    );
  },

  notifyUser: async (projectPath, projectName) => {
    // notify user that the app is ready
    console.log(`  \x1b[104mSUCCESS!\x1b[0m

  Created project \x1b[36m${projectName}\x1b[0m at \x1b[36m${projectPath}\x1b[0m
  Navigate to that directory and run the following commands:

    1. \x1b[35mnpm install\x1b[0m or \x1b[35myarn\x1b[0m to install dependencies

    2. \x1b[35mnpm start\x1b[0m or \x1b[35myarn start\x1b[0m to start developing

  \x1b[33mEnjoy!\x1b[0m
`);
  },
};
