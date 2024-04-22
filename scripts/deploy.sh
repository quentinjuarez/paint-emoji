#!/bin/bash

version_script="version-patch"

if [[ $1 == minor ]] ; then
  version_script="version-minor"
elif [[ $1 == major ]] ; then
  version_script="version-major"
fi

# Run yarn version-patch and update package.json
yarn $version_script

# Build the project
yarn build

sh scripts/404.sh

# Check if the build was successful
if [ $? -eq 0 ]; then
  # Build successful, add docs/ and commit changes
  git add docs/ && \
  git add package.json && \
  git commit -m "deploy: v$(node -p "require('./package.json').version")" && \
  git push
else
  # Build failed, discard changes on package.json
  git checkout -- package.json
  echo "Build failed. Changes on package.json discarded."
fi