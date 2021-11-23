#!/bin/sh

./scripts/update-references.sh
./scripts/cache-dependency-tree.sh
nodemon
