<!--
  <<< Author notes: Step 3 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
-->

## Step 3: Spin up an environment based on labels

_Nicely done! :heart:_

GitHub Actions is cloud agnostic, so any cloud will work. We'll show how to deploy to Azure in this course.

**What are _Azure resources_?** In Azure, a resource is an entity managed by Azure. We'll use the following Azure resources in this course:

- A [web app](https://docs.microsoft.com/en-us/azure/app-service/overview) is how we'll be deploying our application to Azure.
- A [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview#resource-groups) is a collection of resources, like web apps and virtual machines (VMs).
- An [App Service plan](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans) is what runs our web app and manages the billing (our app should run for free).

Through the power of GitHub Actions, we can create, configure, and destroy these resources through our workflow files.

### :keyboard: Activity 1: Set up a personal access token (PAT)

Personal access tokens (PATs) are an alternative to using passwords for authentication to GitHub. We will use a PAT to allow your web app to pull the container image after your workflow pushes a newly built image to the registry.

1. Open a new browser tab, and work on the steps in your second tab while you read the instructions in this tab.
2. Create a personal access token with the `repo` and `read:packages` scopes. For more information, see ["Creating a personal access token."](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
3. Once you have generated the token we will need to store it in a secret so that it can be used within a workflow. Create a new repository secret named `CR_PAT` and paste the PAT token in as the value.
4. With this done we can move on to setting up our workflow.

**Configuring your Azure environment**

To deploy successfully to our Azure environment:

1. Create a new branch called `azure-configuration` by clicking on the branch dropdown on the top, left hand corner of the `Code` tab on your repository page.
2. Once you're in the new `azure-configuration` branch, go into the `.github/workflows` directory and create a new file titled `spinup-destroy.yml` by clicking **Add file**.

Copy and paste the following into this new file:

```yaml
name: Configure Azure environment

on:
  pull_request:
    types: [labeled]

env:
  IMAGE_REGISTRY_URL: ghcr.io
  AZURE_RESOURCE_GROUP: cd-with-actions
  AZURE_APP_PLAN: actions-ttt-deployment
  AZURE_LOCATION: '"Central US"'
  ###############################################
  ### Replace <username> with GitHub username ###
  ###############################################
  AZURE_WEBAPP_NAME: <username>-ttt-app

jobs:
  setup-up-azure-resources:
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'spin up environment')
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Azure login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Create Azure resource group
        if: success()
        run: |
          az group create --location ${{env.AZURE_LOCATION}} --name ${{env.AZURE_RESOURCE_GROUP}} --subscription ${{secrets.AZURE_SUBSCRIPTION_ID}}

      - name: Create Azure app service plan
        if: success()
        run: |
          az appservice plan create --resource-group ${{env.AZURE_RESOURCE_GROUP}} --name ${{env.AZURE_APP_PLAN}} --is-linux --sku F1 --subscription ${{secrets.AZURE_SUBSCRIPTION_ID}}

      - name: Create webapp resource
        if: success()
        run: |
          az webapp create --resource-group ${{ env.AZURE_RESOURCE_GROUP }} --plan ${{ env.AZURE_APP_PLAN }} --name ${{ env.AZURE_WEBAPP_NAME }}  --deployment-container-image-name nginx --subscription ${{secrets.AZURE_SUBSCRIPTION_ID}}

      - name: Configure webapp to use GHCR
        if: success()
        run: |
          az webapp config container set --docker-custom-image-name nginx --docker-registry-server-password ${{secrets.CR_PAT}} --docker-registry-server-url https://${{env.IMAGE_REGISTRY_URL}} --docker-registry-server-user ${{github.actor}} --name ${{ env.AZURE_WEBAPP_NAME }} --resource-group ${{ env.AZURE_RESOURCE_GROUP }} --subscription ${{secrets.AZURE_SUBSCRIPTION_ID}}

  destroy-azure-resources:
    runs-on: ubuntu-latest

    if: contains(github.event.pull_request.labels.*.name, 'destroy environment')

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Azure login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Destroy Azure environment
        if: success()
        run: |
          az group delete --name ${{env.AZURE_RESOURCE_GROUP}} --subscription ${{secrets.AZURE_SUBSCRIPTION_ID}} --yes
```

3. Click **Commit changes...** and select `Commit directly to the azure-configuration branch.` before clicking **Commit changes**.
4. Go to the Pull requests tab of the repository.
5. There should be a yellow banner with the `azure-configuration` branch where you can click **Compare & pull request**.
6. Set the title of the Pull request to: `Added spinup-destroy.yml workflow` and click `Create pull request`.

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
1. Creates an [App Service plan](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans) by running [`az appservice plan create`](https://docs.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) on the Azure CLI.
1. Creates a [web app](https://docs.microsoft.com/en-us/azure/app-service/overview) by running [`az webapp create`](https://docs.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) on the Azure CLI.
1. Configures the newly created web app to use [GitHub Packages](https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages) by using [`az webapp config`](https://docs.microsoft.com/en-us/cli/azure/webapp/config?view=azure-cli-latest) on the Azure CLI. Azure can be configured to use its own [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/), [DockerHub](https://docs.docker.com/docker-hub/), or a custom (private) registry. In this case, we'll configure GitHub Packages as a custom registry.

**Destroying Azure resources**

The second job destroys Azure resources so that you do not use your free minutes or incur billing. The job works as follows:

1. Logs into your Azure account with the [`azure/login`](https://github.com/Azure/login) action. The `AZURE_CREDENTIALS` secret you created earlier is used for authentication.
1. Deletes the resource group we created earlier using [`az group delete`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az-group-delete) on the Azure CLI.

### :keyboard: Activity 2: Apply labels to create resources

1. Edit the `spinup-destroy.yml` file in your open pull request and replace any `<username>` placeholders with your GitHub username. Commit this change directly to the `azure-configuration` branch.
1. Back in the Pull request, create and apply the `spin up environment` label to your open pull request
1. Wait for the GitHub Actions workflow to run and spin up your Azure environment. You can follow along in the Actions tab or in the pull request merge box.
1. Wait about 20 seconds then refresh this page (the one you're following instructions from). [GitHub Actions](https://docs.github.com/en/actions) will automatically update to the next step.
