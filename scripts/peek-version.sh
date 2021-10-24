#!/bin/bash

get_info() {
  local contents commit_sha compile_date

  contents="$(curl --fail -s "$1")"
  if [[ "$contents" =~ ^\{.*\}$ ]]; then
    commit_sha="$(echo "$contents" | jq -r '.commit' | cut -c1-7)"
    compile_date="$(echo "$contents" | jq -r '.date')"
    echo "${commit_sha} deployed at $compile_date"
    return 0
  else
    echo "offline"
    return 1
  fi
}

get_api_info() {
  case $1 in
    local)
      get_info http://localhost:3000/version && return 0
    shift
    ;;
    stage|staging)
      get_info https://etimo-achievements-staging.herokuapp.com/version && return 0
    shift
    ;;
    prod|production)
      get_info https://etimo-achievements.herokuapp.com/version && return 0
    shift
    ;;
  esac

  return 1
}

main() {
  echo "api-$1: $(get_api_info "$1")"
}

main "${1:-local}"
