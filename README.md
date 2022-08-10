<!--
  <<< Author notes: Header of the course >>>
  Include a 1280x640 image, course title in sentence case, and a concise description in emphasis.
  In your repository settings: enable template repository, add your 1280x640 social image, auto delete head branches.
  Add your open source license, GitHub uses Creative Commons Attribution 4.0 International.
-->

# GitHub Actions: Continuous Delivery with Azure

<!--
  <<< Author notes: Start of the course >>>
  Include start button, a note about Actions minutes,
  and tell the learner why they should take the course.
  Each step should be wrapped in <details>/<summary>, with an `id` set.
  The start <details> should have `open` as well.
  Do not use quotes on the <details> tag attributes.
-->

<!--step0-->

Create two deployment workflows using GitHub Actions and Microsoft Azure.

- **Who is this for**: Developers, DevOps Engineers, new GitHub users, students, and teams.
- **What you'll learn**: We'll learn how to create a workflow that enables Continuous Delivery using GitHub Actions and Microsoft Azure.
- **What you'll build**: We will create two deployment workflows - the first workflow to deploy to staging based on a label and the second workflow to deploy to production based on merging to main.
- **Prerequisites**: Before you start, you should be familiar with GitHub, GitHub Actions, and Continuous Integration with GitHub Actions. 
- **How long**: This course is 6 steps long and takes less than 2 hours to complete.

## How to start this course

