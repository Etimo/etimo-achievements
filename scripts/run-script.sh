#!/bin/sh

main() {
  packages=$("$_script_path/list-packages.sh")
  for package in $packages; do
    (cd "$_root_path/packages/$package" || exit 1
    time -p npm run "$*") || exit 1
  done
}

# Setup paths
_script_path="$(dirname "$(readlink -f "$0")")"
_root_path="$(readlink -f "$_script_path/..")"

main "$*"
