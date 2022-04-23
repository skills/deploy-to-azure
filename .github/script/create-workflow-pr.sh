#!/usr/bin/env bash
# Make sure this file is executable
# chmod a+x .github/script/create-workflow-pr.sh

echo "Make sure we are on the main branch"
git checkout main

echo "Checkout pull request branch $PR_BRANCH"
git switch $PR_BRANCH

echo "Create pull request"
gh pr create --base main --fill
