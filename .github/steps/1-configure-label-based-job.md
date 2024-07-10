<!--
  <<< Author notes: Step 1 >>>
  Choose 3-5 steps for your course.
  The first step is always the hardest, so pick something easy!
  Link to docs.github.com for further explanations.
  Encourage users to open new tabs for steps!
-->

## Step 1: Trigger a job based on labels

_Welcome to the course :tada:_

![Screen Shot 2022-06-07 at 4 01 43 PM](https://user-images.githubusercontent.com/6351798/172490466-00f27580-8906-471f-ae83-ef3b6370df7d.png)

A lot of things go into delivering "continuously". These things can range from culture and behavior to specific automation. In this exercise, we're going to focus on the deployment part of our automation.

In a GitHub Actions workflow, the `on` step defines what causes the workflow to run. In this case, we want the workflow to run different tasks when specific labels are applied to a pull request.

We'll use labels as triggers for multiple tasks:

- When someone applies a "spin up environment" label to a pull request, that'll tell GitHub Actions that we'd like to set up our resources on an Azure environment.
- When someone applies a "stage" label to a pull request, that'll be our indicator that we'd like to deploy our application to a staging environment.
- When someone applies a "destroy environment" label to a pull request, we'll tear down any resources that are running on our Azure account.

### :keyboard: Activity 1: Configure `GITHUB_TOKEN` permissions

At the start of each workflow run, GitHub automatically creates a unique `GITHUB_TOKEN` secret to use in your workflow. We need to make sure this token has the permissions required for this course.

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
1. Go to Settings > Actions > General. Ensure that the `GITHUB_TOKEN` also has **Read and write permissions** enabled under **Workflow permissions**. This is required for your workflow to be able to upload your image to the container registry.

### :keyboard: Activity 2: Configure a trigger based on labels

For now, we'll focus on staging. We'll spin up and destroy our environment in a later step.

1. Go to the **Actions** tab.
1. Click **New workflow**
1. Search for "simple workflow" and click **Configure**
1. Name your workflow `deploy-staging.yml`
1. Edit the contents of this file and remove all triggers and jobs.
1. Edit the contents of the file to add a conditional that filters the `build` job when there is a label present called **stage**. Your resulting file should look like this:
   ```yaml
   name: Stage the app

   on:
     pull_request:
       types: [labeled]

   jobs:
     build:
       runs-on: ubuntu-latest

       if: contains(github.event.pull_request.labels.*.name, 'stage')
   ```
1. Click **Start commit**, and choose to make a new branch named `staging-workflow`.
1. Click **Propose changes**.
1. Click **Create pull request**.
1. Wait about 20 seconds then refresh this page (the one you're following instructions from). [GitHub Actions](https://docs.github.com/en/actions) will automatically update to the next step.
