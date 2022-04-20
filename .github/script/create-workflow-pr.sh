#!/usr/bin/env bash
# Make sure this file is executable
# chmod a+x .github/script/create-workflow-pr.sh

echo "Make sure we are on the main branch"
git checkout main

echo "Create new branch or checkout if it exists"
git switch -C $PR_BRANCH

echo "Copy example workflow into .github/workflows/"
cp .github/example-workflows/$WORKFLOW_FILE .github/workflows/

echo "In workflow, replace <username> with GitHub repository owner"
sed -r "s/<username>/$REPO_OWNER/g" .github/workflows/$WORKFLOW_FILE > tmp
mv tmp .github/workflows/$WORKFLOW_FILE

echo "Commit the file, and push to new branch"
git config user.name github-actions
git config user.email github-actions@github.com
git add .github/workflows/$WORKFLOW_FILE
git commit --message="Added $WORKFLOW_FILE"
git push origin $PR_BRANCH

echo "Create pull request"
gh pr create --base main --fill
