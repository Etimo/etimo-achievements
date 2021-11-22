#!/bin/sh

# List packages in dependency order

packages=""

main() {
  package_count=$(ls "$_root_path/packages" | wc -l)

  [ "$1" = "--force" ] && rm -f "$_package_list_file"

  if ! updated_package_json; then
    cat "$_package_list_file"
    exit 0
  fi

  # Walk through all packages x times and build a dependency chain
  for i in $(seq 1 "$package_count"); do
    for package in $(find "$_root_path/packages" -name "package.json" -not -path "*/node_modules/*"); do
      get_dependencies "$package"
    done
  done

  echo "$packages" | tee "$_package_list_file"
}

updated_package_json() {
  [ ! -f "$_package_list_file" ] && return 0

  latest_mdate=$(find "$_root_path"/packages/ -mindepth 2 -maxdepth 2 -name "package.json" -exec date +%s -r {} \; | sort | tail -n 1)
  cache_mdate=$(date +%s -r "$_package_list_file")

  [ "$latest_mdate" -gt "$cache_mdate" ]
}

get_dependencies() {
  dependencies=$(list_dependencies "$1")

  package_path=$(dirname "$1")
  package_name=$(basename "$package_path")

  if no_missing_dependencies "$dependencies"; then
    if ! package_is_added "$package_name"; then
      packages="$(echo "$packages $package_name" | xargs)"
    fi
  fi
}

package_is_added() {
  for package in $packages; do
    if [ "$package" = "$1" ]; then
      return 0
    fi
  done

  return 1
}

no_missing_dependencies() {
  [ -z "$(get_missing_dependencies "$*")" ]
}

get_missing_dependencies() {
  for dependency in $*; do
    if ! package_is_added "$dependency"; then
      echo "$dependency"
    fi
  done
}

list_dependencies() {
  jq "{dependencies,devDependencies}" "$1" | grep "@etimo-achievements" | cut -f1 -d: | cut -f2 -d/ | tr -d '"' | xargs
}

# Setup paths
_script_path="$(dirname "$(readlink -f "$0")")"
_root_path="$(readlink -f "$_script_path/..")"
_package_list_file="$_root_path/packages/.package_list"

main "$1"
