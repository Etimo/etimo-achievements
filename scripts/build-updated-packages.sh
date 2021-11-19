#!/bin/bash

built_packages=()

main() {
  for package_path in $(find "$_packages_path" -mindepth 1 -maxdepth 1 -type d); do
    build_package_tree "$package_path"
  done

}

build_package_tree() {
  ! has_updated_files "$1" && return 0

  package_name=$(basename "$1")
  dependants=$(get_dependants "$package_name")
  echo "Building $package_name + $dependants"
  build_package "$package_name"
  for p in ${dependants[*]}; do
    build_package_tree "$p"
  done
}

build_package() {
  [[ " ${built_packages[*]} " =~ [[:space:]]"$1"[[:space:]] ]] && return 0

  echo "Building $1"
  #(cd "$_packages_path/$1" || exit 1
  #npm run compile) || exit 1

  built_packages+=("$1")
  date +%Y-%m-%dT%H:%M:%S > "$_packages_path/$1/.latest_build"
}

has_updated_files() {
  latest_build_file="$1/.latest_build"

  [ ! -f "$latest_build_file" ] && echo "1970-01-01T00:00:00" > "$latest_build_file"

  package_mdate=$(cat "$latest_build_file")

  (cd "$_packages_path" || exit 1
  find "." -type f -newermt "$package_mdate" \
    -iname "*.ts" \
    -or -iname "*.tsx" \
    -or -iname "*.js" \
    -or -iname "*.json" \
    -not -name "*.d.ts" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/migrations/*" \
    | sed -r "s/^.\///" | cut -f1 -d/ | sort -u)
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
