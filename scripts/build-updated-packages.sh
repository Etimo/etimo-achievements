#!/bin/bash

built_packages=()

main() {
  [ ! -f "$_latest_build_file" ] && {
    echo "1970-01-01T00:00:00" > "$_latest_build_file"
  }

  latest_build="$(date +%Y-%m-%dT%H:%M:%S -d @"$(stat -c %Y "$_latest_build_file")")"
  echo "Latest build: $latest_build"

  updated_package="$(get_updated_packages)"
  [ -z "$updated_package" ] && exit 0

  echo "Updated package: $updated_package"

  package_path="$_packages_path/$updated_package"
  package_name="$(basename "$package_path")"
  [ "$package_name" = "api" ] && {
    echo "Rebuilding OpenApi definition"
    npm run openapi
  }

  build_package_tree "$package_path" || exit 1

  "$_script_path"/cache-dependency-tree.sh
}

build_package_tree() {
  package_name=$(basename "$1")
  dependants=$(get_dependants "$package_name")
  build_package "$package_name" || return 1
  for p in ${dependants[*]}; do
    build_package_tree "$p" || return 1
  done
}

build_package() {
  [[ " ${built_packages[*]} " =~ [[:space:]]"$1"[[:space:]] ]] && return 0

  echo "Building package: $1"

  (cd "$_packages_path/$1" || exit 1
  npm run compile) || return 1

  built_packages+=("$1")
  date +%Y-%m-%dT%H:%M:%S > "$_latest_build_file"
}

get_updated_packages() {
  cd "$_packages_path" || exit 1
  find . -type f -newer "$_latest_build_file" \
    -not -name ".*" \
    -not -name "*.d.ts" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/migrations/*" \
    -print -quit \
  | sed -r "s/^.\///" | cut -f1 -d/
  cd - >/dev/null || exit 1
}

get_dependants() {
  cat "$_dependency_list_file" | grep "$1:" | cut -f2- -d: | xargs
}

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$_script_path/.."
_packages_path="$_root_path/packages"
_latest_build_file="$_packages_path/.latest_build"
_dependency_list_file="$_packages_path/.dependency_list"

main
