#!/bin/bash

built_packages=()

main() {
  for package_path in $(find "$_packages_path" -mindepth 1 -maxdepth 1 -type d); do
    ! has_updated_files "$package_path" && continue
    echo "Detected changes in $(basename "$package_path") -- building"
    build_package_tree "$package_path"
  done

}

build_package_tree() {
  package_name=$(basename "$1")
  dependants=$(get_dependants "$package_name")
  build_package "$package_name"
  for p in ${dependants[*]}; do
    echo "Building dependant package $p"
    build_package_tree "$_packages_path/$p"
  done
}

build_package() {
  [[ " ${built_packages[*]} " =~ [[:space:]]"$1"[[:space:]] ]] && return 0

  (cd "$_packages_path/$1" || exit 1
  npm run compile) || exit 1

  built_packages+=("$1")
  date +%Y-%m-%dT%H:%M:%S > "$_packages_path/$1/.latest_build"
}

has_updated_files() {
  latest_build_file="$1/.latest_build"

  [ ! -f "$latest_build_file" ] && {
    echo "1970-01-01T00:00:00" > "$latest_build_file"
  }

  package_mdate=$(cat "$latest_build_file")

  mfiles=$(find "$1" -type f -newermt "$package_mdate" \
    -not -name ".*" \
    -not -name "*.d.ts" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/migrations/*" | wc -l)

  (( mfiles ))
}

get_dependants() {
  cat "$_dependency_list_file" | grep "$1:" | cut -f2- -d: | xargs
}

# Setup paths
_script_path="$(dirname "$(readlink -f "$0")")"
_root_path="$(readlink -f "$_script_path/..")"
_packages_path="$_root_path/packages"
_dependency_list_file="$_packages_path/.dependency_list"

main
