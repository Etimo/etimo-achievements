#!/bin/bash

built_packages=()

main() {
  [ ! -f "$_latest_build_file" ] && echo "1970-01-01T00:00:00" > "$_latest_build_file"

  for package in $(get_updated_packages "$(cat "$_latest_build_file")"); do
    build_packages=$(get_build_candidates "$package")
    echo "Building $package: $build_packages"
    for p in ${build_packages[*]}; do
      build_package "$p"
    done
  done

  date +%Y-%m-%dT%H:%M:%S > "$_latest_build_file"
}

build_package() {
  [[ " ${built_packages[*]} " =~ [[:space:]]"$1"[[:space:]] ]] && return 0

  echo "Building $1"
  (cd "$_packages_path/$1" || exit 1
  npm run compile) || exit 1

  built_packages+=("$1")
}

get_updated_packages() {
  (cd "$_packages_path" || exit 1
  find "." -type f -newermt "$1" \
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

get_build_candidates() {
  cat "$_package_list_file" | tr ' ' '\n' | grep -A100 ^"$1"$ | xargs
}

# Setup paths
_script_path="$(dirname "$(readlink -f "$0")")"
_root_path="$(readlink -f "$_script_path/..")"
_packages_path="$_root_path/packages"
_latest_build_file="$_packages_path/.latest_build"
_package_list_file="$_packages_path/.package_list"

main
