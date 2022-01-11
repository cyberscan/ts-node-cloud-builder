#!/usr/bin/env node

const { Command } = require("commander");
const { sync: commandExistsSync } = require("command-exists");
const { execSync } = require("child_process");
const { existsSync, unlinkSync, lstatSync, rmdirSync } = require("fs");
const { join, normalize } = require("path");
const cpx = require('cpx');
const program = new Command();

program.version("0.0.1");
// define options
program
  .option("-d, --debug", "verbose output")
  .option("-dry, --dry-run", "test paths")
  .option("-s, --source [names...]", "specify single glob-format to copy")
  .requiredOption(
    "-a, --application <package_name>",
    "application to copy packages for"
  );

program.parse(process.argv);

const options = program.opts();

function cli() {
  if (options.debug)
    console.log("Info: options: " + JSON.stringify(options, null, 2));
  if (options.dryRun) console.log("Info: dry run activated");

  // check if lerna is installed
  const lernaInstalled = commandExistsSync("lerna");
  if (!lernaInstalled) throw "Error: lerna need to be installed";

  // check if lerna.json exists
  const lernaJsonPath = normalize(join(process.env.PWD, "lerna.json"));
  const lernaJsonExists = existsSync(lernaJsonPath);
  if (!lernaJsonExists) throw "Error: lerna.json in folder is required";

  // receive dependencies
  const result = execSync(
    `lerna ls -a -l --json --scope=${options.application} --include-dependencies`,
    { encoding: "utf-8", stdio: "pipe" }
  );
  let parsedLernaLsResult = JSON.parse(result.trim());

  // resolve application dir
  const applicationPackage = parsedLernaLsResult.filter(
    (package) => package.name === options.application
  )[0];
  if (!applicationPackage) throw "Error: could not determine main application";

  if (options.debug) {
    console.log(
      "Info: following application will be bootstrapped: ",
      JSON.stringify(applicationPackage, null, 2)
    );
  } else {
    console.log(`Info: main application ${applicationPackage.name}`);
  }

  // resolve application dependencies (packages)
  const applicationPackageDependencies = parsedLernaLsResult.filter(
    (package) => package.name !== options.application
  );
  // resolve application node_modules
  const applicationNodeModulesFolder = normalize(
    join(applicationPackage.location, "node_modules")
  );

  for (let package of applicationPackageDependencies) {
    const packageDestination = normalize(
      join(applicationNodeModulesFolder, package.name)
    );
    if (existsSync(packageDestination)) {
      const packageDestinationStats = lstatSync(packageDestination);
      if (packageDestinationStats.isSymbolicLink()) {
        unlinkSync(packageDestination);
      } else {
        rmdirSync(packageDestination, { recursive: true });
      }
    }
  }

  // process each package for application
  for (let package of applicationPackageDependencies) {
    processPackage(package, applicationNodeModulesFolder);
  }
}

function processPackage(package, destinationFolder) {
  const copyOptions = {
    dereference: true,
    includeEmptyDirs: true,
  };

  // files to copy
  // generate glob from source array
  const sourceGlob = options.source.reduce((prev, curr, acum, arr) => {
    if (acum === arr.length - 1) {
      prev = prev + "/" + curr + ",}";
      return prev;
    } else {
      prev = prev + "/" + curr + ",";
      return prev;
    }
  }, "{");

  const packageSourceGlob = `${package.location}${sourceGlob}`;

  // destination to copy to
  const packageDestination = normalize(join(destinationFolder, package.name));

  if (options.debug) {
    console.log(`unlink dir ${packageDestination}`);
    console.log(`copy from "${packageSourceGlob}" to "${packageDestination}"`);
    copyOptions.verbose = true;
  }

  // prevent copy if dryrun
  if (options.dryRun) {
    return;
  }

  cpx.copySync(packageSourceGlob, packageDestination, copyOptions)
}

cli();
