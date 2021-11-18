#!/bin/bash

for package_path in packages/*; do
  [ -d "$package_path" ] && {
    (cd "$package_path" || exit 1
    npm run "$*") || exit 1
  }
done