1. Above these instructions, right-click **Use this template** and open the link in a new tab.
   ![Use this template](https://user-images.githubusercontent.com/1221423/169618716-fb17528d-f332-4fc5-a11a-eaa23562665e.png)
2. In the new tab, follow the prompts to create a new repository.
   - For owner, choose your personal account or an organization to host the repository. 
   - We recommend creating a public repository—private repositories will [use Actions minutes](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions).
   ![Create a new repository](https://user-images.githubusercontent.com/1221423/169618722-406dc508-add4-4074-83f0-c7a7ad87f6f3.png)
3. After your new repository is created, wait about 20 seconds, then refresh the page. Follow the step-by-step instructions in the new repository's README.

<!--endstep0-->

<details id=1>
<summary><h2>Step 1: Trigger a job based on labels</h2></summary>

![Screen Shot 2022-06-07 at 4 01 43 PM](https://user-images.githubusercontent.com/6351798/172490466-00f27580-8906-471f-ae83-ef3b6370df7d.png)

A lot of things go into delivering "continuously". These things can range from culture and behavior to specific automation. In this exercise, we're going to focus on the  deployment part of our automation.

In a GitHub Actions workflow, the `on` step defines what causes the workflow to run. In this case, we want the workflow to run different tasks when specific labels are applied to a pull request.

We'll use labels as triggers for multiple tasks:
- When someone applies a "spin up environment" label to a pull request, that'll tell GitHub Actions that we'd like to set up our resources on an Azure environment.
- When someone applies a "stage" label to a pull request, that'll be our indicator that we'd like to deploy our application to a staging environment.
- When someone applies a "destroy environment" label to a pull request, we'll tear down any resources that are running on our Azure account.

### Activity 1: Configure `GITHUB_TOKEN` permissions
At the start of each workflow run, GitHub automatically creates a unique `GITHUB_TOKEN` secret to use in your workflow. We need to make sure this token has the permissions required for this course.

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
1. Ensure that the `GITHUB_TOKEN` for this repository has **Allow GitHub Actions to create and approve pull requests** enabled under **Workflow permissions**. [Learn how](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#modifying-the-permissions-for-the-github_token). This will allow GitHub Actions to merge pull requests as you move through the steps in this course.
1. Ensure that the `GITHUB_TOKEN` also has **Read and write permissions** enabled under **Workflow permissions**. This is required for your workflow to be able to upload your image to the container registry. 


### Activity 2: Configure a trigger based on labels
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
7. Click **Start commit**, and choose to make a new branch named `staging-workflow`.
8. Click **Propose a new file**.
9. Click **Create pull request**.

> **Note**: Wait about 20 seconds then refresh this page for GitHub Actions to run before continuing to the next step.

</details>


<details id=2>
<summary><h2>Step 2: Set up an Azure environment</h2></summary>

### Nice work triggering a job on specific labels 

We won't be going into detail on the steps of this workflow, but it would be a good idea to become familiar with the actions we're using. They are:

- [`actions/checkout`](https://github.com/actions/checkout)
- [`actions/upload-artifact`](https://github.com/actions/upload-artifact)
- [`actions/download-artifact`](https://github.com/actions/download-artifact)
- [`docker/login-action`](https://github.com/docker/login-action)
- [`docker/build-push-action`](https://github.com/docker/build-push-action)
- [`azure/login`](https://github.com/Azure/login)
- [`azure/webapps-deploy`](https://github.com/Azure/webapps-deploy)

### Activity 1: Store your credentials in GitHub secrets and finish setting up your workflow

1. In a new tab, [create an Azure account](https://azure.microsoft.com/en-us/free/) if you don't already have one. If your Azure account is created through work, you may encounter issues accessing the necessary resources -- we recommend creating a new account for personal use and for this course.
    > **Note**: You may need a credit card to create an Azure account. If you're a student, you may also be able to take advantage of the [Student Developer Pack](https://education.github.com/pack) for access to Azure. If you'd like to continue with the course without an Azure account, Skills will still respond, but none of the deployments will work.
1. Create a [new subscription](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription) in the Azure Portal.
    > **Note**: your subscription must be configured "Pay as you go" which will require you to enter billing information. This course will only use a few minutes from your free plan, but Azure requires the billing information.
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
1. In your terminal, run the command below. 
    ```shell
    az ad sp create-for-rbac --name "GitHub-Actions" --role contributor \
                              --scopes /subscriptions/{subscription-id} \
                              --sdk-auth

    # Replace {subscription-id} with the same id stored in AZURE_SUBSCRIPTION_ID.
    ``` 
> **Note**: The `\` character works as a line break on Unix based systems.  If you are on a Windows based system the `\` character will cause this command to fail.  Place this command on a single line if you are using Windows.**                                                    
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
1. Back in your pull request, edit the `.github/workflows/deploy-staging.yml` file to use some new actions.

  <details>
  <summary> If you'd like to copy the full workflow file, it should look like this: </summary>
  
  ```yaml
  name: Deploy to staging

  on:
    pull_request:
      types: [labeled]

  env:
    IMAGE_REGISTRY_URL: ghcr.io
    ###############################################
    ### Replace <username> with GitHub username ###
    ###############################################
    DOCKER_IMAGE_NAME: <username>-azure-ttt
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
            images: ${{env.IMAGE_REGISTRY_URL}}/${{ github.repository }}/${{env.DOCKER_IMAGE_NAME}}:${{ github.sha }}

        - name: Azure logout
          run: |
            az logout
  ```
  </details>
  
16. Click **Start commit** and commit to the `staging-workflow` branch.

> **Note**: Wait about 20 seconds then refresh this page for GitHub Actions to run before continuing to the next step.

</details>


<details id=3>
<summary><h2>Step 3: Spin up an environment based on labels</h2></summary>

### Nicely done! 

GitHub Actions is cloud agnostic, so any cloud will work. We'll show how to deploy to Azure in this course.

**What are _Azure resources_?** In Azure, a resource is an entity managed by Azure. We'll use the following Azure resources in this course:
- A [web app](https://docs.microsoft.com/en-us/azure/app-service/overview) is how we'll be deploying our application to Azure.
- A [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview#resource-groups) is a collection of resources, like web apps and virtual machines (VMs).
- An [App Service plan](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans) is what runs our web app and manages the billing (our app should run for free).

Through the power of GitHub Actions, we can create, configure, and destroy these resources through our workflow files.

### Activity 1: Set up a personal access token (PAT)
Personal access tokens (PATs) are an alternative to using passwords for authentication to GitHub. We will use a PAT to allow your web app to pull the container image after your workflow pushes a newly built image to the registry.

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
2. Create a personal access token with the `repo` and `read:packages` scopes. For more information, see ["Creating a personal access token."](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
3. Once you have generated the token we will need to store it in a secret so that it can be used within a workflow. Create a new repository secret named `CR_PAT` and paste the PAT token in as the value.
4. With this done we can move on to setting up our workflow.


**Configuring your Azure environment**

To deploy successfully to our Azure environment, we have created a new workflow file `spinup-destroy.yml` in the `azure-configuration` branch. Review this file in a new browser tab by clicking **Pull request** and viewing the open pull request.

We will cover the key functionality below and then put the workflow to use by applying a label to the pull request.

This new workflow has two jobs:
1. **Set up Azure resources** will run if the pull request contains a label with the name "spin up environment".
2. **Destroy Azure resources** will run if the pull request contains a label with the name "destroy environment".

In addition to each job, there's a few global environment variables:
- `AZURE_RESOURCE_GROUP`, `AZURE_APP_PLAN`, and `AZURE_WEBAPP_NAME` are names for our resource group, app service plan, and web app, respectively, which we'll reference over multiple steps and workflows
- `AZURE_LOCATION` lets us specify the [region](https://azure.microsoft.com/en-us/global-infrastructure/regions/) for the data centers, where our app will ultimately be deployed.

**Setting up Azure resources**

The first job sets up the Azure resources as follows:
1. Logs into your Azure account with the [`azure/login`](https://github.com/Azure/login) action. The `AZURE_CREDENTIALS` secret you created earlier is used for authentication.
1. Creates an [Azure resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview#resource-groups) by running [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-create) on the Azure CLI, which is [pre-installed on the GitHub-hosted runner](https://help.github.com/en/actions/reference/software-installed-on-github-hosted-runners).
1. Creates an [App Service plan](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans) by running  [`az appservice plan create`](https://docs.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) on the Azure CLI.
1. Creates a [web app](https://docs.microsoft.com/en-us/azure/app-service/overview) by running [`az webapp create`](https://docs.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) on the Azure CLI.
1. Configures the newly created web app to use [GitHub Packages](https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages) by using [`az webapp config`](https://docs.microsoft.com/en-us/cli/azure/webapp/config?view=azure-cli-latest) on the Azure CLI. Azure can be configured to use its own [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/), [DockerHub](https://docs.docker.com/docker-hub/), or a custom (private) registry. In this case, we'll configure GitHub Packages as a custom registry.

**Destroying Azure resources**

The second job destroys Azure resources so that you do not use your free minutes or incur billing. The job works as follows:
1. Logs into your Azure account with the [`azure/login`](https://github.com/Azure/login) action. The `AZURE_CREDENTIALS` secret you created earlier is used for authentication.
1. Deletes the resource group we created earlier using [`az group delete`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-delete) on the Azure CLI.

### Activity 2: Apply labels to create resources

1. Edit the `spinup-destroy.yml` file in your open pull request and replace any `<username>` placeholders with your GitHub username. Commit this change directly to the `azure-configuration` branch.
1. Apply the **spin up environment** label to your open pull request
1. Wait for the GitHub Actions workflow to run and spin up your Azure environment. You can follow along in the Actions tab or in the pull request merge box.
1. Once the workflow succeeds, refresh this page for the next step.

</details>

<details id=4>
<summary><h2>Step 4: Deploy to a staging environment based on labels</h2></summary>

### Nicely done, you used a workflow to spin up your Azure environment  

Now that the proper configuration and workflow files are present, let's test our actions! In this step, there's a small change to the game. Once you add the appropriate label to your pull request, you should be able to see the deployment!

We have created a new pull request from the `staging-test` branch. The only purpose of this pull request is to be able to apply a label and see your application deployed to Azure.

### Activity 1: Add the proper label to your pull request

1. Ensure that the `GITHUB_TOKEN` for this repository has read and write permissions under **Workflow permissions**. [Learn more](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#modifying-the-permissions-for-the-github_token). This is required for your workflow to be able to upload your image to the container registry.
1. Apply the **stage** label to your open pull request
1. Wait for the GitHub Actions workflow to run and deploy the application to your Azure environment. You can follow along in the Actions tab or in the pull request merge box.

  The deployment may take a few moments but you've done the right thing. Once the deployment is successful, you'll see green check marks for each run, and you'll see a URL for your deployment.
1. Once the workflow has completed, refresh this page for the next step.

</details>

<details id=5>
<summary><h2>Step 5: Deploy to a production environment based on labels</h2></summary>

### Nicely done

We have created a workflow file `deploy-prod.yml` in the `production-deployment-workflow` branch. Review this file in a new browser tab by clicking **Pull request** and viewing the open pull request. This new workflow deals specifically with commits to main and handles deployments to prod.

**Continuous delivery** (CD) is a concept that contains many behaviors and other, more specific concepts. One of those concepts is **test in production**. That can mean different things to different projects and different companies, and isn't a strict rule that says you are or aren't "doing CD".

In our case, we can match our production environment to be exactly like our staging environment. This minimizes opportunities for surprises once we deploy to production.

### Activity 1: Add triggers to production deployment workflow

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
1. Open your `deploy-prod.yml` workflow for edit.
1. Replace any `<username>` placeholders with your GitHub username
1. Add a `push` trigger
1. Add branches inside the push block
1. Add `- main` inside the branches block

  It should look like the file below when you are finished. Note that not much has changed from our staging workflow, except for our trigger, and that we won't be filtering by labels.

  ```yaml
  name: Production deployment

  on:
    push:
      branches:
        - main

  env:
    IMAGE_REGISTRY_URL: ghcr.io
    ###############################################
    ### Replace <username> with GitHub username ###
    ###############################################
    DOCKER_IMAGE_NAME: <username>-azure-ttt
    AZURE_WEBAPP_NAME: <username>-ttt-app
    ###############################################

  jobs:
    build:
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

1. Commit your changes to the `production-deployment-workflow` branch.

Great! The syntax you used tells GitHub Actions to only run that workflow when a commit is made to the main branch. Now we can put this workflow into action to deploy to production!

### Activity 2: Merge your pull request
1. You can now [merge](https://docs.github.com/en/get-started/quickstart/github-glossary#merge) your pull request!
1. Click **Merge pull request** and leave this tab open as we will be applying a label to the closed pull request in the next step.
1. Now we just have to wait for the package to be published to GitHub Container Registry and the deployment to occur. When the workflow is finished running, refresh this page for the next step.


</details>

<details id=6>
<summary><h2>Step 6: Production deployment</h2></summary>

### Nice work!
Great work, you've done it! You should be able to see your container image in the **Packages** section of your account and you can get the deployment URL in the Actions log, just like the staging URL.

### The cloud environment
Throughout the course you've spun up resources that, if left unattended, could incur billing or consume your free minutes from the cloud provider. Once you have verified your application in production, let's tear down those environments so that you can keep your minutes for more learning!

### Activity 1: Destroy any running resources so you don't incur charges

1. Apply the **destroy environment** label to your merged `production-deployment-workflow` pull request. If you have already closed the tab with your pull request, you can open it again by clicking **Pull requests** and then clicking the **Closed** filter to view merged pull requests.

  Now that you've applied the proper label, let's wait for the GitHub Actions workflow to complete. When it's finished, you can confirm that your environment has been destroyed by visiting your app's URL, or by logging into the Azure portal to see it is not running.

1. Wait about 20 seconds then refresh this page for the next step.

</details>

<!--
  <<< Author notes: Finish >>>
  Review what we learned, ask for feedback, provide next steps.
-->

<details id=7>
<summary><h2>Finish</h2></summary>

### Congratulations, you've completed this course!

Here's a recap of all the tasks you've accomplished in your repository:

- Trigger a job based on labels
- Set up the Azure environment
- Spin up environment based on labels
- Deploy to a staging environment based on labels
- Deploy to a production environment based on labels
- Destroy environment based on labels

### What's next?

- [We'd love to hear what you thought of this course](TBD-feedback-link).
- [Take another GitHub Skills Course](https://github.com/skills).
- [Read the GitHub Getting Started docs](https://docs.github.com/en/get-started).
- To find projects to contribute to, check out [GitHub Explore](https://github.com/explore).

</details>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---
Get help: [Post in our discussion board](https://github.com/skills/.github/discussions) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2022 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [CC-BY-4.0 License](https://creativecommons.org/licenses/by/4.0/legalcode)

