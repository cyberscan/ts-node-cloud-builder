# lerna-resolver

This package is intended to be used with lerna

After bootstrapping all your dependencies lerna-resolver will replace the symlinks at your selected applications node_modules folder and copy the packages instead.

## CLI should be used in monorepo root!

### install dependencies
```typescript
npm install
```
### install cli global
```typescript
npm link
```

### usage
```
lerna-resolver --help

Usage: lerna-resolver [options]

Options:
    -V, --version                     output the version number
-d, --debug                       verbose output
-dry, --dry-run                   test paths
-s, --source [names...]           specify single glob-format to copy
-a, --application <package_name>  application to copy packages for
    -h, --help                        display help for command




# copy dependencies from "@applications/server"

lerna-resolver -a @applications/server -s dist/** -s package.json
```