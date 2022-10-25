#!/usr/bin/env bash
# Make sure this file is executable
# chmod a+x .github/script/create-workflow-pr.sh

git config user.name github-actions
git config user.email github-actions@github.com

workflow_filename=$(basename ${WORKFLOW_PATH})

echo "Make sure we are on the main branch"
git checkout main

echo "Create new branch or checkout if it exists"
git switch -C $BRANCH

echo "Copy example workflow into .github/workflows/"
cp $WORKFLOW_PATH .github/workflows/

echo "In workflow, replace <username> with GitHub repository owner"
sed -i -r "s/<username>/$REPO_OWNER/g" .github/workflows/$workflow_filename

echo "Commit the file, and push to new branch"
git config user.name github-actions
git config user.email github-actions@github.com
git add .github/workflows/$workflow_filename
git commit --message="Added $workflow_filename"
git push origin $BRANCH
