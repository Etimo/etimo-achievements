#!/bin/bash

# Namespace for packages
_namespace="@etimo-achievements"

main() {
  update_package_tsconfigs
  update_base_tsconfig
  (cd "$_root_path" \
    && echo "Running prettier" \
    && yarn prettier &>/dev/null)
  exit 0
}

update_package_tsconfigs() {
  local dependencies expression newtsconfig tsconfig

  for file in $(find ./packages -name package.json -not -path "*/dist/*"); do
    echo "Updating package references for $(basename "$(dirname "$file")")"

    tsconfig="$(dirname "$file")/tsconfig.json"
    dependencies=()
    dependencies+=$(cat "$file" | jq .dependencies | jq -r 'keys[] as $k | "\($k)"' | grep "$_namespace" | sed -r "s+$_namespace+..+")
    dependencies+=$(cat "$file" | jq .devDependencies | jq -r 'keys[] as $k | "\($k)"' | grep "$_namespace" | sed -r "s+$_namespace+..+")
    expression=""
    for path in $dependencies; do
      expression+="{\"path\":\"$path\"},"
    done
    expression=".references = [${expression%,}]"
    newtsconfig=$(jq "$expression" "$tsconfig")
    echo "$newtsconfig" > "$tsconfig"
  done
}

update_base_tsconfig() {
  local expression newtsconfig tsconfig

  echo "Updating package paths for root"

  tsconfig="$_root_path/tsconfig.json"

  expression=""
  for package in $(find ./packages -mindepth 1 -maxdepth 1 -type d); do
    package_name="$(basename "$package")"
    expression+="\"$_namespace/$package_name/*\":[\"$package_name/src/*\"],"
  done
  expression=".paths = {${expression%,}}"
  newtsconfig=$(jq "$expression" "$tsconfig")
  echo "$newtsconfig" > "$tsconfig"
}

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$(readlink -f "$_script_path/..")"

main
