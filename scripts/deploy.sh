#!/bin/bash

version_script="version-patch"

if [[ $1 == minor ]] ; then
  version_script="version-minor"
elif [[ $1 == major ]] ; then
  version_script="version-major"
fi

# Run yarn version-patch and update package.json
yarn $version_script

git add package.json && \
git commit -m "deploy: v$(node -p "require('./package.json').version")" && \
git push