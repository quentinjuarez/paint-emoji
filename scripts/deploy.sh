#!/bin/bash

# Run yarn version-patch and update package.json
yarn version-patch && git add package.json

# Build the project
yarn build

# Check if the build was successful
if [ $? -eq 0 ]; then
  # Build successful, add docs/ and commit changes
  git add docs/ && \
  git commit -m "deploy: v$(node -p "require('./package.json').version")" && \
  git push
else
  # Build failed, discard changes on package.json
  git checkout -- package.json
  echo "Build failed. Changes on package.json discarded."
fi