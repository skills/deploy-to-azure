<!--
  <<< Author notes: Step 2 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
-->

## Step 2: Set up an Azure environment

_Good job getting started :gear:_

### Nice work triggering a job on specific labels

We won't be going into detail on the steps of this workflow, but it would be a good idea to become familiar with the actions we're using. They are:

- [`actions/checkout`](https://github.com/actions/checkout)
- [`actions/upload-artifact`](https://github.com/actions/upload-artifact)
- [`actions/download-artifact`](https://github.com/actions/download-artifact)
- [`docker/login-action`](https://github.com/docker/login-action)
- [`docker/build-push-action`](https://github.com/docker/build-push-action)
- [`azure/login`](https://github.com/Azure/login)
- [`azure/webapps-deploy`](https://github.com/Azure/webapps-deploy)

### :keyboard: Activity 1: Store your credentials in GitHub secrets and finish setting up your workflow

1.  In a new tab, [create an Azure account](https://azure.microsoft.com/en-us/free/) if you don't already have one. If your Azure account is created through work, you may encounter issues accessing the necessary resources -- we recommend creating a new account for personal use and for this course.
    > **Note**: You may need a credit card to create an Azure account. If you're a student, you may also be able to take advantage of the [Student Developer Pack](https://education.github.com/pack) for access to Azure. If you'd like to continue with the course without an Azure account, Skills will still respond, but none of the deployments will work.
1.  Create a [new subscription](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription) in the Azure Portal.
    > **Note**: your subscription must be configured "Pay as you go" which will require you to enter billing information. This course will only use a few minutes from your free plan, but Azure requires the billing information.
1.  Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) on your machine.
1.  In your terminal, run:
    ```shell
    az login
    ```
1.  Copy the value of the `id:` field to a safe place. We'll call this `AZURE_SUBSCRIPTION_ID`. Here's an example of what it looks like:
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
1.  In your terminal, run the command below.

    ````shell
    az ad sp create-for-rbac --name "GitHub-Actions" --role contributor \
     --scopes /subscriptions/{subscription-id} \
     --sdk-auth

        # Replace {subscription-id} with the same id stored in AZURE_SUBSCRIPTION_ID.
        ```

    > **Note**: The `\` character works as a line break on Unix based systems. If you are on a Windows based system the `\` character will cause this command to fail. Place this command on a single line if you are using Windows.\*\*

    ````

1.  Copy the entire contents of the command's response, we'll call this `AZURE_CREDENTIALS`. Here's an example of what it looks like:
    ```shell
    {
      "clientId": "<GUID>",
      "clientSecret": "<GUID>",
      "subscriptionId": "<GUID>",
      "tenantId": "<GUID>",
      (...)
    }
    ```
1.  Back on GitHub, click on this repository's **Secrets and variables > Actions** in the Settings tab.
1.  Click **New repository secret**
1.  Name your new secret **AZURE_SUBSCRIPTION_ID** and paste the value from the `id:` field in the first command.
1.  Click **Add secret**.
1.  Click **New repository secret** again.
1.  Name the second secret **AZURE_CREDENTIALS** and paste the entire contents from the second terminal command you entered.
1.  Click **Add secret**
1.  Go back to the Pull requests tab and in your pull request go to the **Files Changed** tab. Find and then edit the `.github/workflows/deploy-staging.yml` file to use some new actions.

The full workflow file, should look like this:

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
      - uses: actions/checkout@v3
      - name: npm install and build webpack
        run: |
          npm install
          npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: webpack artifacts
          path: public/

  Build-Docker-Image:
    runs-on: ubuntu-latest
    needs: build
    name: Build image and store in GitHub Container Registry
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Download built artifact
        uses: actions/download-artifact@v3
        with:
          name: webpack artifacts
          path: public

      - name: Log in to GHCR
        uses: docker/login-action@v2
        with:
          registry: ${{ env.IMAGE_REGISTRY_URL }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{env.IMAGE_REGISTRY_URL}}/${{ github.repository }}/${{env.DOCKER_IMAGE_NAME}}
          tags: |
            type=sha,format=long,prefix=

      - name: Build and push Docker image
        uses: docker/build-push-action@v3
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

      - name: Azure logout via Azure CLI
        uses: azure/CLI@v1
        with:
          inlineScript: |
            az logout
            az cache purge
            az account clear
```

16. After you've edited the file, click **Commit changes...** and commit to the `staging-workflow` branch.
17. Wait about 20 seconds then refresh this page (the one you're following instructions from). [GitHub Actions](https://docs.github.com/en/actions) will automatically update to the next step.
