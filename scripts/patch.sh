#!/bin/bash

# Path to package.json file
package="package.json"

# Get current version
version=$(jq -r '.version' "$package")

# Split version into major, minor, and patch parts
IFS='.' read -r -a parts <<< "$version"
major="${parts[0]}"
minor="${parts[1]}"
patch="${parts[2]}"

# Increment patch version
patch=$((patch + 1))

# Combine parts into new version
new_version="$major.$minor.$patch"

# Update version in package.json using jq
jq --arg new_version "$new_version" '.version = $new_version' "$package" > tmp.$$.json && mv tmp.$$.json "$package"

# Print new version
echo "$new_version"