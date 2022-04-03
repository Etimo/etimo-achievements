#!/bin/bash

# The only parameter should be the commit sha
# that we want to tag with the next release tag.
tag_commit="$1"
echo "Proposed commit: $1"

# The checkout action won't fetch all tags, so let us.
git fetch --all --tags &>/dev/null || exit 1
echo "Fetched tags"

# Get the latest version tag and strip the leading "v"
latest_version=$(git tag | grep -E "^v[[:digit:]]+$" | sort -V | tail -n 1 | cut -c 2-)
echo "Latest version: $latest_version"

# Get the commit of the latest version tag
latest_version_commit=$(git rev-list -n 1 "v$latest_version")
echo "Latest version commit: $latest_version_commit"

# Increment the latest version to get the next version
next_version=v$((++ latest_version))
echo "Next version: $next_version"

# If the tag commit differs from the latest tagged version
# commit, it's OK to tag the tag commit with the next version.
if [ "$tag_commit" != "$latest_version_commit" ]; then

  git tag $next_version "$tag_commit" &>/dev/null || exit 1
  git push origin $next_version &>/dev/null || exit 1
  echo "Successfully pushed $next_version tag (-> $tag_commit)"

  echo "::set-output name=tagged::true"
  echo "::set-output name=tag::$next_version"
fi

exit 0
