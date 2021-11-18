#!/bin/bash

SCRIPTDIR="$(dirname "$(readlink -f "$0")")"
ROOTDIR="$(readlink -f "$SCRIPTDIR/..")"

last_updated_file=$ROOTDIR/node_modules/.last_updated
node_modules_date=0
[ -f "$last_updated_file" ] && node_modules_date=$(date -r "$last_updated_file" +%s)

newest_package_date=0
for file in $(find "$ROOTDIR" -name "package.json" -not -path "*/node_modules/*"); do
  package_date=$(date -r "$file" +%s)
  [ "$package_date" -gt "$node_modules_date" ] && newest_package_date=$package_date
done

if [ "$newest_package_date" -gt "$node_modules_date" ]; then
  echo "Node modules are outdated ($node_modules_date). Running yarn."
  (cd "$ROOTDIR" && yarn install && echo -n > "$last_updated_file")
else
  echo "Node modules are up-to-date."
fi
