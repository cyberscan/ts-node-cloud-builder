#!/usr/bin/env bash

set -eo pipefail

_entrypoint="$1"
shift

if ! command -v "$_entrypoint" > /dev/null 2>&1; then
  echo "::error ::Command not found: $_entrypoint"
  exit 1
fi

if [ -n "$1" ]; then
  IFS=', ' read -r -a _args <<< "$1"
  shift
else
  declare -a _args
fi

exec "$_entrypoint" "${_args[@]}" "$@"
