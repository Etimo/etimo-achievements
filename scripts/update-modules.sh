#!/bin/bash

main() {
  [ "$1" = "--force" ] && rm -f "$_modules_hash_file"

  [ ! -d "$_modules_path" ] && {
    echo "No modules. Running yarn install."
    install_modules
    exit 0
  }

  modules_hash=$(cat "$_modules_hash_file" 2>/dev/null)

  {
    find "$_packages_path" -mindepth 2 -maxdepth 2 -name "package.json" -exec jq "{dependencies,devDependencies}" {} \;
  } | sort | sha1sum | awk '{print $1}' > "$_modules_hash_file"

  new_modules_hash=$(cat "$_modules_hash_file")
  if [ "$modules_hash" != "$new_modules_hash" ]; then
    echo "Dependencies have changed. Running yarn install."
    install_modules
  else
    echo "Dependencies have not changed."
  fi
}

install_modules() {
  yarn install
  "$_script_path"/cache-dependency-tree.sh
}

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$_script_path/.."
_packages_path="$_root_path/packages"
_modules_path="$_root_path/node_modules"
_modules_hash_file="$_modules_path/.modules_hash"

main "$1"
