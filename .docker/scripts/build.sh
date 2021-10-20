#!/bin/bash

main() {
  (( ! NO_BASE )) && docker_build "$_dockerfiles_path/base"

  build_packages "$*"
}

build_packages() {
  local app should_build

  for app_path in "$_dockerfiles_path"/*; do
    app="$(basename "$app_path")"
    if [ -d "$_root_path/packages/$app" ]; then
      [ -n "$1" ] && {
        should_build=$(echo " $1 " | grep -c " $app ")
        (( ! should_build )) && {
          echo "* Skipping $app image"
          continue
        }
      }
      echo "* Building $app"
      docker_build "$app_path"
    fi
    if (( BUILD_NODEMON )) && [ "$app" = "nodemon" ]; then
      docker_build "$app_path"
    fi
  done
}

docker_build() {
  local image_name

  image_name="$(basename "$1")"

  [ ! -f "$1" ] && error "Could not find $image_name Dockerfile"

  COMMIT_SHA="$(git rev-parse HEAD)"

  docker build \
    $( (( NO_CACHE )) && echo "--no-cache" ) \
    -f "$1" \
    -t "etimo-achievements/$image_name" \
    -t "ghcr.io/etimo/etimo-achievements/$image_name" \
    --build-arg "COMMIT_SHA=$COMMIT_SHA" \
    "$_root_path" \
  || error "Could not build $image_name image"
}

error() {
  echo "Error: $1"
  exit 1
}

# Default arguments
NO_BASE=0 # --no-base
NO_CACHE=0 # --no-cache
BUILD_NODEMON=0 # --build-nodemon

# Parse arguments
positional=()
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
      -h|--help)
      echo "Builds Dockerfiles for the project"
      echo
      echo "Usage: $(basename "$0") [-h|--help] [--no-base] [--no-cache]"
      exit 0
      shift
      ;;
      --no-base)
      echo "* Skipping base image"
      NO_BASE=1
      shift
      ;;
      --nodemon)
      echo "* Building nodemon image"
      BUILD_NODEMON=1
      shift
      ;;
      --no-cache)
      echo "* Disabling cache"
      NO_CACHE=1
      shift
      ;;
      *)
      positional+=("$1")
      shift
      ;;
  esac
done

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$(readlink -f "$_script_path/../..")"
_dockerfiles_path="$(readlink -f "$_root_path/.docker/Dockerfiles")"

time main ${positional[*]}
