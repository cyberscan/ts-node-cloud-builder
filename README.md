# ts-node-cloud-builder
A Customized Google Cloud Build container for Typescript/node.js projects, includes Yarn and Lerna, as well as tooling for Vue 2.

## Internals

This is a Docker container to be used in Google Cloud Build steps in the following fashion:

```yaml
# cloudbuild.yaml
steps:
#
# Do Lerna things
#
  - name: "eu.gcr.io/${PROJECT_ID}/ts-node-cloud-builder"
    entrypoint: "lerna"
    args:
      - "bootstrap"
#
# Do Yarn/npm things (e.g. package.json script invocation)
# The default entrypoint of the container is yarn, so this works:
#
  - name: "eu.gcr.io/${PROJECT_ID}/ts-node-cloud-builder"
    args:
      - "run"
      - "build"
#
# You could also invoke any arbitrary command by specifying it as
# entrypoint. Bash might be handy occasionally, for example:
#
  - name: "eu.gcr.io/${PROJECT_ID}/ts-node-cloud-builder"
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
