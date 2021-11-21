#!/bin/bash

main() {
  [ "$1" = "--force" ] && rm -f "$_modules_hash_file"

  modules_hash=$(cat "$_modules_hash_file" 2>/dev/null)

  {
    find "$_packages_path" -mindepth 2 -maxdepth 2 -name "package.json" -exec jq "{dependencies,devDependencies}" {} \;
  } | sort | sha1sum | awk '{print $1}' > "$_modules_hash_file"

  new_modules_hash=$(cat "$_modules_hash_file")
  if [ "$modules_hash" != "$new_modules_hash" ]; then
    echo "Dependencies have changed. Running yarn install."
    yarn install
    "$_script_path"/cache-dependency-tree.sh
  else
    echo "Dependencies have not changed."
  fi
}

# Setup paths
_script_path="$(dirname "$(readlink -f "$0")")"
_root_path="$(readlink -f "$_script_path/..")"
_packages_path="$_root_path/packages"
_modules_hash_file="$_root_path/node_modules/.modules_hash"

main "$1"
