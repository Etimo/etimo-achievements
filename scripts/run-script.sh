#!/bin/bash

for p in packages/*; do
  (cd "$p" || exit 1
  npm run "$*") || exit 1
done
