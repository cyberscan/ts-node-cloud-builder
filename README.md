# ts-node-cloud-builder

A build container for Typescript/node.js projects, includes Yarn and Lerna, as well as tooling for Vue 2.

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

The builder can be used in Google Cloud Build steps in the following fashion:

```yaml
# cloudbuild.yaml
steps:
  #
  # Do Lerna things
  #
  - name: "gcr.io/${PROJECT_ID}/ts-node-cloud-builder:14"
    entrypoint: "lerna"
    args:
      - "bootstrap"
  #
  # Do Yarn/npm things (e.g. package.json script invocation)
  # The default entrypoint of the container is yarn, so this works:
  #
  - name: "gcr.io/${PROJECT_ID}/ts-node-cloud-builder:14"
    args:
      - "run"
      - "build"
  #
  # You could also invoke any arbitrary command by specifying it as
  # entrypoint. Bash might be handy occasionally, for example:
  #
  - name: "gcr.io/${PROJECT_ID}/ts-node-cloud-builder:14"
    entrypoint: "bash"
    args:
      - "-c"
      - |
        case "$SOMETHING" in
          "banana")
            echo "apple"
            ;;
          "apple")
            echo "banana"
            ;;
          *)
            echo "pineapple-pen"
            exit 1
            ;;
        esac
```
