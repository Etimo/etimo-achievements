#!/bin/bash

# Create a list of packages and their intra-app dependencies

main() {
  [ "$1" = "--force" ] && rm -f "$_dependency_list_file"

  if ! updated_package_json; then
    cat "$_dependency_list_file"
    exit 0
  fi

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
  sed -i '/^$/d' "$_dependency_list_file"

  cat "$_dependency_list_file"
}

updated_package_json() {
  [ ! -f "$_dependency_list_file" ] && return 0

  latest_mdate=$(find "$_root_path"/packages/ -mindepth 2 -maxdepth 2 -name "package.json" -exec date +%s -r {} \; | sort | tail -n 1)
  cache_mdate=$(date +%s -r "$_dependency_list_file")

  [ "$latest_mdate" -gt "$cache_mdate" ]
}

list_dependencies() {
  jq "{dependencies,devDependencies}" "$1" | grep "@etimo-achievements" | cut -f1 -d: | cut -f2 -d/ | tr -d '"' | xargs
}

# Setup paths
_script_path="$(dirname "$(readlink -f "$0")")"
_root_path="$(readlink -f "$_script_path/..")"
_packages_path="$_root_path/packages"
_dependency_list_file="$_packages_path/.dependency_list"

main "$1"
