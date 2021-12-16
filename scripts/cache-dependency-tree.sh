#!/bin/bash

# Create a list of packages and their intra-app dependencies

main() {
  [ "$1" = "--force" ] && rm -f "$_dependency_list_file"

  if ! updated_package_json; then
    echo "Intra-app dependency list unchanged."
    exit 0
  fi

  "$_script_path"/update-references.sh

  echo > "$_dependency_list_file"
  for package_path in $(find $_packages_path -mindepth 1 -maxdepth 1 -type d); do
    package_name="$(basename "$package_path")"
    dependants=()
    for package_json in $(find "$_packages_path" -mindepth 2 -maxdepth 2 -name "package.json"); do
      dependant_name="$(basename "$(dirname "$package_json")")"
      [[ " $(list_dependencies "$package_json") " =~ " $package_name " ]] && {
        dependants+=("$dependant_name")
      }
    done
    echo "$package_name: ${dependants[*]}" >> "$_dependency_list_file"
  done

  # Remove empty lines
  sed -i '' '/^$/d' "$_dependency_list_file"

  echo "Updated intra-app dependency list."
}

updated_package_json() {
  [ ! -f "$_dependency_list_file" ] && return 0

  latest_mdate=$(find "$_root_path"/packages/ -mindepth 2 -maxdepth 2 -name "package.json" -exec sh -c "stat -t %s '{}' | cut -d\  -f11 | cut -d\" -f2" \; | sort | tail -n 1)
  cache_mdate=$(stat -t %s "$_dependency_list_file" | cut -d\  -f11 | cut -d\" -f2)

  [ "$latest_mdate" -gt "$cache_mdate" ]
}

list_dependencies() {
  jq "{dependencies,devDependencies}" "$1" | grep "@etimo-achievements" | cut -f1 -d: | cut -f2 -d/ | tr -d '"' | xargs
}

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$_script_path/.."
_packages_path="$_root_path/packages"
_dependency_list_file="$_packages_path/.dependency_list"

main "$1"
