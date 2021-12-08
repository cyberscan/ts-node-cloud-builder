#!/usr/bin/env bash

set -eo pipefail

if [ -z "$1" ]; then
  _entrypoint="yarn"
else
  _entrypoint="$1"
  shift
fi

if ! command -v "$_entrypoint" > /dev/null 2>&1; then
  echo "::error ::Command not found: $_entrypoint"
  exit 1
fi

if [ -n "$1" ]; then
  IFS=' ' read -r -a _args <<< "$1"
  shift
  exec "$_entrypoint" "${_args[@]}" "$@"
else
  exec "$_entrypoint" "$@"
fi
