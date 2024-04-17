#!/bin/bash

yarn version-patch && \
git add package.json && \
yarn build && \
git add docs/ && \
git commit -m "deploy: v$(node -p "require('./package.json').version")" && \
git push
