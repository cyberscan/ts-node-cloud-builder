# ts-node-cloud-builder

A build container for Typescript/node.js projects, includes Yarn and Lerna, as well as tooling for Vue 2. Please note that this project is intended for internal use at our organization and only publically visible due to Github not offering a means to use [Actions](https://docs.github.com/en/actions) defined in private repositories. The functionality in and visibility of this repository may change without notice.

Prebuilt, ready-to-use images can be found at:

- `ghcr.io/cyberscan/ts-node-cloud-builder`
- `gcr.io/cyberscanauth/ts-node-cloud-builder` (not publically accessible, for internal use)
- `gcr.io/cyberscan2/ts-node-cloud-builder` (not publically accessible, for internal use)

The container is based on `node:${NODE_VERSION}-buster-slim`, and as such makes use of `glibc` (not `musl`). Images are built on a weekly schedule to keep dependencies and OS packages fresh, and the generated tags reflect the supported major versions of node.js:

- `ts-node-cloud-builder:12`
- `ts-node-cloud-builder:14`
- `ts-node-cloud-builder:16`

Furthermore, there's a special `lts` tag, corresponding to the current LTS release of node. By convention `latest` resolves to the `lts` image, but major version tags should be used where possible.

## Usage

The builder can be used in one of two ways: As part of a Github Actions workflow, and as part of a Google Cloud Build pipeline.

### Usage: Google Cloud Build

The builder can be used as a Google Cloud Build step in the following fashion:

```yaml
# cloudbuild.yaml

steps:
  #
  # Do Lerna things
  #
  - name: "gcr.io/${PROJECT_ID}/ts-node-cloud-builder"
    entrypoint: "lerna"
    args:
      - "bootstrap"
  #
  # Do Yarn/npm things (e.g. package.json script invocation)
  # The default entrypoint of the container is yarn, so this works:
  #
  - name: "gcr.io/${PROJECT_ID}/ts-node-cloud-builder"
    args:
      - "run"
      - "build"
  #
  # You should, whenever possible, specify the target major version
  # of node.js to use during a build. Otherwise, it defaults to using
  # the LTS version.
  #
  - name: "gcr.io/${PROJECT_ID}/ts-node-cloud-builder:16"
    args:
      - "run"
      - "test"
```

### Usage: Github Actions

The general ideas outlined in [Usage: Google Cloud Build](#usage) also apply to using the builder as a job step in a Github Actions workflow, but the syntax differs:

```yaml
# workflow.yml

steps:
  #
  # Do Lerna things
  #
  - uses: cyberscan/ts-node-cloud-builder@master
    with:
      entrypoint: lerna
      args: bootstrap
  #
  # Do Yarn/npm things (e.g. package.json script invocation)
  # The default entrypoint of the container is yarn, so this works:
  #
  - uses: cyberscan/ts-node-cloud-builder@master
    with:
      args: build
  #
  # You should, whenever possible, specify the target major version
  # of node.js to use during a build. Otherwise, it defaults to using
  # the LTS version.
  #
  - uses: cyberscan/ts-node-cloud-builder@16
    with:
      args: run test
```
