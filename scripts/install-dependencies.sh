#!/bin/bash

wanted_dependencies=("jest" "knex" "rimraf" "ts-node" "typescript:tsc")
missing_dependencies=()

for dependency in "${wanted_dependencies[@]}"; do
  dep_name=$(echo "$dependency" | cut -d':' -f1)
  dep_command=$(echo "$dependency" | cut -d':' -f2)
  if ! command -v "$dep_command" > /dev/null; then
    missing_dependencies+=("$dep_name")
  fi
done

if [ ${#missing_dependencies[@]} -eq 0 ]; then
  echo "No global dependencies missing"
  exit 0
fi

echo "Installing missing global dependencies: ${missing_dependencies[*]}"
sudo npm install -g "${missing_dependencies[@]}"
