<img src="https://repository-images.githubusercontent.com/247808107/d6de8f80-684a-11ea-97d2-5705e8595f0d" width=300 align=right>

# GitHub Actions: Continuous Delivery with Azure

_Create two deployment workflows using GitHub Actions and Microsoft Azure._

<details id=0 open>
<summary><strong>:golf: Start</strong></summary>

**To start this course: [<img width="150" alt="Use this template" src="https://user-images.githubusercontent.com/1221423/148581131-555c0fb8-5361-4450-a760-75fa6219a2fc.png">](../../generate)**

> We recommend creating a public repository, as private repositories will [use Actions minutes](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions).<br>
> After you make your own repository, wait about 20 seconds and refresh. I will go to the next step.

- **Who is this for**: Developers, DevOps Engineers, new GitHub users, students, teams.
- **What you'll learn**: We'll learn how to create a workflow that enables Continuous Delivery using GitHub Actions and Microsoft Azure.
- **What you'll build**: We will create two deployment workflows - the first workflow to deploy to staging based on a label and the second workflow to deploy to production based on merging to main.
- **Prerequisites**: Before you start, you should be familiar with [GitHub](https://lab.github.com/githubtraining/introduction-to-github), [GitHub Actions](https://lab.github.com/github/hello-github-actions!), and [Continuous Integration with GitHub Actions](https://lab.github.com/githubtraining/github-actions:-continuous-integration).
- **How long**: This course is 11 steps long and takes less than 2 hours to complete.

</details>

<details id=1>
<summary><strong>:zap: Step 1: Configure a trigger based on labels</strong></summary>

### Welcome to "GitHub Actions: Continuous Delivery with Azure"! :wave:

**What is _Continuous Delivery_**: [Martin Fowler](https://martinfowler.com/bliki/ContinuousDelivery.html) defined Continuous Delivery very simply in a 2013 post as follows:

>Continuous Delivery is a software development discipline where you build software in >such a way that the software can be released to production at any time.

**Setting up environments and kicking off deployments**

A lot of things go into delivering "continuously". These things can range from culture and behavior to specific automation. In this course, we're going to focus on deployment automation.

In a GitHub Actions workflow, the `on` step defines what causes the workflow to run. In this case, we want the workflow to run whenever a label is applied to the pull request.

We'll use labels as triggers for multiple tasks:
- When someone applies a "spin up environment" label to a pull request, that'll tell GitHub Actions that we'd like to set up our resources on an Azure environment.
- When someone applies a "stage" label to a pull request, that'll be our indicator that we'd like to deploy our application to a staging environment.
- When someone applies a "destroy environment" label to a pull request, we'll tear down any resources that are running on our Azure account.

### :keyboard: Activity: Configure a trigger based on labels
For now, we'll focus on staging. We'll spin up and destroy our environment in a later step.

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
2. Go to the **Actions** tab.
3. Click **New workflow**
4. Search for "simple workflow" and click **Configure**
5. Name your workflow `deploy-staging.yml`
6. Edit the contents of this file and remove all triggers and jobs.
7. Edit the file to trigger a job called `build` on a labeled pull request. Your resulting file should look like this:

```yaml
name: Stage the app

on:
  pull_request:
    types: [labeled]

jobs:
  build:
    runs-on: ubuntu-latest
```
8. Click **Start commit**, and choose to make a new branch named `staging-workflow`.
9. Click **Propose a new file**.
10. Click **Create pull request**.
11. Wait about 20 seconds then refresh this page for the next step.

</details>

<details id=2>
<summary><strong>:dart: Step 2: Trigger a job on specific labels</strong></summary>

### You configured a trigger based on labels! :tada:

**What are Job Conditionals**:

GitHub Actions features powerful controls for when to execute jobs and the steps within them. One of these controls is `if`, which allows you run a job only when a specific condition is met. See [`jobs.<job_id>.if` in _Workflow syntax for GitHub Actions_](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idif) for more information.

### :keyboard: Activity: Trigger a job on specific labels

Let's updated our workflow to run our job only when a label of "stage" is applied to the pull request.

1. Edit the `deploy-staging.yml` file on this branch, or [use this quick link](/edit/staging-workflow/.github/workflows/deploy-staging.yml?) in a new tab to edit the file.

1. Edit the contents of the file to add a block for environment variables before your jobs, as follows.

  ```yaml
  env:
    ###############################################
    ### Replace <username> with GitHub username ###
    ###############################################
    DOCKER_IMAGE_NAME: <username>-azure-ttt
    IMAGE_REGISTRY_URL: ghcr.io
    AZURE_WEBAPP_NAME: <username>-ttt-app
    ###############################################
  ```
1. Edit the contents of the file to add a conditional that filters the `build` job using a label called "stage".

  Your results should look like this:

  ```yml
  name: Stage the app

  on:
    pull_request:
      types: [labeled]

  env:
    ###############################################
    ### Replace <username> with GitHub username ###
    ###############################################
    DOCKER_IMAGE_NAME: <username>-azure-ttt
    IMAGE_REGISTRY_URL: ghcr.io
    AZURE_WEBAPP_NAME: <username>-ttt-app
    ###############################################

  jobs:
    build:
      runs-on: ubuntu-latest

      if: contains(github.event.pull_request.labels.*.name, 'stage')
  ```
1. Click **Start commit** and commit to this branch
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Step 3 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-3-notes.
-->

<details id=3>
<summary><strong>:wrench: Step 3: Set up the environment for your app</strong></summary>

### Nice work triggering a job on specific labels :sparkles:

We won't be going into detail on the steps of this workflow, but it would be a good idea to become familiar with the actions we're using. They are:

- [`actions/checkout`](https://github.com/actions/checkout)
- [`actions/upload-artifact`](https://github.com/actions/upload-artifact)
- [`actions/download-artifact`](https://github.com/actions/download-artifact)
- [`docker/login-action`](https://github.com/docker/login-action)
- [`docker/build-push-action`](https://github.com/docker/build-push-action)
- [`azure/login`](https://github.com/Azure/login)
- [`azure/webapps-deploy`](https://github.com/Azure/webapps-deploy)

### :keyboard: Activity: TBD-step-3-name

1. In a new tab, [create an Azure account](https://azure.microsoft.com/en-us/free/) if you don't already have one. If your Azure account is created through work, you may encounter issues accessing the necessary resources -- we recommend creating a new account for personal use and for this course.
    > Note: You may need a credit card to create an Azure account. If you're a student, you may also be able to take advantage of the [Student Developer Pack](https://education.github.com/pack) for access to Azure. If you'd like to continue with the course without an Azure account, Learning Lab will still respond, but none of the deployments will work.
1. Create a [new subscription](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription) in the Azure Portal.
    > Note: your subscription must be configured "Pay as you go" which will require you to enter billing information. This course will only use a few minutes from your free plan, but Azure requires the billing information.
1. Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) on your machine.
1. In your terminal, run:
    ```shell
    az login
    ```
1. Copy the value of the `id:` field to a safe place. We'll call this `AZURE_SUBSCRIPTION_ID`. Here's an example of what it looks like:
    ```shell
    [
    {
      "cloudName": "AzureCloud",
      "id": "f****a09-****-4d1c-98**-f**********c", # <-- Copy this id field
      "isDefault": true,
      "name": "some-subscription-name",
      "state": "Enabled",
      "tenantId": "********-a**c-44**-**25-62*******61",
      "user": {
        "name": "mdavis******@*********.com",
        "type": "user"
        }
      }
    ]
    ```
1. In your terminal, run the command below. **Note: The `\` character works as a line break on Unix based systems.  If you are on a Windows based system the `\` character will cause this command to fail.  Place this command on a single line if you are using Windows.**
    ```shell
    az ad sp create-for-rbac --name "GitHub-Actions" --role contributor \
                              --scopes /subscriptions/{subscription-id} \
                              --sdk-auth

    # Replace {subscription-id} with the same id stored in AZURE_SUBSCRIPTION_ID.
    ```   
1. Copy the entire contents of the command's response, we'll call this `AZURE_CREDENTIALS`. Here's an example of what it looks like:
    ```shell
    {
      "clientId": "<GUID>",
      "clientSecret": "<GUID>",
      "subscriptionId": "<GUID>",
      "tenantId": "<GUID>",
      (...)
    }
    ```
1. Back on GitHub, click on this repository's **Secrets** in the Settings tab.
1. Click **New secret**
1. Name your new secret **AZURE_SUBSCRIPTION_ID** and paste the value from the `id:` field in the first command.
1. Click **Add secret**.
1. Click **New secret** again.
1. Name the second secret **AZURE_CREDENTIALS** and paste the entire contents from the second terminal command you entered.
1. Click **Add secret**
1. Back in this pull request, edit the `.github/workflows/deploy-staging.yml` file to use some new actions.

  If you'd like to copy the full workflow file, it should look like this:

  ```yaml
  name: Stage the app

  on:
    pull_request:
      types: [labeled]

  env:
    ###############################################
    ### Replace <username> with GitHub username ###
    ###############################################
    DOCKER_IMAGE_NAME: <username>-azure-ttt
    IMAGE_REGISTRY_URL: ghcr.io
    AZURE_WEBAPP_NAME: <username>-ttt-app
    ###############################################

  jobs:
    build:
      if: contains(github.event.pull_request.labels.*.name, 'stage')

      runs-on: ubuntu-latest

      steps:
        - uses: actions/checkout@v1
        - name: npm install and build webpack
          run: |
            npm install
            npm run build
        - uses: actions/upload-artifact@main
          with:
            name: webpack artifacts
            path: public/

    Build-Docker-Image:
      runs-on: ubuntu-latest
      needs: build
      name: Build image and store in GitHub Container Registry

      steps:
        - name: Checkout
          uses: actions/checkout@v1

        - name: Download built artifact
          uses: actions/download-artifact@main
          with:
            name: webpack artifacts
            path: public

        - name: Log in to GHCR
          uses: docker/login-action@v1.14.1
          with:
            registry: ${{ env.IMAGE_REGISTRY_URL }}
            username: ${{ github.actor }}
            password: ${{ secrets.GITHUB_TOKEN }}

        - name: Extract metadata (tags, labels) for Docker
          id: meta
          uses: docker/metadata-action@v3.7.0
          with:
            images: ${{env.IMAGE_REGISTRY_URL}}/${{ github.repository }}/${{env.DOCKER_IMAGE_NAME}}
            tags: |
              type=sha,format=long,prefix=

        - name: Build and push Docker image
          uses: docker/build-push-action@v2.10.0
          with:
            context: .
            push: true
            tags: ${{ steps.meta.outputs.tags }}
            labels: ${{ steps.meta.outputs.labels }}

    Deploy-to-Azure:
      runs-on: ubuntu-latest
      needs: Build-Docker-Image
      name: Deploy app container to Azure
      steps:
        - name: "Login via Azure CLI"
          uses: azure/login@v1
          with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}

        - uses: azure/docker-login@v1
          with:
            login-server: ${{env.IMAGE_REGISTRY_URL}}
            username: ${{ github.actor }}
            password: ${{ secrets.GITHUB_TOKEN }}

        - name: Deploy web app container
          uses: azure/webapps-deploy@v2
          with:
            app-name: ${{env.AZURE_WEBAPP_NAME}}
            images: ${{env.IMAGE_REGISTRY_URL}}/${{ github.repository }}/${{env.DOCKER_IMAGE_NAME}}:${{github.sha}}

        - name: Azure logout
          run: |
            az logout
  ```

1. Click **Start commit** and commit to this branch
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Step 4 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-4-notes.
-->

<details id=4>
<summary><strong>:arrow_lower_right: Step 4: Merge the staging workflow</strong></summary>

### Nicely done TBD-step-3-name! :partying_face:

TBD-step-4-information

**What is _TBD-term-4_**: TBD-definition-4

### :keyboard: Activity: TBD-step-4-name

1. TBD-step-4-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>


<!--
  <<< Author notes: Step 5 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-5-notes.
-->

<details id=5>
<summary><strong>:cyclone: Step 5: Spin up, configure, and destroy Azure resources</strong></summary>

### Nicely done! :partying_face:

TBD-step-5-information

**What is _TBD-term-5_**: TBD-definition-5

### :keyboard: Activity: TBD-step-5-name

1. TBD-step-5-instructions.
1. Wait about 20 seconds then refresh this page for the next step.

</details>
...
<!--
  <<< Author notes: Step 10 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
  TBD-step-5-notes.
-->
<details id=10>
<summary><strong>:shipit: Step 10: Merge the production workflow</strong></summary>

### Almost there TBD-step-9-name! :heart:

You can now [merge](https://docs.github.com/en/get-started/quickstart/github-glossary#merge) your pull request!

### :keyboard: Activity: Merge your pull request

1. Click **Merge pull request**.
1. Delete the branch `TBD-branch-name` (optional).
1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Finish >>>
  Review what we learned, ask for feedback, provide next steps.
-->

<details id=X>
<summary><strong>:checkered_flag: Finish</strong></summary>

### Congratulations friend, you've completed this course!

<img src=TBD-celebrate-image alt=celebrate width=300 align=right>

Here's a recap of all the tasks you've accomplished in your repository:

- TBD-recap.

### What's next?

- TBD-continue.
- [We'd love to hear what you thought of this course](TBD-feedback-link).
- [Take another TBD-organization Course](https://github.com/TBD-organization).
- [Read the GitHub Getting Started docs](https://docs.github.com/en/get-started).
- To find projects to contribute to, check out [GitHub Explore](https://github.com/explore).

</details>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: [TBD-support](TBD-support-link) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2022 TBD-copyright-holder &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [CC-BY-4.0 License](https://creativecommons.org/licenses/by/4.0/legalcode)
