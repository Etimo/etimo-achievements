#!/bin/bash

main() {
  local seconds_waited api_deployed

  seconds_waited=0
  success=0
  echo "Waiting for release (env: $1, sha: $2)..."
  while (( !success )); do
    (( !api_deployed )) && verify_commit api "$(get_api_url "$1")" "$2" && api_deployed=1

    if (( api_deployed )); then
      success=1
    else
      if [ "$seconds_waited" -lt "${WAIT_FOR_SECONDS:-450}" ]; then
        sleep 5
        seconds_waited=$((seconds_waited+5))
      else
        echo "Deployment failed."
        exit 1
      fi
    fi
  done

  echo "Deployment successful!"
}

verify_commit() {
  local app_name version_url app_commit

  app_name="$1"
  version_url="$2"

  printf "Fetching %s version... " "$app_name"
  app_commit="$(get_commit "$version_url")"
  [ -n "$app_commit" ] && {
    printf "%s" "$app_commit"
    if [ "$app_commit" = "$3" ]; then
      echo " [OK]"
      return 0
    else
      echo
    fi
    return 1
  }
}

get_commit() {
  local contents

  contents="$(curl --fail -s "$1")"

  [ -n "$contents" ] && {
    echo "$contents" | jq -r '.commit'
    return 0
  }

  return 1
}

get_api_url() {
  case $1 in
    stage|staging)
      echo https://etimo-achievements-staging.herokuapp.com/version
    ;;
    prod|production)
      echo https://etimo-achievements.herokuapp.com/version
    ;;
  esac
}

main "${1:-staging}" "${2:-$(git rev-parse HEAD)}"
