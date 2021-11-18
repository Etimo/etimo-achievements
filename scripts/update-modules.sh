#!/bin/bash

SCRIPTDIR="$(dirname "$(readlink -f "$0")")"
ROOTDIR="$(readlink -f "$SCRIPTDIR/..")"

modules_hash_file=$ROOTDIR/node_modules/.modules_hash

[ "$1" = "--force" ] && rm -f "$modules_hash_file"

modules_hash=$(cat "$modules_hash_file" 2>/dev/null)

{
  find "$ROOTDIR" -name "package.json" -not -path "*/node_modules/*" -exec jq "{dependencies,devDependencies}" {} \;
} | sort | sha1sum | awk '{print $1}' > "$modules_hash_file"

new_modules_hash=$(cat "$modules_hash_file")
if [ "$modules_hash" != "$new_modules_hash" ]; then
  echo "Dependencies have changed. Running yarn install."
  yarn install
else
  echo "Dependencies have not changed."
fi
