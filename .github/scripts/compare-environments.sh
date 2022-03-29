#!/bin/bash

# By default, we assume that the environments differ
echo "::set-output name=differs::true"

staging_url="${1:-https://achievements-test.staging.etimo-test.live}/version"
production_url="${2-https://achievements-live.staging.etimo-test.live}/version"

echo "Fetching staging version information from $staging_url"
staging_contents="$(curl --fail -s "$staging_url")"

# If the response is not a valid JSON, we can't know for
# certain that the environments do not differ, so we exit.
[[ "$staging_contents" =~ ^\{.*\}$ ]] || exit 0

staging_commit="$(echo "$staging_contents" | jq -r '.commit')"

# If the "commit" property is not a valid commit, we can't
# know for certain that the environments do not differ.
[[ "$staging_commit" =~ ^[0-9a-f]{40}$ ]] || exit 0

echo "Staging environment has commit: $staging_commit"
echo "::set-output name=sha::$staging_commit"

echo "Fetching production version information from $production_url"
production_contents="$(curl --fail -s "$production_url")"
production_commit="$(echo "$production_contents" | jq -r '.commit')"

# If the "commit" property is not a valid commit, we can't
# know for certain that the environments do not differ.
[[ "$production_commit" =~ ^[0-9a-f]{40}$ ]] || exit 0

echo "Production environment has commit: $production_commit"

[ "$staging_commit" == "$production_commit" ] && {
  echo "Production environment is the same as staging."
  echo "::set-output name=differs::false"
}

exit 0
