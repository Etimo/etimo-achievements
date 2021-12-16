#!/bin/bash

main() {
  packages=$("$_script_path/list-packages.sh")
  for package in $packages; do
    (cd "$_root_path/packages/$package" || exit 1
    npm run "$*") || exit 1
  done
}

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$_script_path/.."

main "$*"
